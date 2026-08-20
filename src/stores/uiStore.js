import { create } from 'zustand';

let toastId = 0;

export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  isLoading: false,
  loadingMessage: '',
  toasts: [],
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setLoading: (isLoading, loadingMessage = '') => set({ isLoading, loadingMessage }),

  addToast: (message, type = 'success') => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));