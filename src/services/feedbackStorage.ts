import { testimonialsData, Testimonial } from '../data/testimonialsData';

const PRIMARY_STORAGE_KEY = 'el_shaddai_client_reviews';
const LEGACY_STORAGE_KEY = 'sunil_woodworks_client_reviews';
const IDB_NAME = 'el_shaddai_reviews_db';
const IDB_STORE = 'reviews_store';

// In-memory cache for ultra-fast, synchronous access
let memoryCustomReviews: Testimonial[] = [];
let isInitialized = false;

// Open IndexedDB helper
const openReviewsDB = (): Promise<IDBDatabase | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

// Save to IndexedDB
const saveReviewToIDB = async (review: Testimonial) => {
  try {
    const db = await openReviewsDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put(review);
  } catch (err) {
    console.warn('IDB write failed:', err);
  }
};

// Read all from IndexedDB
const getAllReviewsFromIDB = async (): Promise<Testimonial[]> => {
  try {
    const db = await openReviewsDB();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
};

// Helper: Read reviews from localStorage (checking both primary and legacy keys)
const readFromLocalStorage = (): Testimonial[] => {
  if (typeof window === 'undefined') return [];
  try {
    const primary = localStorage.getItem(PRIMARY_STORAGE_KEY);
    if (primary) {
      const parsed = JSON.parse(primary);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading reviews from localStorage:', err);
  }
  return [];
};

// Helper: Save to localStorage across both keys
const persistToLocalStorage = (reviews: Testimonial[]) => {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(reviews);
    localStorage.setItem(PRIMARY_STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Error writing reviews to localStorage:', err);
  }
};

// Deduplicate helper
const deduplicateReviews = (list: Testimonial[]): Testimonial[] => {
  const seenIds = new Set<string>();
  const seenQuotes = new Set<string>();
  const result: Testimonial[] = [];

  for (const item of list) {
    const signature = `${item.clientName}_${item.quote}`.toLowerCase();
    if (seenIds.has(item.id) || seenQuotes.has(signature)) {
      continue;
    }
    seenIds.add(item.id);
    seenQuotes.add(signature);
    result.push(item);
  }

  return result;
};

// Initialize in-memory cache from localStorage on script evaluation
if (typeof window !== 'undefined') {
  memoryCustomReviews = readFromLocalStorage();
}

/**
 * Synchronous getter: Returns base reviews merged with any custom stored reviews.
 * Safe to call inside useState(() => getStoredTestimonials())
 */
export const getStoredTestimonials = (): Testimonial[] => {
  if (typeof window !== 'undefined' && memoryCustomReviews.length === 0) {
    memoryCustomReviews = readFromLocalStorage();
  }
  const combined = [...memoryCustomReviews, ...testimonialsData];
  return deduplicateReviews(combined);
};

/**
 * Async Sync: Queries server API (/api/feedback) and IndexedDB, merges with local state,
 * and notifies listeners if new reviews are discovered.
 */
export const syncRemoteAndLocalReviews = async (): Promise<Testimonial[]> => {
  let hasNew = false;
  const currentReviews = [...memoryCustomReviews];

  // 1. Try fetching from IndexedDB
  try {
    const idbReviews = await getAllReviewsFromIDB();
    for (const r of idbReviews) {
      if (!currentReviews.some((c) => c.id === r.id)) {
        currentReviews.push(r);
        hasNew = true;
      }
    }
  } catch (e) {
    console.warn('Error syncing with IndexedDB:', e);
  }

  // 2. Try fetching from Server API (/api/feedback or /api/reviews)
  try {
    const res = await fetch('/api/feedback', {
      headers: { Accept: 'application/json' },
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const serverReviews: Testimonial[] = await res.json();
      if (Array.isArray(serverReviews)) {
        for (const s of serverReviews) {
          if (!currentReviews.some((c) => c.id === s.id)) {
            currentReviews.unshift(s);
            hasNew = true;
          }
        }
      }
    }
  } catch (e) {
    // Server endpoint not reachable or static-only host; graceful fallback
  }

  if (hasNew) {
    const deduped = deduplicateReviews(currentReviews);
    memoryCustomReviews = deduped;
    persistToLocalStorage(deduped);
    for (const r of deduped) {
      saveReviewToIDB(r);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sunil_woodworks_review_added'));
    }
  }

  return getStoredTestimonials();
};

/**
 * Save a newly written client testimonial with multi-tier persistence:
 * 1. In-memory immediately
 * 2. LocalStorage immediately
 * 3. IndexedDB
 * 4. Server API (/api/feedback)
 */
export const saveNewTestimonial = (
  review: Omit<Testimonial, 'id' | 'date' | 'verifiedProject'>
): Testimonial => {
  const newReview: Testimonial = {
    ...review,
    id: `custom-review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    verifiedProject: true,
  };

  // 1. Memory update
  memoryCustomReviews = deduplicateReviews([newReview, ...memoryCustomReviews]);

  // 2. LocalStorage persistence
  persistToLocalStorage(memoryCustomReviews);

  // 3. IndexedDB persistence (async)
  saveReviewToIDB(newReview);

  // 4. Server API POST persistence (async)
  if (typeof window !== 'undefined') {
    fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    }).catch((err) => {
      console.warn('Server feedback sync offline (saved to browser cache):', err);
    });

    // Notify all UI components immediately
    window.dispatchEvent(new CustomEvent('sunil_woodworks_review_added'));
  }

  return newReview;
};
