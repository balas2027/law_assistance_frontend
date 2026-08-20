import { API_BASE } from '../api_endpoint';

export const DEFAULT_LANGUAGES = [
  { code: 'en', name: 'English', native_name: 'English', enabled: true },
  { code: 'ta', name: 'Tamil', native_name: 'தமிழ்', enabled: true },
  { code: 'hi', name: 'Hindi', native_name: 'हिन्दी', enabled: true },
  { code: 'te', name: 'Telugu', native_name: 'తెలుగు', enabled: true },
  { code: 'kn', name: 'Kannada', native_name: 'கன்னட / ಕನ್ನಡ', enabled: true },
  { code: 'ml', name: 'Malayalam', native_name: 'മലയാളം', enabled: true },
  { code: 'bn', name: 'Bengali', native_name: 'বাংলা', enabled: true },
  { code: 'mr', name: 'Marathi', native_name: 'मराठी', enabled: true },
  { code: 'gu', name: 'Gujarati', native_name: 'ગુજરાતી', enabled: true },
  { code: 'pa', name: 'Punjabi', native_name: 'ਪੰਜਾਬੀ', enabled: false },
  { code: 'or', name: 'Odia', native_name: 'ଓଡ଼ିଆ', enabled: false },
  { code: 'as', name: 'Assamese', native_name: 'অসমীয়া', enabled: false },
  { code: 'ur', name: 'Urdu', native_name: 'اردو', enabled: false },
];

async function handle(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    // ignore empty body
  }
  if (!res.ok) {
    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : data.detail?.[0]?.msg || 'Request failed';
    throw new Error(detail);
  }
  return data;
}

export async function fetchLanguagesApi() {
  try {
    const res = await fetch(`${API_BASE}/languages`);
    if (!res.ok) return DEFAULT_LANGUAGES;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_LANGUAGES;
  } catch {
    return DEFAULT_LANGUAGES;
  }
}

export async function fetchUserPreferencesApi(token = null) {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/user/preferences`, { headers });
    return await handle(res);
  } catch {
    // Fallback if backend API endpoint unavailable
    return { preferred_language: null };
  }
}

export async function updateUserPreferencesApi(preferred_language, token = null) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/user/preferences`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ preferred_language }),
    });
    return await handle(res);
  } catch {
    // Graceful fallback for offline mode
    return { preferred_language };
  }
}
