// Central backend API endpoint configuration.
// All API modules import from here so the backend URL is defined once.
export const BACKEND_URL = 'http://localhost:8000';
export const API_BASE = import.meta.env.VITE_API_BASE || `${BACKEND_URL}/api/v1`;