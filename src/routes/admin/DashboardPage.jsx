import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Icon from '../../components/ui/Icon';
import { useAdminStore } from '../../stores/adminStore';
import { useUiStore } from '../../stores/uiStore';

const STAT_CARDS = [
  { key: 'total_users',    label: 'Total Users',    icon: 'group',          color: 'text-primary' },
  { key: 'total_students', label: 'Law Students',   icon: 'school',         color: 'text-secondary' },
  { key: 'total_courses',  label: 'Courses',        icon: 'library_books',  color: 'text-tertiary-container' },
  { key: 'total_lessons',  label: 'Lessons',        icon: 'menu_book',      color: 'text-primary' },
  { key: 'total_quizzes',  label: 'Quizzes',        icon: 'quiz',           color: 'text-secondary' },
];

const TYPE_COLORS = [
  'bg-primary',
  'bg-secondary',
  'bg-tertiary-container',
  'bg-error',
  'bg-primary-container',
];

function SkeletonCard() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1 animate-pulse">
      <div className="w-6 h-6 bg-surface-container rounded mb-4" />
      <div className="w-24 h-3 bg-surface-container rounded mb-2" />
      <div className="w-16 h-8 bg-surface-container rounded" />
    </div>
  );
}

export default function DashboardPage() {

  const { stats, loading, loadStats } = useAdminStore();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();

  useEffect(() => { loadStats(); }, [loadStats]);

  const userBreakdown = stats?.users_by_type ? Object.entries(stats.users_by_type) : [];
  const totalForChart = userBreakdown.reduce((sum, [, v]) => sum + v, 0) || 1;

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col w-full min-w-0 bg-background relative overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >

        {/* Header */}
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm z-10 w-full h-16 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-h1 font-bold text-primary tracking-tight text-[18px]">
            Dashboard
          </h2>
          <button
            id="dashboard-goto-cms-btn"
            onClick={() => navigate('/admin/cms')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-label-caps text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Icon name="edit_note" size={16} />
            Content CMS
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 w-full pb-24">


          {/* Page heading */}
          <div className="mb-8">
            <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-1">Platform Analytics</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Live counts from the database — updated on each visit.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {loading || !stats
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : STAT_CARDS.map(({ key, label, icon, color }) => (
                  <div
                    key={key}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-level-1 flex flex-col relative overflow-hidden group hover:shadow-level-2 transition-shadow"
                  >
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-surface-container rounded-full opacity-40 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                    <Icon name={icon} size={22} className={`${color} mb-3`} />
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    <p className={`font-h1 text-[28px] font-black ${color}`}>
                      {(stats[key] ?? 0).toLocaleString()}
                    </p>
                  </div>
                ))}
          </div>

          {/* User breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Breakdown bars */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1">
              <h3 className="font-h2 text-[18px] text-primary font-bold mb-6 flex items-center gap-2">
                <Icon name="pie_chart" size={20} />
                Users by Role
              </h3>
              {loading || !stats ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-32 h-3 bg-surface-container rounded mb-1" />
                      <div className="h-3 bg-surface-container rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : userBreakdown.length === 0 ? (
                <p className="text-on-surface-variant font-body-md">No user data yet.</p>
              ) : (
                <div className="space-y-4">
                  {userBreakdown.map(([typeName, count], i) => {
                    const pct = Math.round((count / totalForChart) * 100);
                    return (
                      <div key={typeName}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                            {typeName}
                          </span>
                          <span className="font-body-md font-semibold text-primary">{count.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${TYPE_COLORS[i % TYPE_COLORS.length]}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">{pct}%</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Content overview */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1">
              <h3 className="font-h2 text-[18px] text-primary font-bold mb-6 flex items-center gap-2">
                <Icon name="library_books" size={20} />
                Content Overview
              </h3>
              {loading || !stats ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-surface-container rounded-lg" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Courses',  value: stats.total_courses,  icon: 'library_books', to: '/admin/cms' },
                    { label: 'Lessons',  value: stats.total_lessons,  icon: 'menu_book',     to: '/admin/cms' },
                    { label: 'Quizzes', value: stats.total_quizzes,  icon: 'quiz',          to: '/admin/quiz-builder' },
                  ].map(({ label, value, icon, to }) => (
                    <button
                      key={label}
                      onClick={() => navigate(to)}
                      className="w-full flex items-center justify-between bg-surface-container hover:bg-surface-container-high transition-colors rounded-lg px-4 py-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={icon} size={20} className="text-primary" />
                        <span className="font-body-md font-medium text-on-surface">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-h2 text-[22px] font-black text-primary">{(value ?? 0).toLocaleString()}</span>
                        <Icon name="chevron_right" size={18} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}