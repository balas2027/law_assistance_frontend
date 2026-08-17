import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export function RequireRole({ roles, orSuperuser = false, children }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = user.user_type || user.role;
  const allowed = (roles && roles.includes(userRole)) || (orSuperuser && user.is_superuser);
  if (!allowed) {
    return <Navigate to="/forbidden" replace />;
  }
  return children;
}