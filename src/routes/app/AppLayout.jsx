import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import LanguageSelectModal from '../../components/features/language/LanguageSelectModal';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';

export default function AppLayout() {
  const { initLanguagePreferences } = useLanguage();
  const { token } = useAuth();

  useEffect(() => {
    initLanguagePreferences(token);
  }, [initLanguagePreferences, token]);

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased">
      <Toast />
      <LanguageSelectModal />
      <Outlet />
    </div>
  );
}
