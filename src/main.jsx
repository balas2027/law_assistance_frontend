import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useUiStore } from './stores/uiStore';

// Global fetch interceptor to show loader on mutations
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const method = args[1]?.method || 'GET';
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase());
  
  if (isMutation) {
    useUiStore.getState().setLoading(true);
  }
  
  try {
    return await originalFetch(...args);
  } finally {
    if (isMutation) {
      useUiStore.getState().setLoading(false);
    }
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
