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
        <header className="bg-white border-b border-gray-200/90 shadow-xs z-10 w-full h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold shadow-xs">
              <Icon name="dashboard" size={18} />
            </div>
            <h2 className="text-[18px] font-bold text-gray-950 tracking-tight">
              Dashboard Overview
            </h2>
          </div>
          <button
            id="dashboard-goto-cms-btn"
            onClick={() => navigate('/admin/cms')}
            className="flex items-center gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white px-4 py-2 rounded-sm text-[13px] font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
          >
            <Icon name="edit_note" size={16} />
            <span>Content CMS</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-8 w-full pb-24 bg-[#fafbfc]">
          {/* Page heading */}
          <div className="mb-8">
            <p className="text-[12px] font-bold text-gray-500 tracking-[0.12em] uppercase mb-1.5">
              ADMIN ANALYTICS
            </p>
            <h1 className="text-[28px] md:text-[32px] font-bold text-gray-950 tracking-tight mb-1">
              Platform Overview
            </h1>
            <p className="text-[14px] text-gray-600">
              Live statistics and content health directly from your Neon database.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {loading || !stats
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              : [
                  { key: 'total_users', label: 'Total Users', icon: 'group', color: 'text-[#0b57d0]', bg: 'bg-[#eaf1fc]' },
                  { key: 'total_students', label: 'Learners', icon: 'school', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { key: 'total_courses', label: 'Courses', icon: 'library_books', color: 'text-emerald-700', bg: 'bg-emerald-50' },
                  { key: 'total_lessons', label: 'Lessons', icon: 'menu_book', color: 'text-indigo-700', bg: 'bg-indigo-50' },
                  { key: 'total_quizzes', label: 'Quizzes', icon: 'quiz', color: 'text-purple-700', bg: 'bg-purple-50' },
                ].map(({ key, label, icon, color, bg }) => (
                  <div
                    key={key}
                    className="bg-white border border-gray-200/90 rounded-sm p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden group hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-9 h-9 rounded-sm ${bg} ${color} flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon name={icon} size={20} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Live</span>
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

          {/* User breakdown & content overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Breakdown bars */}
            <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                <h3 className="text-[17px] text-gray-950 font-bold flex items-center gap-2">
                  <Icon name="pie_chart" size={20} className="text-[#0b57d0]" />
                  Users by Role
                </h3>
                <span className="text-[12px] text-gray-500 font-semibold">
                  {totalForChart} Total
                </span>
              </div>
              {loading || !stats ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-32 h-3 bg-gray-100 rounded mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : userBreakdown.length === 0 ? (
                <p className="text-gray-500 text-[13.5px] py-4 text-center">No user data registered yet.</p>
              ) : (
                <div className="space-y-4">
                  {userBreakdown.map(([typeName, count]) => {
                    const pct = Math.round((count / totalForChart) * 100);
                    return (
                      <div key={typeName}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                            {typeName}
                          </span>
                          <span className="text-[13px] font-bold text-gray-900">{count.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0b57d0] transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Content overview */}
            <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100">
                <h3 className="text-[17px] text-gray-950 font-bold flex items-center gap-2">
                  <Icon name="library_books" size={20} className="text-[#0b57d0]" />
                  Curriculum & Assessments
                </h3>
                <span className="text-[12px] text-gray-500 font-semibold">Quick Access</span>
              </div>
              {loading || !stats ? (
                <div className="space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-sm" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Courses Management', value: stats.total_courses, icon: 'library_books', to: '/admin/cms', desc: 'Curriculum modules & tracks' },
                    { label: 'Published Lessons', value: stats.total_lessons, icon: 'menu_book', to: '/admin/cms', desc: 'Interactive reading materials' },
                    { label: 'Quiz & Test Builder', value: stats.total_quizzes, icon: 'quiz', to: '/admin/quiz-builder', desc: 'Mock tests and scenarios' },
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
                          <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#0b57d0] transition-colors">{label}</p>
                          <p className="text-[12px] text-gray-500">{desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[18px] font-bold text-gray-900">{(value ?? 0).toLocaleString()}</span>
                        <Icon name="arrow_forward" size={16} className="text-gray-400 group-hover:text-[#0b57d0] group-hover:translate-x-0.5 transition-all" />
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