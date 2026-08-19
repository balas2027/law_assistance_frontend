import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Icon from "../../components/ui/Icon";
import { useAdminStore } from "../../stores/adminStore";
import { useUiStore } from "../../stores/uiStore";
import { fetchUserSignupsApi } from "../../lib/api/admin";

const STAT_CARDS = [
  {
    key: "total_users",
    label: "Total Users",
    icon: "group",
    color: "text-primary",
  },
  {
    key: "total_students",
    label: "Law Students",
    icon: "school",
    color: "text-secondary",
  },
  {
    key: "total_courses",
    label: "Courses",
    icon: "library_books",
    color: "text-tertiary-container",
  },
  {
    key: "total_lessons",
    label: "Lessons",
    icon: "menu_book",
    color: "text-primary",
  },
  {
    key: "total_quizzes",
    label: "Quizzes",
    icon: "quiz",
    color: "text-secondary",
  },
];

const toISO = (dt) => {
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${m}-${d}`;
};

function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1 animate-pulse">
      <div className="w-6 h-6 bg-surface-container rounded mb-4" />
      <div className="w-24 h-3 bg-surface-container rounded mb-2" />
      <div className="w-16 h-8 bg-surface-container rounded" />
    </div>
  );
}

import Topbar from "../../components/layout/Topbar";

export default function DashboardPage() {
  const { stats, loading, loadStats } = useAdminStore();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const userBreakdown = stats?.users_by_type
    ? Object.entries(stats.users_by_type)
    : [];
  const totalForChart = userBreakdown.reduce((sum, [, v]) => sum + v, 0) || 0;

  // ── Daily signups (week-wise) ─────────────────────────────────────────────
  const [weekOffset, setWeekOffset] = useState(0);
  const [signups, setSignups] = useState(null);
  const [signupsLoading, setSignupsLoading] = useState(true);

  const weekRange = (() => {
    const today = new Date();
    const diffToMonday = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday + weekOffset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday,
      end: sunday,
      isoStart: toISO(monday),
      isoEnd: toISO(sunday),
    };
  })();

  useEffect(() => {
    setSignupsLoading(true);
    fetchUserSignupsApi({ from: weekRange.isoStart, to: weekRange.isoEnd })
      .then((data) => setSignups(Array.isArray(data) ? data : []))
      .catch(() => setSignups([]))
      .finally(() => setSignupsLoading(false));
  }, [weekOffset]); // eslint-disable-line react-hooks/exhaustive-deps

  const signupLabels = (signups || []).map((d) =>
    new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
    }),
  );
  const signupCounts = (signups || []).map((d) => d.count);
  const weekTotal = (signups || []).reduce((sum, d) => sum + d.count, 0);

  // ── Weekly signups (last 8 weeks, full-width chart) ──────────────────────
  const baseMonday = (() => {
    const today = new Date();
    const diff = (today.getDay() + 6) % 7;
    const m = new Date(today);
    m.setDate(today.getDate() - diff);
    m.setHours(0, 0, 0, 0);
    return m;
  })();

  const [weeklySignups, setWeeklySignups] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(true);

  useEffect(() => {
    const start = new Date(baseMonday);
    start.setDate(baseMonday.getDate() - 49);
    const end = new Date(baseMonday);
    end.setDate(baseMonday.getDate() + 6);
    setWeeklyLoading(true);
    fetchUserSignupsApi({ from: toISO(start), to: toISO(end) })
      .then((data) => setWeeklySignups(Array.isArray(data) ? data : []))
      .catch(() => setWeeklySignups([]))
      .finally(() => setWeeklyLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const weeklyData = (() => {
    const buckets = [];
    for (let i = 7; i >= 0; i--) {
      const wkStart = new Date(baseMonday);
      wkStart.setDate(baseMonday.getDate() - i * 7);
      const wkEnd = new Date(wkStart);
      wkEnd.setDate(wkStart.getDate() + 6);
      const count = (weeklySignups || [])
        .filter((d) => d.date >= toISO(wkStart) && d.date <= toISO(wkEnd))
        .reduce((sum, d) => sum + d.count, 0);
      buckets.push({
        label: wkStart.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        count,
      });
    }
    return buckets;
  })();

  const adminAction = (
    <button
      id="dashboard-goto-cms-btn"
      onClick={() => navigate("/admin/cms")}>
    </button>
  );

  return (
    <div className="bg-[#fafbfc] text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <Topbar
        variant="admin"
        adminTitle="Dashboard Overview"
        adminAction={adminAction}
      />
      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col pt-16 h-screen w-full min-w-0 bg-[#fafbfc] relative overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:ml-16" : "md:ml-56"
          }`}
      >
        <div className="flex-1 overflow-y-auto px-8 pt-4 w-full bg-[#fafbfc]">
          {/* Page heading */}
          <div className="mb-4">
            <h1 className="text-[28px] md:text-[32px] font-bold text-gray-950 tracking-tight mb-1">
              Platform Overview
            </h1>
            <p className="text-[14px] text-gray-600">
              Live statistics and content health directly from your Neon
              database.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
            {loading || !stats
              ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
              : [
                {
                  key: "total_users",
                  label: "Total Users",
                  icon: "group",
                  color: "text-[#0b57d0]",
                  bg: "bg-[#eaf1fc]",
                },
                {
                  key: "total_students",
                  label: "Learners",
                  icon: "school",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  key: "total_courses",
                  label: "Courses",
                  icon: "library_books",
                  color: "text-emerald-700",
                  bg: "bg-emerald-50",
                },
                {
                  key: "total_lessons",
                  label: "Lessons",
                  icon: "menu_book",
                  color: "text-indigo-700",
                  bg: "bg-indigo-50",
                },
                {
                  key: "total_quizzes",
                  label: "Quizzes",
                  icon: "quiz",
                  color: "text-purple-700",
                  bg: "bg-purple-50",
                },
              ].map(({ key, label, icon, color, bg }) => (
                <div
                  key={key}
                  className="bg-white border border-gray-200/90 rounded-sm p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden group hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-sm ${bg} ${color} flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      <Icon name={icon} size={20} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                  <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="text-[26px] font-bold text-gray-950 tracking-tight">
                    {(stats[key] ?? 0).toLocaleString()}
                  </p>
                </div>
              ))}
          </div>

          {/* Daily signups & content overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Users by role bar chart */}
            <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100">
                <h3 className="text-[17px] text-gray-950 font-bold flex items-center gap-2">
                  Users by Role
                </h3>
                <span className="text-[12px] text-gray-500 font-semibold">
                  {totalForChart} Total
                </span>
              </div>
              {loading || !stats ? (
                <div className="animate-pulse h-[280px] bg-gray-100 rounded-sm mt-4" />
              ) : userBreakdown.length === 0 ? (
                <p className="text-gray-500 text-[13.5px] py-16 text-center">
                  No user data registered yet.
                </p>
              ) : (
                <BarChart
                  height={280}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: userBreakdown.map(([n]) => n),
                      tickLabelStyle: { fontSize: 11 },
                    },
                  ]}
                  series={[
                    {
                      data: userBreakdown.map(([, v]) => v),
                      color: "#0b57d0",
                      label: "Users",
                    },
                  ]}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                  margin={{ top: 16, right: 16, bottom: 32, left: 40 }}
                />
              )}
            </div>

            {/* Daily signups line chart */}
            <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100">
                <h3 className="text-[17px] text-gray-950 font-bold flex items-center gap-2">
                  New Users
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWeekOffset((o) => o - 1)}
                    aria-label="Previous week"
                    className="w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-gray-100 hover:border-[#0b57d0] hover:text-[#0b57d0] flex items-center justify-center text-gray-600 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Icon name="chevron_left" size={16} />
                  </button>
                  <span className="text-[12.5px] font-bold text-gray-800 min-w-[150px] text-center">
                    {weekRange.start.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    –{" "}
                    {weekRange.end.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => setWeekOffset((o) => o + 1)}
                    aria-label="Next week"
                    className="w-7 h-7 rounded-full border border-gray-300 bg-white hover:bg-gray-100 hover:border-[#0b57d0] hover:text-[#0b57d0] flex items-center justify-center text-gray-600 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Icon name="chevron_right" size={16} />
                  </button>
                </div>
              </div>

              {signupsLoading ? (
                <div className="animate-pulse h-[280px] bg-gray-100 rounded-sm mt-4" />
              ) : signupCounts.length === 0 ? (
                <p className="text-gray-500 text-[13.5px] py-16 text-center">
                  No signup data for this week.
                </p>
              ) : (
                <>
                  <LineChart
                    height={280}
                    xAxis={[
                      {
                        scaleType: "point",
                        data: signupLabels,
                        tickLabelStyle: { fontSize: 11 },
                      },
                    ]}
                    series={[
                      {
                        data: signupCounts,
                        label: "New users",
                        area: true,
                        color: "#0b57d0",
                        showMark: true,
                      },
                    ]}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                    margin={{ top: 16, right: 16, bottom: 32, left: 40 }}
                  />
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 text-[12px] text-gray-500">
                    <span>Day-wise signups based on account creation time</span>
                    <span className="font-bold text-gray-900">
                      {weekTotal} {weekTotal === 1 ? "new user" : "new users"}{" "}
                      this week
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Content overview */}
            <div className="bg-white border border-gray-200/90 rounded-sm p-6 mb-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] lg:col-span-2">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-[17px] text-gray-950 font-bold flex items-center gap-2">
                  Curriculum & Assessments
                </h3>
                <span className="text-[12px] text-gray-500 font-semibold">
                  Quick Access
                </span>
              </div>
              {loading || !stats ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-sm" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      label: "Courses Management",
                      value: stats.total_courses,
                      icon: "library_books",
                      to: "/admin/cms",
                      desc: "Curriculum modules & tracks",
                    },
                    {
                      label: "Published Lessons",
                      value: stats.total_lessons,
                      icon: "menu_book",
                      to: "/admin/cms",
                      desc: "Interactive reading materials",
                    },
                    {
                      label: "Quiz & Test Builder",
                      value: stats.total_quizzes,
                      icon: "quiz",
                      to: "/admin/quiz-builder",
                      desc: "Mock tests and scenarios",
                    },
                  ].map(({ label, value, icon, to, desc }) => (
                    <button
                      key={label}
                      onClick={() => navigate(to)}
                      className="w-full flex items-center justify-between bg-[#fafbfc] hover:bg-[#eaf1fc] border border-gray-200/70 hover:border-[#0b57d0]/30 transition-all rounded-sm px-4 py-3.5 group text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-white border border-gray-200/80 flex items-center justify-center text-[#0b57d0] shrink-0 shadow-2xs group-hover:bg-[#0b57d0] group-hover:text-white transition-colors">
                          <Icon name={icon} size={18} />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#0b57d0] transition-colors">
                            {label}
                          </p>
                          <p className="text-[12px] text-gray-500">{desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[18px] font-bold text-gray-900">
                          {(value ?? 0).toLocaleString()}
                        </span>
                        <Icon
                          name="arrow_forward"
                          size={16}
                          className="text-gray-400 group-hover:text-[#0b57d0] group-hover:translate-x-0.5 transition-all"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Weekly signups — full width */}
          <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-4">
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100">
              <h3 className="text-[17px] text-gray-950 font-bold flex items-center gap-2">
                Weekly Signups
              </h3>
              <span className="text-[12px] text-gray-500 font-semibold">
                Last 8 weeks
              </span>
            </div>
            {weeklyLoading ? (
              <div className="animate-pulse h-[280px] bg-gray-100 rounded-sm mt-4" />
            ) : (
              <BarChart
                height={280}
                xAxis={[
                  {
                    scaleType: "band",
                    data: weeklyData.map((d) => d.label),
                    tickLabelStyle: { fontSize: 11 },
                  },
                ]}
                series={[
                  {
                    data: weeklyData.map((d) => d.count),
                    color: "#0b57d0",
                    label: "New users",
                    valueFormatter: (v) => `${v ?? 0} new users`,
                  },
                ]}
                slotProps={{
                  legend: { hidden: true },
                }}
                margin={{ top: 16, right: 16, bottom: 32, left: 40 }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
