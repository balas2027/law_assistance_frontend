import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../../ui/Icon';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAuth } from '../../../hooks/useAuth';

export default function LanguageSelectModal() {
  const {
    isModalOpen,
    closeModal,
    languages,
    preferred_language,
    selectLanguage,
    fetchLanguages,
  } = useLanguage();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      fetchLanguages();
      setSearchQuery('');
    }
  }, [isModalOpen, fetchLanguages]);

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const filteredLanguages = languages.filter((lang) => {
    if (!query) return true;
    const nameMatch = lang.name.toLowerCase().includes(query);
    const nativeMatch = lang.native_name.toLowerCase().includes(query);
    const codeMatch = lang.code.toLowerCase().includes(query);
    return nameMatch || nativeMatch || codeMatch;
  });

  const handleRowClick = (lang) => {
    if (!lang.enabled) return;
    selectLanguage(lang.code, token);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-2xl shadow-level-2 border border-gray-200/90 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up"
      >
        {/* Blue Header Bar */}
        <div className="bg-[#0b57d0] px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Icon name="translate" size={22} className="text-blue-100" />
            <h2 className="text-[19px] font-bold tracking-tight text-white">Select Language</h2>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col flex-1 min-h-0 bg-[#fafbfc]">
          {/* Search Input Box */}
          <div className="relative mb-4 shrink-0">
            <Icon
              name="search"
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language or script..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>

          {/* Scrollable Languages List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[340px] border border-gray-100 rounded-xl p-1 bg-white shadow-2xs">
            {filteredLanguages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No languages found matching "{searchQuery}"
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = preferred_language === lang.code;
                const isEnabled = lang.enabled !== false;

                return (
                  <div
                    key={lang.code}
                    onClick={() => handleRowClick(lang)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-[14px] transition-all flex items-center justify-between border ${
                      !isEnabled
                        ? 'opacity-50 cursor-not-allowed bg-gray-50/70 border-gray-100 text-gray-400 select-none'
                        : isSelected
                        ? 'bg-blue-50/90 border-blue-200 text-[#0b57d0] font-semibold shadow-2xs cursor-pointer'
                        : 'bg-white border-transparent text-gray-800 hover:bg-blue-50/50 hover:text-[#0b57d0] hover:border-blue-100 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="font-medium truncate">
                        {lang.name} {lang.native_name ? `(${lang.native_name})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isEnabled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-600 uppercase tracking-wider">
                          Coming soon
                        </span>
                      ) : isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#0b57d0] text-white flex items-center justify-center shadow-2xs">
                          <Icon name="check" size={15} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-3 text-center text-[11 font-medium text-gray-400">
            Click any available language to set your preferred reply language instantly.
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
