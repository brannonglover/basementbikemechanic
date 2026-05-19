const BIKES_STORAGE_KEY = 'basementbikemechanic_bikes';
const BIKES_API_URL = "/.netlify/functions/bikes";
const ADMIN_AUTH_API_URL = "/.netlify/functions/admin-auth";
const FETCH_RETRIES = 2;
const FETCH_RETRY_DELAY_MS = 600;

async function fetchJsonWithRetry(url, options = {}) {
  let lastError;

  for (let attempt = 0; attempt <= FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        ...options,
      });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < FETCH_RETRIES) {
        await new Promise((resolve) => {
          setTimeout(resolve, FETCH_RETRY_DELAY_MS * (attempt + 1));
        });
      }
    }
  }

  throw lastError;
}

function normalizeBikes(bikes) {
  return (Array.isArray(bikes) ? bikes : []).filter(
    (b) => b.name && b.name.trim() && Array.isArray(b.images) && b.images.length > 0
  );
}

function loadStoredBikes() {
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
  return null;
}

function loadBikesFromStorage(configBikes) {
  const stored = loadStoredBikes();
  return stored || configBikes || [];
}

export function getBikes(configBikes) {
  const storedBikes = normalizeBikes(loadStoredBikes());
  if (storedBikes.length > 0) {
    return storedBikes;
  }
  return normalizeBikes(configBikes);
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

export async function fetchBikes(configBikes) {
  try {
    const data = await fetchJsonWithRetry(BIKES_API_URL);
    const databaseBikes = normalizeBikes(data.bikes);
    if (databaseBikes.length > 0) {
      return databaseBikes;
    }
  } catch (e) {
    console.warn('Failed to load bikes from database', e);
  }
  return getBikes(configBikes);
}

export async function fetchBikeById(bikeId) {
  const data = await fetchJsonWithRetry(`${BIKES_API_URL}?id=${encodeURIComponent(bikeId)}`);
  const [bike] = normalizeBikes(data.bike ? [data.bike] : []);
  return bike || null;
}

export async function fetchAllBikesForAdmin(configBikes) {
  try {
    const data = await fetchJsonWithRetry(`${BIKES_API_URL}?full=true`);
    if (Array.isArray(data.bikes) && data.bikes.length > 0) {
      return data.bikes;
    }
  } catch (e) {
    console.warn('Failed to load admin bikes from database', e);
  }
  return getAllBikesForAdmin(configBikes);
}

export async function authenticateAdmin(password) {
  try {
    const response = await fetch(ADMIN_AUTH_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    return response.ok && data.ok === true;
  } catch (e) {
    console.warn('Failed to authenticate admin against database API', e);
    return false;
  }
}

export async function saveBikesToDatabase(bikes, adminPassword) {
  const response = await fetch(BIKES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": adminPassword || "",
    },
    body: JSON.stringify({ bikes }),
  });

  if (!response.ok) {
    let message = `Bike listings save failed with ${response.status}`;
    try {
      const data = await response.json();
      message = data.error || message;
    } catch (e) {
      // Keep the status-based message.
    }
    throw new Error(message);
  }

  const data = await response.json();
  saveBikes(data.bikes || bikes);
  return data.bikes || bikes;
}
