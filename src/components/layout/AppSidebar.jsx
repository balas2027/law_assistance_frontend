import { useNavigate, useLocation } from 'react-router-dom';
import {
  Tooltip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuOpen from '@mui/icons-material/MenuOpen';
import Menu from '@mui/icons-material/Menu';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AutoStoriesOutlined from '@mui/icons-material/AutoStoriesOutlined';
import GavelOutlined from '@mui/icons-material/GavelOutlined';
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined';
import QuizOutlined from '@mui/icons-material/QuizOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import HelpOutlined from '@mui/icons-material/HelpOutlined';
import HistoryOutlined from '@mui/icons-material/HistoryOutlined';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import BookmarkBorderOutlined from '@mui/icons-material/BookmarkBorderOutlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import FolderSharedOutlined from '@mui/icons-material/FolderSharedOutlined';
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useAuth } from '../../hooks/useAuth';
import { useUiStore } from '../../stores/uiStore';

// Map string icon names to MUI Icon components
const ICON_COMPONENTS = {
  dashboard: DashboardOutlined,
  auto_stories: AutoStoriesOutlined,
  gavel: GavelOutlined,
  menu_book: MenuBookOutlined,
  quiz: QuizOutlined,
  settings: SettingsOutlined,
  help: HelpOutlined,
  history: HistoryOutlined,
  description: DescriptionOutlined,
  bookmark: BookmarkBorderOutlined,
  balance: AccountBalanceOutlined,
  folder_shared: FolderSharedOutlined,
  account_circle: AccountCircleOutlined,
  school: SchoolOutlined,
};

export default function AppSidebar({ variant = 'academy', cta = null, footer = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const isAdmin =
    user?.is_superuser ||
    user?.role_name === 'Admin' ||
    user?.user_type === 'admin' ||
    user?.user_type?.code === 'admin';

  // Dynamic dashboard route depending on role
  const dashboardRoute = isAdmin ? '/admin/dashboard' : '/academy/dashboard';

  const NAV_ITEMS = {
    chat: [
      { id: 'chat_learn', to: '/academy/dashboard', label: 'Back to Learn', icon: 'school' },
      { id: 'chat_history', to: '/chat', label: 'Chat History', icon: 'history' },
      { id: 'chat_docs', to: '/chat', label: 'Legal Documents', icon: 'description' },
      { id: 'chat_bookmarks', to: '/chat', label: 'Bookmarks', icon: 'bookmark' },
      { id: 'chat_criminal', to: '/chat', label: 'Criminal Law', icon: 'gavel', group: 'DOMAINS' },
      { id: 'chat_civil', to: '/chat', label: 'Civil Law', icon: 'balance' },
    ],
    academy: [
      { id: 'acad_dash', to: dashboardRoute, label: 'Dashboard', icon: 'dashboard' },
      { id: 'acad_path', to: '/academy/path', label: 'Learning Path', icon: 'auto_stories' },
      { id: 'acad_cases', to: '/academy/path', label: 'Case Studies', icon: 'gavel' },
      { id: 'acad_acts', to: '/academy/path', label: 'Bare Acts', icon: 'menu_book' },
      { id: 'acad_quiz', to: '/academy/quiz', label: 'Mock Tests', icon: 'quiz' },
    ],
    curriculum: [
      { id: 'curr_dash', to: dashboardRoute, label: 'Dashboard', icon: 'dashboard' },
      { id: 'curr_path', to: '/academy/path', label: 'Learning Path', icon: 'auto_stories' },
      { id: 'curr_cases', to: '/academy/path', label: 'Case Studies', icon: 'gavel' },
      { id: 'curr_quiz', to: '/academy/quiz', label: 'Mock Tests', icon: 'quiz' },
      { id: 'curr_resources', to: '/academy/path', label: 'Bare Acts', icon: 'menu_book' },
    ],
  };

  const items = NAV_ITEMS[variant] || NAV_ITEMS.academy;

  const handleNavClick = (to) => {
    navigate(to);
  };

  const handleNewChatClick = () => {
    navigate('/chat');
  };

  // Precise active state determination
  const getIsActive = (item) => {
    const p = location.pathname;

    if (item.id === 'acad_dash' || item.id === 'curr_dash' || item.id === 'chat_learn') {
      return p === '/academy/dashboard' || p === '/admin/dashboard';
    }
    if (item.id === 'acad_path' || item.id === 'curr_path') {
      return p === '/academy/path' || p.startsWith('/academy/path/') || p.startsWith('/academy/lesson/');
    }
    if (item.id === 'acad_quiz' || item.id === 'curr_quiz') {
      return p.startsWith('/academy/quiz');
    }
    if (item.id === 'chat_history') {
      return p.startsWith('/chat/') && p !== '/chat';
    }
    if (item.id === 'chat_docs') {
      return p === '/documents';
    }
    if (item.id === 'chat_bookmarks') {
      return p === '/bookmarks';
    }
    if (item.id === 'chat_criminal') {
      return location.search.includes('domain=criminal');
    }
    if (item.id === 'chat_civil') {
      return location.search.includes('domain=civil');
    }

    return false;
  };


  return (
    <nav
      className={`hidden md:flex h-screen fixed left-0 top-0 flex-col border-r border-outline-variant bg-surface-container-low z-50 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* ── Header: Logo + Collapse/Expand Toggle ── */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant bg-surface shrink-0">
        {!sidebarCollapsed ? (
          <div
            onClick={() => navigate('/academy/dashboard')}
            className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 mr-1"
          >
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
            </div>
            <div className="min-w-0">
              <h1 className="font-h2 text-[16px] font-bold text-primary leading-tight truncate">
                {variant === 'chat' ? 'NyayaAI' : 'NyayaAI Academy'}
              </h1>
              <p className="font-label-caps text-[11px] text-on-surface-variant leading-tight truncate">
                {variant === 'chat' ? 'Indian Law Assistant' : 'Legal Excellence'}
              </p>
            </div>
          </div>
        ) : (
          <Tooltip title="NyayaAI Academy" placement="right" arrow>
            <div
              onClick={() => navigate('/academy/dashboard')}
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white cursor-pointer mx-auto shadow-sm"
            >
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
            </div>
          </Tooltip>
        )}

        <Tooltip
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          placement="right"
          arrow
        >
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: 'var(--color-primary)',
              bgcolor: 'var(--color-surface-container)',
              '&:hover': { bgcolor: 'var(--color-surface-container-high)' },
              borderRadius: '8px',
              p: 0.6,
            }}
          >
            {sidebarCollapsed ? (
              <Menu sx={{ fontSize: 18 }} />
            ) : (
              <MenuOpen sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Tooltip>
      </div>

      {/* ── Body Container ── */}
      <div className="p-3 flex-1 flex flex-col overflow-hidden">
        {/* ── Action Button (Chat Mode: + New Chat) ── */}
        {variant === 'chat' ? (
          <div className="mb-3">
            {!sidebarCollapsed ? (
              <button
                onClick={handleNewChatClick}
                className="w-full py-2.5 px-4 rounded-full bg-primary-container hover:bg-primary text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <AddOutlined sx={{ fontSize: 18 }} />
                <span>New Chat</span>
              </button>
            ) : (
              <Tooltip title="New Chat" placement="right" arrow>
                <button
                  onClick={handleNewChatClick}
                  className="w-10 h-10 rounded-full bg-primary-container hover:bg-primary text-white flex items-center justify-center mx-auto shadow-sm transition-all"
                >
                  <AddOutlined sx={{ fontSize: 20 }} />
                </button>
              </Tooltip>
            )}
          </div>
        ) : null}

        {/* ── Navigation List ── */}
        <List
          sx={{
            flex: 1,
            overflowY: 'auto',
            py: 0.5,
            px: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
          className="scrollbar-hide"
        >
          {items.map((item, idx) => {
            const IconComponent = ICON_COMPONENTS[item.icon] || AutoStoriesOutlined;
            const isActive = getIsActive(item);

            return (
              <div key={item.id || idx}>
                {/* Group section label if specified */}
                {item.group && !sidebarCollapsed && (
                  <p className="font-label-caps text-[11px] text-on-surface-variant font-bold uppercase tracking-wider px-3 pt-3 pb-1">
                    {item.group}
                  </p>
                )}

                {sidebarCollapsed ? (
                  <Tooltip title={item.label} placement="right" arrow>
                    <ListItemButton
                      onClick={() => handleNavClick(item.to)}
                      sx={{
                        borderRadius: '8px',
                        py: 1,
                        px: 1,
                        justifyContent: 'center',
                        color: isActive ? '#071747' : 'var(--color-on-surface-variant)',
                        bgcolor: isActive ? '#dce1ff !important' : 'transparent',
                        fontWeight: isActive ? 700 : 500,
                        '&:hover': {
                          bgcolor: isActive ? '#dce1ff !important' : 'var(--color-surface-container-high)',
                          color: '#071747',
                        },
                        minHeight: 40,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          color: isActive ? '#071747' : 'inherit',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 20 }} />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                ) : (
                  <ListItemButton
                    onClick={() => handleNavClick(item.to)}
                    sx={{
                      borderRadius: '8px',
                      py: 1,
                      px: 2,
                      justifyContent: 'flex-start',
                      color: isActive ? '#071747' : 'var(--color-on-surface-variant)',
                      bgcolor: isActive ? '#dce1ff !important' : 'transparent',
                      fontWeight: isActive ? 700 : 500,
                      transform: isActive ? 'translateX(2px)' : 'none',
                      '&:hover': {
                        bgcolor: isActive ? '#dce1ff !important' : 'var(--color-surface-container-high)',
                        color: '#071747',
                      },
                      transition: 'all 0.15s ease',
                      minHeight: 40,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 34,
                        color: isActive ? '#071747' : 'inherit',
                      }}
                    >
                      <IconComponent sx={{ fontSize: 20 }} />
                    </ListItemIcon>

                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '13.5px',
                        fontWeight: isActive ? 700 : 500,
                        fontFamily: '"Inter", sans-serif',
                      }}
                    />
                  </ListItemButton>
                )}
              </div>
            );
          })}
        </List>

        {/* ── Upgrade to Pro Button (Academy mode) ── */}
        {variant !== 'chat' && !sidebarCollapsed && (
          <div className="py-2">
            <button
              onClick={() => navigate('/chat')}
              className="w-full py-2.5 bg-[#fe9832] text-white rounded-full font-label-caps text-[12.5px] font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

       
        {/* ── Footer: Settings & Support ── */}
        <div className="space-y-0.5 mt-auto">
          {footer ?? (
            <>
              {sidebarCollapsed ? (
                <>
                  <Tooltip title="Settings" placement="right" arrow>
                    <IconButton
                      onClick={() => navigate('/settings')}
                      size="small"
                      sx={{
                        width: '100%',
                        py: 0.8,
                        borderRadius: '8px',
                        color: 'var(--color-on-surface-variant)',
                        '&:hover': { color: 'var(--color-primary)', bgcolor: 'var(--color-surface-container)' },
                      }}
                    >
                      <SettingsOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Support" placement="right" arrow>
                    <IconButton
                      onClick={() => navigate('/support')}
                      size="small"
                      sx={{
                        width: '100%',
                        py: 0.8,
                        borderRadius: '8px',
                        color: 'var(--color-on-surface-variant)',
                        '&:hover': { color: 'var(--color-primary)', bgcolor: 'var(--color-surface-container)' },
                      }}
                    >
                      <HelpOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <ListItemButton
                    onClick={() => navigate('/settings')}
                    sx={{
                      borderRadius: '8px',
                      py: 0.7,
                      px: 2,
                      color: 'var(--color-on-surface-variant)',
                      '&:hover': { color: 'var(--color-primary)', bgcolor: 'var(--color-surface-container-high)' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                      <SettingsOutlined sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Settings"
                      primaryTypographyProps={{ fontSize: '13px', fontWeight: 500 }}
                    />
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => navigate('/support')}
                    sx={{
                      borderRadius: '8px',
                      py: 0.7,
                      px: 2,
                      color: 'var(--color-on-surface-variant)',
                      '&:hover': { color: 'var(--color-primary)', bgcolor: 'var(--color-surface-container-high)' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                      <HelpOutlined sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Support"
                      primaryTypographyProps={{ fontSize: '13px', fontWeight: 500 }}
                    />
                  </ListItemButton>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
