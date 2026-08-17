import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuOpen from "@mui/icons-material/MenuOpen";
import Menu from "@mui/icons-material/Menu";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import EditNoteOutlined from "@mui/icons-material/EditNoteOutlined";
import QuizOutlined from "@mui/icons-material/QuizOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import AutoStoriesOutlined from "@mui/icons-material/AutoStoriesOutlined";
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
      className={`hidden md:flex h-screen fixed left-0 top-0 flex-col border-r border-outline-variant bg-surface-container-low z-50 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* ── Header: Brand + Collapse/Expand Toggle ── */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant bg-surface shrink-0">
        {!sidebarCollapsed ? (
          <div
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 cursor-pointer min-w-0 flex-1 mr-1"
          >
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm">
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
            </div>
            <div className="min-w-0">
              <h1 className="font-h2 text-[16px] font-bold text-primary leading-tight truncate">
                NyayaAI Academy
              </h1>
              <p className="font-label-caps text-[11px] text-on-surface-variant leading-tight truncate">
                Admin Portal
              </p>
            </div>
          </div>
        ) : (
          <Tooltip title="NyayaAI Admin" placement="right" arrow>
            <div
              onClick={() => navigate("/admin/dashboard")}
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white cursor-pointer mx-auto shadow-sm"
            >
              <AccountBalanceOutlined sx={{ fontSize: 20 }} />
            </div>
          </Tooltip>
        )}

        <Tooltip
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          placement="right"
          arrow
        >
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: "var(--color-primary)",
              bgcolor: "var(--color-surface-container)",
              "&:hover": { bgcolor: "var(--color-surface-container-high)" },
              borderRadius: "8px",
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

      {/* ── Navigation List ── */}
      <div className="p-3  flex flex-col overflow-hidden">
        <List
          sx={{
            flex: 1,
            overflowY: "auto",
            py: 0.5,
            px: 0,
            display: "flex",
            flexDirection: "column",
            gap: "3px",
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
                      borderRadius: "8px",
                      py: 1,
                      px: 1,
                      justifyContent: "center",
                      color: isActive
                        ? "#071747"
                        : "var(--color-on-surface-variant)",
                      bgcolor: isActive ? "#dce1ff !important" : "transparent",
                      fontWeight: isActive ? 700 : 500,
                      "&:hover": {
                        bgcolor: isActive
                          ? "#dce1ff !important"
                          : "var(--color-surface-container-high)",
                        color: "#071747",
                      },
                      minHeight: 20,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: isActive ? "#071747" : "inherit",
                        justifyContent: "center",
                      }}
                    >
                      <IconComp sx={{ fontSize: 20 }} />
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
                  borderRadius: "8px",
                  py: 1,
                  px: 2,
                  justifyContent: "flex-start",
                  color: isActive
                    ? "#071747"
                    : "var(--color-on-surface-variant)",
                  bgcolor: isActive ? "#dce1ff !important" : "transparent",
                  fontWeight: isActive ? 700 : 500,
                  transform: isActive ? "translateX(2px)" : "none",
                  "&:hover": {
                    bgcolor: isActive
                      ? "#dce1ff !important"
                      : "var(--color-surface-container-high)",
                    color: "#071747",
                  },
                  transition: "all 0.15s ease",
                  minHeight: 40,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 34,
                    color: isActive ? "#071747" : "inherit",
                  }}
                >
                  <IconComp sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "13.5px",
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: '"Inter", sans-serif',
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>


        {/* ── Footer: Sign Out + Profile ── */}
        <div className="space-y-1.5 mt-auto">
          {sidebarCollapsed ? (
            <Tooltip title="Sign Out" placement="right" arrow>
              <IconButton
                onClick={logout}
                size="small"
                sx={{
                  width: "100%",
                  py: 1,
                  borderRadius: "8px",
                  color: "var(--color-on-surface-variant)",
                  "&:hover": {
                    color: "var(--color-error)",
                    bgcolor: "var(--color-error-container)",
                  },
                }}
              >
                <LogoutOutlined sx={{ fontSize: 19 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <ListItemButton
                onClick={logout}
                sx={{
                  borderRadius: "8px",
                  py: 0.8,
                  px: 2,
                  color: "var(--color-on-surface-variant)",
                  "&:hover": {
                    color: "var(--color-error)",
                    bgcolor: "var(--color-surface-container-high)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "inherit" }}>
                  <LogoutOutlined sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Sign Out"
                  primaryTypographyProps={{ fontSize: "13px", fontWeight: 500 }}
                />
              </ListItemButton>

              <div className="p-2.5 rounded-xl bg-surface-container/60 flex items-center gap-3">
                <Avatar name={user?.full_name || "Admin"} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-body-md text-[13px] font-semibold text-primary truncate">
                    {user?.full_name || "Admin User"}
                  </p>
                  <p className="text-[11px] text-on-surface-variant capitalize">
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
