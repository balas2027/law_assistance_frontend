import { useNavigate, useLocation } from 'react-router-dom';
import {
  Tooltip,
  List,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
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
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';
import KeyboardDoubleArrowLeft from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRight from '@mui/icons-material/KeyboardDoubleArrowRight';
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
  chat: SmartToyOutlined,
};

export default function AppSidebar({ variant = 'academy', footer = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const isAdmin =
    user?.is_superuser ||
    user?.role_name === 'Admin' ||
    user?.user_type === 'admin' ||
    user?.user_type?.code === 'admin';

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
      { id: 'ai_chat', to: '/chat', label: 'AI Chat', icon: 'chat' },
    ],
    curriculum: [
      { id: 'curr_dash', to: dashboardRoute, label: 'Dashboard', icon: 'dashboard' },
      { id: 'curr_path', to: '/academy/path', label: 'Learning Path', icon: 'auto_stories' },
      { id: 'curr_cases', to: '/academy/path', label: 'Case Studies', icon: 'gavel' },
      { id: 'curr_quiz', to: '/academy/quiz', label: 'Mock Tests', icon: 'quiz' },
      { id: 'curr_resources', to: '/academy/path', label: 'Bare Acts', icon: 'menu_book' },
      { id: 'ai_chat', to: '/chat', label: 'AI Chat', icon: 'chat' },
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
    if (item.id === 'ai_chat') {
      return p === '/chat';
    }

    return false;
  };

  return (
    <nav
      className={`hidden md:flex fixed top-16 left-0 bottom-0 flex-col bg-white border-r border-gray-200/90 z-30 transition-all duration-300 ease-in-out select-none shadow-2xs ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* ── Vertically Centered << / >> Toggle Button on the Right Border ── */}
      <Tooltip title={sidebarCollapsed ? 'Expand Sidebar (>>)' : 'Collapse Sidebar (<<)'} placement="right" arrow>
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-300/90 shadow-xs flex items-center justify-center text-gray-500 hover:text-[#0b57d0] hover:bg-[#eaf1fc] hover:scale-110 transition-all z-40 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          {sidebarCollapsed ? (
            <KeyboardDoubleArrowRight sx={{ fontSize: 14 }} />
          ) : (
            <KeyboardDoubleArrowLeft sx={{ fontSize: 14 }} />
          )}
        </button>
      </Tooltip>

      {/* ── Body Container ── */}
      <div className="p-2 pt-3 flex-1 flex flex-col overflow-hidden">
        {/* ── Action Button (Chat Mode: + New Chat) ── */}
        {variant === 'chat' ? (
          <div className="mb-3">
            {!sidebarCollapsed ? (
              <button
                onClick={handleNewChatClick}
                className="w-full py-2 px-3 rounded-sm bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[12px] tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <AddOutlined sx={{ fontSize: 16 }} />
                <span>New Chat</span>
              </button>
            ) : (
              <Tooltip title="New Chat" placement="right" arrow>
                <button
                  onClick={handleNewChatClick}
                  className="w-9 h-9 rounded-sm bg-[#0b57d0] hover:bg-[#0842a0] text-white flex items-center justify-center mx-auto shadow-xs transition-all cursor-pointer"
                >
                  <AddOutlined sx={{ fontSize: 18 }} />
                </button>
              </Tooltip>
            )}
          </div>
        ) : null}

        {/* ── Navigation List (Two sections: Left Title/Content, Right Icon) ── */}
        <List
          sx={{
            flex: 1,
            overflowY: 'auto',
            py: 0.25,
            px: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
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
                  <p className="text-[10.5px] text-gray-400 font-bold uppercase tracking-wider px-2.5 pt-2.5 pb-1">
                    {item.group}
                  </p>
                )}

                {sidebarCollapsed ? (
                  <Tooltip title={item.label} placement="right" arrow>
                    <ListItemButton
                      onClick={() => handleNavClick(item.to)}
                      sx={{
                        borderRadius: '6px',
                        py: 0.8,
                        px: 0.75,
                        justifyContent: 'center',
                        color: isActive ? '#0b57d0' : '#4b5563',
                        bgcolor: isActive ? '#eaf1fc !important' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                        '&:hover': {
                          bgcolor: isActive ? '#eaf1fc !important' : 'rgba(0, 0, 0, 0.04)',
                          color: '#0b57d0',
                        },
                        minHeight: 34,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          color: isActive ? '#0b57d0' : 'inherit',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                ) : (
                  <ListItemButton
                    onClick={() => handleNavClick(item.to)}
                    sx={{
                      borderRadius: '6px',
                      py: 2,
                      px: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: isActive ? '#0b57d0' : '#4b5563',
                      bgcolor: isActive ? '#eaf1fc !important' : 'transparent',
                      fontWeight: isActive ? 600 : 500,
                      '&:hover': {
                        bgcolor: isActive ? '#eaf1fc !important' : 'rgba(0, 0, 0, 0.04)',
                        color: '#0b57d0',
                      },
                      transition: 'all 0.15s ease',
                      minHeight: 40,
                    }}
                  >
                    {/* Left Section: Content / Label */}
                    <span className="text-[16px] font-medium text-black">
                      {item.label}
                    </span>

                    {/* Right Section: Icon */}
                    <IconComponent
                      sx={{
                        fontSize: 18,
                        color: isActive ? '#0b57d0' : '#6b7280',
                        transition: 'color 0.15s ease',
                      }}
                    />
                  </ListItemButton>
                )}
              </div>
            );
          })}
        </List>

        {/* ── Footer: Settings & Support (Two sections: Left Title, Right Icon) ── */}
        <div className="space-y-0.5 mt-auto pt-2 border-t border-gray-100">
          {footer ?? (
            <>
              {sidebarCollapsed ? (
                <>
                  <Tooltip title="Settings" placement="right" arrow>
                    <ListItemButton
                      onClick={() => navigate('/settings')}
                      sx={{
                        borderRadius: '6px',
                        py: 0.7,
                        justifyContent: 'center',
                        color: '#4b5563',
                        '&:hover': { color: '#0b57d0', bgcolor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: 'inherit' }}>
                        <SettingsOutlined sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                  <Tooltip title="Support" placement="right" arrow>
                    <ListItemButton
                      onClick={() => navigate('/support')}
                      sx={{
                        borderRadius: '6px',
                        py: 0.7,
                        justifyContent: 'center',
                        color: '#4b5563',
                        '&:hover': { color: '#0b57d0', bgcolor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: 'inherit' }}>
                        <HelpOutlined sx={{ fontSize: 18 }} />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                </>
              ) : (
                <>
                  <ListItemButton
                    onClick={() => navigate('/settings')}
                    sx={{
                      borderRadius: '6px',
                      py: 0.6,
                      px: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#4b5563',
                      '&:hover': { color: '#0b57d0', bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    }}
                  >
                    <span className="text-[12.5px] font-medium">Settings</span>
                    <SettingsOutlined sx={{ fontSize: 17, color: '#6b7280' }} />
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => navigate('/support')}
                    sx={{
                      borderRadius: '6px',
                      py: 0.6,
                      px: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      color: '#4b5563',
                      '&:hover': { color: '#0b57d0', bgcolor: 'rgba(0, 0, 0, 0.04)' },
                    }}
                  >
                    <span className="text-[12.5px] font-medium">Support</span>
                    <HelpOutlined sx={{ fontSize: 17, color: '#6b7280' }} />
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
