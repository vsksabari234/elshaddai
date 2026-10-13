import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../config/firebase';
import { testimonialsData, Testimonial } from '../data/testimonialsData';

const COLLECTION_NAME = 'feedback';
const LOCAL_STORAGE_KEY = 'el_shaddai_client_reviews';

// Load any cached reviews on initialization for zero-delay first paint
let initialCached: Testimonial[] = [];
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) initialCached = parsed;
    }
  } catch {}
}

// In-memory cache starting with cached custom reviews + base testimonials
let memoryReviews: Testimonial[] = deduplicateReviews([...initialCached, ...testimonialsData]);

function deduplicateReviews(list: Testimonial[]): Testimonial[] {
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
}

/**
 * Synchronous getter: Returns current reviews in memory
 */
export const getStoredTestimonials = (): Testimonial[] => {
  return memoryReviews;
};

/**
 * Real-time listener: Subscribes to Firestore collection changes in real time.
 * Automatically synchronizes reviews across all devices and visitors.
 */
export const subscribeToFeedback = (callback: (reviews: Testimonial[]) => void): (() => void) => {
  const feedbackCol = collection(db, COLLECTION_NAME);

  // Send current cached reviews right away
  callback(memoryReviews);

  const unsubscribe = onSnapshot(
    feedbackCol,
    (snapshot) => {
      const firestoreItems: Testimonial[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          clientName: data.clientName || 'Client',
          clientRole: data.clientRole || 'Homeowner',
          projectType: data.projectType || 'Custom Woodwork',
          location: data.location || 'Bengaluru',
          quote: data.quote || '',
          date: data.date || '',
          rating: Number(data.rating) || 5,
          verifiedProject: data.verifiedProject ?? true,
        };
      });

      // Merge real-time items from Firestore with base catalog reviews
      const combined = deduplicateReviews([...firestoreItems, ...testimonialsData]);
      memoryReviews = combined;

      // Update localStorage cache for offline/instant resume
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(firestoreItems));
      } catch {}

      callback(combined);
    },
    (error) => {
      // CRITICAL: Handle Firestore error using the required handler
      try {
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      } catch (e) {
        console.warn('Real-time feedback listener error (using cached reviews):', e);
      }
    }
  );

  return unsubscribe;
};

/**
 * Save new feedback to Firestore:
 * Writes directly to the shared Cloud Firestore collection so it is visible to all devices immediately.
 */
export const saveNewTestimonial = async (
  review: Omit<Testimonial, 'id' | 'date' | 'verifiedProject'>
): Promise<Testimonial> => {
  const docId = `review_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const createdAtStr = new Date().toISOString();

  const newReview: Testimonial = {
    ...review,
    id: docId,
    date: dateStr,
    verifiedProject: true,
  };

  const firestorePayload = {
    id: docId,
    clientName: review.clientName.trim(),
    clientRole: review.clientRole ? review.clientRole.trim() : 'Homeowner',
    projectType: review.projectType.trim(),
    location: review.location ? review.location.trim() : 'Bengaluru',
    quote: review.quote.trim(),
    rating: Number(review.rating) || 5,
    verifiedProject: true,
    date: dateStr,
    createdAt: createdAtStr,
  };

  const docPath = `${COLLECTION_NAME}/${docId}`;

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, firestorePayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, docPath);
  }

  // Update local memory and broadcast event
  memoryReviews = deduplicateReviews([newReview, ...memoryReviews]);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sunil_woodworks_review_added'));
  }

  return newReview;
};
