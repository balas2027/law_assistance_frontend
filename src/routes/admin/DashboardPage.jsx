import { useEffect } from 'react';
import AdminSidebar from '../../components/layout/AdminSidebar';
import StatCard from '../../components/features/admin/StatCard';
import CurriculumTable from '../../components/features/admin/CurriculumTable';
import LivePreviewPanel from '../../components/features/admin/LivePreviewPanel';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { useAdminStore } from '../../stores/adminStore';

export default function DashboardPage() {
  const { stats, curriculum, preview, loadDashboard } = useAdminStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <AdminSidebar />

      <main className="flex-1 flex flex-col w-full min-w-0 bg-background relative overflow-hidden">
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm z-10 w-full">
          <div className="flex justify-between items-center w-full px-gutter h-16 max-w-[1200px] mx-auto">
            <div className="flex items-center gap-6">
              <h2 className="font-h1 text-h1 font-black text-primary tracking-tight md:text-[24px]">NyayaAI Admin</h2>
              <nav className="hidden lg:flex items-center gap-6 border-l border-outline-variant pl-6 h-8">
                <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-all pb-1 border-b-2 border-transparent cursor-pointer">
                  Directives
                </a>
                <a className="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-1 cursor-pointer">
                  Compliance
                </a>
                <a className="font-label-caps text-label-caps text-on-surface-variant hover:text-secondary transition-all pb-1 border-b-2 border-transparent cursor-pointer">
                  Academy Logs
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors flex items-center justify-center relative">
                <Icon name="notifications" size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors flex items-center justify-center">
                <Icon name="gavel" size={20} />
              </button>
              <div className="w-px h-6 bg-outline-variant mx-1" />
              <Button variant="primary" className="px-4 py-2">
                Publish Changes
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-gutter lg:p-margin-desktop w-full max-w-[1200px] mx-auto pb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-2">Content Management</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Manage curriculum, draft legal modules, and oversee publishing status across the academy.
              </p>
            </div>
            <Button
              variant="secondary"
              className="px-6 py-3 font-bold"
              icon={<Icon name="add_circle" size={18} />}
            >
              New Lesson
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <CurriculumTable rows={curriculum} />
            <LivePreviewPanel preview={preview} />
          </div>
        </div>
      </main>
    </div>
  );
}