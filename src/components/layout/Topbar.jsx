import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';
import { cx } from '../../lib/utils';
import { useUserStats } from '../../hooks/useUserStats';
import { useAuthStore } from '../../stores/authStore';

const CHAT_LINKS = ['Case Research', 'Legal Drafting', 'Consultations'];


export default function Topbar({ variant = 'academy', onSearch = null }) {
  const navigate = useNavigate();
  const { currentStreak, totalXp, level } = useUserStats();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-30 shrink-0">
      <div className="h-16 flex items-center justify-between px-gutter md:px-margin-desktop">
        {variant === 'chat' ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/academy/dashboard')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[13px] border border-outline-variant/60 transition-colors shadow-xs"
            >
              <Icon name="arrow_back" size={16} />
              <span>Back to Learn</span>
            </button>
            <div className="h-5 w-px bg-outline-variant/60 hidden md:block" />
            <div className="flex items-center gap-6 hidden md:flex">
              {CHAT_LINKS.map((label) => (
                <a
                  key={label}
                  className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-[14px] cursor-pointer"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        ) : (

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-card focus:border-primary-container focus:ring-0 text-body-md font-body-md transition-colors placeholder:text-on-surface-variant"
                placeholder="Search lessons, cases..."
                type="text"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 md:gap-6">
          {variant === 'chat' && (
            <>
              <button className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-4 py-2 rounded-full hover:opacity-90 transition-opacity hidden md:block">
                Upgrade to Pro
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest">
                <Icon name="notifications" size={20} />
              </button>
            </>
          )}

          {variant === 'academy' && (
            <>
              <div className={cx('flex items-center gap-4 hidden lg:flex')}>
                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant">
                  <Icon name="local_fire_department" size={18} fill className="text-secondary-container" />
                  <span className="font-label-caps text-label-caps font-bold text-on-surface">{currentStreak} Day Streak</span>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant">
                  <Icon name="military_tech" size={18} className="text-primary-container" />
                  <span className="font-label-caps text-label-caps font-bold text-on-surface">Level {level} · {totalXp} XP</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <button className="text-on-surface-variant hover:bg-surface-container-high p-2 rounded-full transition-colors relative">
                  <Icon name="notifications" size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-secondary-container rounded-full border border-surface" />
                </button>
              </div>
            </>
          )}

          <div className="h-8 w-px bg-outline-variant hidden md:block" />
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex flex-col items-end leading-tight">
              <span className="font-body-md text-[14px] font-semibold text-on-surface">
                {user?.full_name || user?.name || 'User'}
              </span>
              <span className="font-label-caps text-[11px] text-on-surface-variant">
                #{user?.id} · {user?.role_name || 'Member'}
              </span>
            </div>
            <Avatar
              name={user?.full_name || user?.name || 'User'}
              size="sm"
              className="border-2 border-primary-fixed w-9 h-9"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
