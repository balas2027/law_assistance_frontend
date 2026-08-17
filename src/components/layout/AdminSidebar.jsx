import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';
import { cx } from '../../lib/utils';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/dashboard', label: 'Content CMS', icon: 'edit_note', active: true },
  { to: '/admin/dashboard', label: 'User Analytics', icon: 'analytics' },
  { to: '/admin/quiz-builder/demo', label: 'Quiz Builder', icon: 'quiz' },
  { to: '/admin/dashboard', label: 'Platform Settings', icon: 'settings' },
];

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="bg-surface border-r border-outline-variant shadow-sm hidden md:flex flex-col h-full w-64 z-20 flex-shrink-0 relative">
      <div className="px-6 py-8 flex flex-col items-start border-b border-outline-variant/50">
        <h1 className="font-h2 text-h2 font-bold text-primary tracking-tight">NyayaAI Academy</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-200',
                isActive && 'bg-surface-container text-primary font-bold border-r-4 border-primary',
              )
            }
          >
            <Icon name={item.icon} size={20} fill={item.active} />
            <span className="font-body-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4">
        <button className="w-full bg-primary-container text-on-primary text-center py-3 rounded-full font-label-caps text-label-caps font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2">
          <Icon name="add" size={18} />
          Draft New Lesson
        </button>
      </div>

      <div className="mt-auto border-t border-outline-variant/50 pt-4 pb-6 px-3 flex flex-col gap-1">
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-200"
        >
          <Icon name="help_center" size={18} />
          <span className="font-label-caps text-label-caps">Support</span>
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-200"
        >
          <Icon name="logout" size={18} />
          <span className="font-label-caps text-label-caps">Sign Out</span>
        </button>
        <div className="mt-4 px-4 flex items-center gap-3">
          <Avatar name="Admin Profile" size="sm" />
          <span className="font-label-caps text-label-caps text-primary">Admin Profile</span>
        </div>
      </div>
    </aside>
  );
}
