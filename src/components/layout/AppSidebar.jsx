import { NavLink } from 'react-router-dom';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { cx } from '../../lib/utils';

const NAV_ITEMS = {
  chat: [
    { to: '/chat', label: 'Chat History', icon: 'history' },
    { to: '/chat', label: 'Legal Documents', icon: 'description' },
    { to: '/chat', label: 'Bookmarks', icon: 'bookmark' },
    { to: '/chat', label: 'Criminal Law', icon: 'gavel', group: 'Domains' },
    { to: '/chat', label: 'Civil Law', icon: 'balance' },
  ],
  academy: [
    { to: '/academy/path/course_fr', label: 'Dashboard', icon: 'dashboard' },
    { to: '/academy/path/course_fr', label: 'Learning Path', icon: 'auto_stories', active: true },
    { to: '/academy/path/course_fr', label: 'Case Studies', icon: 'gavel' },
    { to: '/academy/path/course_fr', label: 'Bare Acts', icon: 'menu_book' },
    { to: '/academy/path/course_fr', label: 'Mock Tests', icon: 'quiz' },
  ],
  curriculum: [
    { to: '/academy/path/course_fr', label: 'Curriculum', icon: 'menu_book', active: true },
    { to: '/academy/path/course_fr', label: 'Case Studies', icon: 'gavel' },
    { to: '/academy/quiz/quiz_fr_01', label: 'Quizzes', icon: 'quiz' },
    { to: '/academy/path/course_fr', label: 'Resources', icon: 'folder_shared' },
    { to: '/academy/path/course_fr', label: 'Profile', icon: 'account_circle' },
  ],
};

const BRANDS = {
  chat: { icon: 'balance', title: 'NyayaAI', tagline: 'Indian Law Assistant' },
  academy: { icon: 'account_balance', title: 'NyayaAI Academy', tagline: 'Legal Excellence' },
  curriculum: { icon: 'account_balance', title: 'NyayaAI Academy', tagline: 'Legal Mastery' },
};

function NavItem({ item }) {
  const { label, icon, to, group } = item;
  if (group) {
    return (
      <>
        <div className="pt-6 pb-2 px-3">
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">{group}</p>
        </div>
        <NavLink
          to={to}
          className={({ isActive }) =>
            cx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors duration-200',
              isActive && 'text-primary font-bold',
            )
          }
        >
          <Icon name={icon} size={20} />
          <span className="font-body-md">{label}</span>
        </NavLink>
      </>
    );
  }
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors duration-200',
          isActive && 'text-primary font-bold border-l-4 border-primary bg-surface-container-high rounded-l-none',
        )
      }
    >
      <Icon name={icon} size={20} />
      <span className="font-body-md">{label}</span>
    </NavLink>
  );
}

export default function AppSidebar({ variant = 'chat', cta = null, footer = null }) {
  const brand = BRANDS[variant] || BRANDS.chat;
  const items = NAV_ITEMS[variant] || NAV_ITEMS.chat;

  return (
    <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col border-r border-outline-variant bg-surface-container-low p-4 z-50">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary">
          <Icon name={brand.icon} size={22} fill />
        </div>
        <div>
          <h1 className="font-h2 text-[20px] font-bold text-primary leading-tight">{brand.title}</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant">{brand.tagline}</p>
        </div>
      </div>

      {cta ?? (
        <Button
          variant="primary"
          className="w-full py-3 mb-6"
          onClick={() => {}}
          icon={<Icon name="add" size={20} />}
        >
          New Chat
        </Button>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-1">
        {items.map((item) => (
          <NavItem key={item.label} item={item} />
        ))}
      </div>

      <div className="pt-4 border-t border-outline-variant mt-auto space-y-1">
        {footer ?? (
          <>
            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors duration-200"
            >
              <Icon name="settings" size={20} />
              <span className="font-body-md">Settings</span>
            </NavLink>
            <NavLink
              to="/support"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-highest hover:text-primary transition-colors duration-200"
            >
              <Icon name="help" size={20} />
              <span className="font-body-md">Support</span>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
