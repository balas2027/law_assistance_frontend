import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import EditNoteOutlined from "@mui/icons-material/EditNoteOutlined";
import QuizOutlined from "@mui/icons-material/QuizOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
import KeyboardDoubleArrowLeft from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRight from "@mui/icons-material/KeyboardDoubleArrowRight";
import { useAuth } from "../../hooks/useAuth";
import { useUiStore } from "../../stores/uiStore";
import Avatar from "../ui/Avatar";

const ADMIN_NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: DashboardOutlined },
  { to: "/admin/cms", label: "Content CMS", icon: EditNoteOutlined },
  { to: "/admin/quiz-builder", label: "Quiz Builder", icon: QuizOutlined },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <aside
      className={`hidden md:flex fixed top-16 left-0 bottom-0 flex-col bg-white border-r border-gray-200/90 z-30 transition-all duration-300 ease-in-out select-none shadow-2xs ${
        sidebarCollapsed ? "w-16" : "w-56"
      }`}
    >
      {/* ── Vertically Centered << / >> Toggle Button on the Right Border ── */}
      <Tooltip
        title={
          sidebarCollapsed ? "Expand Sidebar (>>)" : "Collapse Sidebar (<<)"
        }
        placement="right"
        arrow
      >
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

      {/* ── Navigation List (Compact: Left Title, Right Icon) ── */}
      <div className="p-2 pt-3  flex flex-col h-full justify-between overflow-hidden">
        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            py: 0.25,
            px: 0,

            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",

            gap: "2px",

            // Prevent children from being stretched
            "& .MuiListItemButton-root": {
              flexGrow: 0,
              flexShrink: 0,
            },
          }}
          className="scrollbar-hide"
        >
          {ADMIN_NAV_ITEMS.map((item) => {
            const IconComp = item.icon;
            const isActive =
              item.to === "/admin/dashboard"
                ? location.pathname === "/admin/dashboard"
                : location.pathname.startsWith(item.to);

            if (sidebarCollapsed) {
              return (
                <Tooltip
                  key={item.label}
                  title={item.label}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    onClick={() => navigate(item.to)}
                    sx={{
                      borderRadius: "6px",
                      py: 0.8,
                      px: 0.75,
                      justifyContent: "center",
                      color: isActive ? "#0b57d0" : "#4b5563",
                      bgcolor: isActive ? "#eaf1fc !important" : "transparent",
                      fontWeight: isActive ? 600 : 500,
                      "&:hover": {
                        bgcolor: isActive
                          ? "#eaf1fc !important"
                          : "rgba(0, 0, 0, 0.04)",
                        color: "#0b57d0",
                      },
                      minHeight: 34,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: isActive ? "#0b57d0" : "inherit",
                        justifyContent: "center",
                      }}
                    >
                      <IconComp sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                  </ListItemButton>
                </Tooltip>
              );
            }

            return (
              <ListItemButton
                key={item.label}
                onClick={() => navigate(item.to)}
                sx={{
                  borderRadius: "6px",
                  py: 2,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: isActive ? "#0b57d0" : "#4b5563",
                  bgcolor: isActive ? "#eaf1fc !important" : "transparent",
                  fontWeight: isActive ? 600 : 500,
                  "&:hover": {
                    bgcolor: isActive
                      ? "#eaf1fc !important"
                      : "rgba(0, 0, 0, 0.04)",
                    color: "#0b57d0",
                  },
                  transition: "all 0.15s ease",
                  minHeight: 40,
                }}
              >
                {/* Left Section: Content / Label */}
                <span className="text-[16px] font-medium text-black">
                  {item.label}
                </span>

                {/* Right Section: Icon */}
                <IconComp
                  sx={{
                    fontSize: 18,
                    color: isActive ? "#0b57d0" : "#6b7280",
                    transition: "color 0.15s ease",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        {/* ── Footer: Sign Out + Profile ── */}
        <div className="space-y-1.5 mt-auto pt-2 border-t border-gray-100">
          {sidebarCollapsed ? (
            <Tooltip title="Sign Out" placement="right" arrow>
              <IconButton
                onClick={logout}
                size="small"
                sx={{
                  width: "100%",
                  py: 0.8,
                  borderRadius: "6px",
                  color: "#4b5563",
                  "&:hover": {
                    color: "var(--color-error)",
                    bgcolor: "rgba(239, 68, 68, 0.1)",
                  },
                }}
              >
                <LogoutOutlined sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <ListItemButton
                onClick={logout}
                sx={{
                  borderRadius: "6px",
                  py: 0.6,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#4b5563",
                  "&:hover": {
                    color: "var(--color-error)",
                    bgcolor: "rgba(239, 68, 68, 0.08)",
                  },
                }}
              >
                <span className="text-[12.5px] font-medium">Sign Out</span>
                <LogoutOutlined sx={{ fontSize: 17, color: "#6b7280" }} />
              </ListItemButton>

              <div className="p-2 rounded-sm bg-gray-50 border border-gray-100 flex items-center gap-2.5">
                <Avatar name={user?.full_name || "Admin"} size="xs" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-gray-950 truncate leading-tight">
                    {user?.full_name || "Admin User"}
                  </p>
                  <p className="text-[10px] text-gray-500 capitalize leading-tight">
                    {user?.user_type?.name ||
                      user?.user_type ||
                      "Administrator"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
