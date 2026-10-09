// Real metadata and custom description storage for YouTube Shorts from @elshaddaigroup
// Persists real user-entered details in browser storage

export interface ShortCustomMetadata {
  youtubeId: string;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'sunil_shorts_custom_metadata_v1';

export const getShortCustomMetadata = (youtubeId: string): ShortCustomMetadata | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const map: Record<string, ShortCustomMetadata> = JSON.parse(raw);
    return map[youtubeId] || null;
  } catch {
    return null;
  }
};

export const getAllShortsCustomMetadata = (): Record<string, ShortCustomMetadata> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveShortCustomMetadata = (metadata: ShortCustomMetadata): void => {
  try {
    const map = getAllShortsCustomMetadata();
    map[metadata.youtubeId] = {
      ...map[metadata.youtubeId],
      ...metadata,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('sunil_shorts_updated', { detail: metadata }));
  } catch (err) {
    console.error('Failed to save shorts metadata:', err);
  }
};

export const deleteShortCustomMetadata = (youtubeId: string): void => {
  try {
    const map = getAllShortsCustomMetadata();
    delete map[youtubeId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent('sunil_shorts_updated', { detail: { youtubeId } }));
  } catch (err) {
    console.error('Failed to remove shorts metadata:', err);
  }
};
