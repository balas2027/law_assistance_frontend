import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md antialiased">
      <Outlet />
    </div>
  );
}
