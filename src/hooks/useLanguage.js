import { useLanguageStore } from '../stores/languageStore';

export const useLanguage = () => {
  const preferred_language = useLanguageStore((s) => s.preferred_language);
  const preferred_language_name = useLanguageStore((s) => s.preferred_language_name);
  const preferred_language_native = useLanguageStore((s) => s.preferred_language_native);
  const languages = useLanguageStore((s) => s.languages);
  const isModalOpen = useLanguageStore((s) => s.isModalOpen);
  const loading = useLanguageStore((s) => s.loading);
  const initialized = useLanguageStore((s) => s.initialized);
  const setModalOpen = useLanguageStore((s) => s.setModalOpen);
  const openModal = useLanguageStore((s) => s.openModal);
  const closeModal = useLanguageStore((s) => s.closeModal);
  const selectLanguage = useLanguageStore((s) => s.selectLanguage);
  const initLanguagePreferences = useLanguageStore((s) => s.initLanguagePreferences);
  const fetchLanguages = useLanguageStore((s) => s.fetchLanguages);

  return {
    preferred_language,
    preferred_language_name,
    preferred_language_native,
    languages,
    isModalOpen,
    loading,
    initialized,
    setModalOpen,
    openModal,
    closeModal,
    selectLanguage,
    initLanguagePreferences,
    fetchLanguages,
  };
};
