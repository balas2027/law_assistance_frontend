import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_LANGUAGES,
  fetchLanguagesApi,
  fetchUserPreferencesApi,
  updateUserPreferencesApi,
} from '../lib/api/language';

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      preferred_language: null,
      preferred_language_name: null,
      preferred_language_native: null,
      languages: DEFAULT_LANGUAGES,
      isModalOpen: false,
      loading: false,
      initialized: false,

      setModalOpen: (open) => set({ isModalOpen: open }),
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),

      fetchLanguages: async () => {
        set({ loading: true });
        try {
          const list = await fetchLanguagesApi();
          set({ languages: list, loading: false });
          return list;
        } catch {
          set({ loading: false });
          return get().languages;
        }
      },

      initLanguagePreferences: async (token = null) => {
        set({ loading: true });
        try {
          const [languagesList, prefs] = await Promise.all([
            fetchLanguagesApi(),
            fetchUserPreferencesApi(token),
          ]);

          const prefCode = prefs?.preferred_language || get().preferred_language || null;
          const foundLang = languagesList.find((l) => l.code === prefCode);

          const newState = {
            languages: languagesList,
            preferred_language: prefCode,
            preferred_language_name: foundLang ? foundLang.name : null,
            preferred_language_native: foundLang ? foundLang.native_name : null,
            loading: false,
            initialized: true,
          };

          // If preferred_language is null on initial check, show modal automatically (Requirement 2a)
          if (!prefCode) {
            newState.isModalOpen = true;
          }

          set(newState);
        } catch {
          set({ loading: false, initialized: true });
        }
      },

      selectLanguage: async (code, token = null) => {
        const languagesList = get().languages.length > 0 ? get().languages : DEFAULT_LANGUAGES;
        const selectedObj = languagesList.find((l) => l.code === code);

        if (selectedObj && !selectedObj.enabled) {
          return; // Ignore selection for disabled languages
        }

        const name = selectedObj ? selectedObj.name : code;
        const nativeName = selectedObj ? selectedObj.native_name : code;

        set({
          preferred_language: code,
          preferred_language_name: name,
          preferred_language_native: nativeName,
          isModalOpen: false,
        });

        try {
          await updateUserPreferencesApi(code, token);
        } catch {
          // Local state already updated cleanly
        }
      },
    }),
    {
      name: 'nyayaai-language-preferences',
      partialize: (state) => ({
        preferred_language: state.preferred_language,
        preferred_language_name: state.preferred_language_name,
        preferred_language_native: state.preferred_language_native,
      }),
    },
  ),
);
