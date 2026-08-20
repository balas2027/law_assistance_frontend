import { Outlet } from 'react-router-dom';
import Toast from '../../components/ui/Toast';
import GlobalLoader from '../../components/shared/GlobalLoader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans antialiased selection:bg-[#0b57d0] selection:text-white">
      <GlobalLoader />
      <Toast />
      <Outlet />
    </div>
  );
}