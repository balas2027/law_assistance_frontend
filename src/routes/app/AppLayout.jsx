import { Outlet } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import GlobalLoader from '../../components/shared/GlobalLoader';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased">
      <GlobalLoader />
      <Toast />
      <Outlet />
    </div>
  );
}
