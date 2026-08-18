import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';
import { cx } from '../../lib/utils';
import { useUserStats } from '../../hooks/useUserStats';
import { useAuthStore } from '../../stores/authStore';

const CHAT_LINKS = ['Case Research', 'Legal Drafting', 'Consultations'];


export default function Topbar({ variant = 'academy', onSearch = null, searchValue = '' }) {
  const navigate = useNavigate();
  const { currentStreak, totalXp, level } = useUserStats();
  const user = useAuthStore((s) => s.user);

  const [localValue, setLocalValue] = useState(searchValue || '');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (searchValue !== undefined) {
      setLocalValue(searchValue);
    }
  }, [searchValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [profileOpen]);

  const displayName = user?.full_name || user?.name || 'User';
  const displayEmail = user?.email || '';

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
                value={localValue}
                onChange={(e) => {
                  setLocalValue(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="w-full pl-10 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-card focus:border-primary-container focus:ring-0 text-body-md font-body-md transition-colors placeholder:text-on-surface-variant"
                placeholder="Search lessons, cases..."
                type="text"
              />
              {localValue && (
                <button
                  onClick={() => {
                    setLocalValue('');
                    onSearch?.('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center justify-center p-1 rounded-full hover:bg-surface-container-high"
                  aria-label="Clear search"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 md:gap-6">
          {variant === 'chat' && (
            <button className="text-on-surface-variant hover:text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest">
              <Icon name="notifications" size={20} />
            </button>
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

            </>
          )}

          <div className="h-8 w-px bg-outline-variant hidden md:block" />

          {/* Profile section */}
          <div className="relative flex items-center gap-2.5" ref={profileRef}>
            {/* Name only — no id/role subtitle */}
            <span className="hidden lg:block font-body-md text-[14px] font-semibold text-on-surface">
              {displayName}
            </span>

            {/* Avatar — clickable, opens dropdown */}
            <button
              id="topbar-profile-btn"
              aria-label="Open profile menu"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="relative cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Avatar
                name={displayName}
                size="sm"
                className="border-2 border-primary-fixed w-9 h-9"
              />
            </button>

            {/* Profile dropdown */}
            {profileOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] w-64 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg overflow-hidden z-50 animate-fade-in"
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-outline-variant/60">
                  <Avatar
                    name={displayName}
                    size="md"
                    className="border-2 border-primary-fixed w-10 h-10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[14px] text-on-surface truncate">{displayName}</p>
                    {displayEmail && (
                      <p className="text-[12px] text-on-surface-variant truncate">{displayEmail}</p>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="p-2">
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-on-surface hover:bg-surface-container-high transition-colors text-left"
                  >
                    <Icon name="settings" size={17} />
                    Settings
                  </button>
                  <button
                    onClick={() => { setProfileOpen(false); useAuthStore.getState().logout?.(); navigate('/login'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-error hover:bg-error/8 transition-colors text-left"
                  >
                    <Icon name="logout" size={17} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
