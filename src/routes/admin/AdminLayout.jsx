import { Outlet } from 'react-router-dom';
import Toast from '../../components/ui/Toast';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased">
      <Toast />
      <Outlet />
    </div>
  );
}