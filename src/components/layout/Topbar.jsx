import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import Avatar from '../ui/Avatar';
import { cx } from '../../lib/utils';
import { useUserStats } from '../../hooks/useUserStats';
import { useAuthStore } from '../../stores/authStore';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';

const CHAT_LINKS = ['Case Research', 'Legal Drafting', 'Consultations'];

export default function Topbar({
  variant = 'academy',
  onSearch = null,
  searchValue = '',
  adminTitle = '',
  adminAction = null,
}) {
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
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200/90 z-40 px-4 md:px-8 flex items-center justify-between shadow-2xs">
      {/* ── Left: App Brand & Logo ── */}
      <div className="flex items-center gap-6 shrink-0">
        <Link
          to={variant === 'admin' ? '/admin/dashboard' : '/academy/dashboard'}
          className="flex items-center gap-3 group text-left cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <AccountBalanceOutlined sx={{ fontSize: 20 }} />
          </div>
          <div>
            <h1 className="font-h2 text-[15px] font-bold text-primary leading-tight tracking-tight">
              {variant === 'chat' ? 'NyayaAI' : 'NyayaAI Academy'}
            </h1>
            <p className="font-label-caps text-[11px] text-on-surface-variant leading-tight">
              {variant === 'admin'
                ? 'Admin Portal'
                : variant === 'chat'
                ? 'Indian Law Assistant'
                : 'Legal Excellence'}
            </p>
          </div>
        </Link>
      </div>

      {/* ── Center: Search Bar, Admin Title, or Chat Links ── */}
      <div className="flex-1 max-w-xl mx-6 hidden sm:flex items-center justify-center">
        {variant === 'admin' ? (
          <div className="flex items-center gap-3">
            {adminTitle && (
              <span className="text-[14.5px] font-bold text-gray-950 tracking-tight">
                {adminTitle}
              </span>
            )}
          </div>
        ) : variant === 'chat' ? (
          <div className="flex items-center justify-center gap-6">
            {CHAT_LINKS.map((label) => (
              <span
                key={label}
                className="text-gray-500 hover:text-[#0b57d0] transition-colors font-medium text-[13px] cursor-pointer"
              >
                {label}
              </span>
            ))}
          </div>
        ) : (
          <div className="relative w-full max-w-md">
            <Icon
              name="search"
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={localValue}
              onChange={(e) => {
                setLocalValue(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-full pl-10 pr-10 py-1.5 bg-gray-50/80 border border-gray-200/90 rounded-sm text-[13px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#0b57d0] transition-all shadow-2xs"
              placeholder="Search lessons, cases, topics..."
              type="text"
            />
            {localValue && (
              <button
                onClick={() => {
                  setLocalValue('');
                  onSearch?.('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer flex items-center justify-center p-1"
                aria-label="Clear search"
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Admin Action or Stats & Profile ── */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {variant === 'admin' && adminAction ? (
          <div className="mr-2">{adminAction}</div>
        ) : null}

        {variant === 'academy' && (
          <div className="hidden lg:flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-[#fafbfc] px-2.5 py-1 rounded-full border border-gray-200/90 shadow-2xs">
              <Icon name="local_fire_department" size={16} fill className="text-amber-500" />
              <span className="text-[11.5px] font-bold text-gray-800">{currentStreak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#fafbfc] px-2.5 py-1 rounded-full border border-gray-200/90 shadow-2xs">
              <Icon name="military_tech" size={16} className="text-[#0b57d0]" />
              <span className="text-[11.5px] font-bold text-gray-800">Level {level} · {totalXp} XP</span>
            </div>
          </div>
        )}

        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Profile Menu */}
        <div className="relative flex items-center gap-2" ref={profileRef}>
          <span className="hidden md:block text-[13px] font-bold text-gray-900">
            {displayName}
          </span>

          <button
            id="topbar-profile-btn"
            aria-label="Open profile menu"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="relative cursor-pointer rounded-full focus:outline-none ring-2 ring-transparent hover:ring-[#0b57d0]/20 transition-all"
          >
            <Avatar
              name={displayName}
              size="sm"
              className="w-8 h-8 border border-gray-200 shadow-2xs"
            />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div
              className={cx(
                'absolute right-0 top-11 mt-2 w-64 rounded-xl border border-gray-200/90',
                'bg-white shadow-lg py-2 z-50 animate-fade-in text-gray-900',
              )}
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[13.5px] font-bold text-gray-950 truncate">{displayName}</p>
                <p className="text-[12px] text-gray-500 truncate">{displayEmail}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10.5px] font-bold uppercase tracking-wider bg-blue-50 text-[#0b57d0]">
                  {user?.user_type?.name || user?.user_type || 'Law Student'}
                </span>
              </div>

              <div className="py-1">
                {variant === 'admin' ? (
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/academy/dashboard'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Icon name="school" size={17} className="text-gray-400" />
                    <span>Switch to Learner View</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/admin/dashboard'); }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Icon name="admin_panel_settings" size={17} className="text-gray-400" />
                    <span>Admin Portal</span>
                  </button>
                )}
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <Icon name="settings" size={17} className="text-gray-400" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/support'); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <Icon name="help" size={17} className="text-gray-400" />
                  <span>Support & FAQ</span>
                </button>
              </div>

              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => { setProfileOpen(false); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <Icon name="logout" size={17} className="text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
