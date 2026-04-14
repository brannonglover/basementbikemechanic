const BIKES_STORAGE_KEY = 'basementbikemechanic_bikes';

function loadBikesFromStorage(configBikes) {
  try {
    const stored = localStorage.getItem(BIKES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load bikes from localStorage', e);
  }
  return configBikes || [];
}

export function getBikes(configBikes) {
  const all = loadBikesFromStorage(configBikes);
  return all.filter((b) => b.name && b.name.trim() && Array.isArray(b.images) && b.images.length > 0);
}

export function getAllBikesForAdmin(configBikes) {
  return loadBikesFromStorage(configBikes);
}

export function saveBikes(bikes) {
  try {
    localStorage.setItem(BIKES_STORAGE_KEY, JSON.stringify(bikes));
  } catch (e) {
    console.error('Failed to save bikes to localStorage', e);
    throw e;
  }
}
