import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import { useAuth } from '../../../hooks/useAuth';
import { useUiStore } from '../../../stores/uiStore';
import { fetchCoursesApi, fetchLessonsApi } from '../../../lib/api/academy';

export default function AcademyDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();

  const [courses, setCourses] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchCoursesApi()
      .then(async (allCourses) => {
        const list = Array.isArray(allCourses) ? allCourses : [];
        setCourses(list);

        // Calculate total published lessons across courses
        let count = 0;
        for (const c of list) {
          const ls = await fetchLessonsApi({ courseId: c.id }).catch(() => []);
          count += (Array.isArray(ls) ? ls : []).filter((l) => l.status === 'published' || !l.status).length;
        }
        setTotalLessons(count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCourse = courses[0];

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-background">
      <AppSidebar variant="academy" />

      <div
        className={`flex-1 flex flex-col bg-background transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >


        <Topbar variant="academy" />

        <main className="flex-1 overflow-y-auto px-8 py-6 w-full pb-20">
          {/* ── Welcome Banner ── */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary-container via-primary to-slate-900 text-white rounded-2xl p-7 shadow-level-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white backdrop-blur-sm mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Student Portal
              </span>
              <h1 className="font-h1 text-[26px] md:text-[30px] font-bold text-white mb-1 tracking-tight">
                Welcome back, {user?.full_name || 'Legal Scholar'}
              </h1>
              <p className="text-white/80 text-[14px] max-w-xl leading-relaxed">
                Continue your journey through Indian Penal Codes, case laws, and legal procedures.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/chat')}
                className="px-5 py-2.5 bg-white text-primary font-bold text-[13px] rounded-xl hover:bg-white/90 transition-all shadow-sm flex items-center gap-2"
              >
                Ask AI Assistant
              </button>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div>
                <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Courses</p>
                <p className="font-h1 text-[22px] font-bold text-primary">{courses.length}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div>
                <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Lessons</p>
                <p className="font-h1 text-[22px] font-bold text-primary">{totalLessons}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div>
                <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Daily Streak</p>
                <p className="font-h1 text-[22px] font-bold text-primary">3 Days 🔥</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div>
                <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">Experience</p>
                <p className="font-h1 text-[22px] font-bold text-primary">Level 3 • 450 XP</p>
              </div>
            </div>
          </div>

          {/* ── Main Two Column Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: In Progress & Available Courses */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Course Card */}
              {activeCourse && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Current Course in Progress
                    </span>
                    <Link
                      to={`/academy/path/${activeCourse.id}`}
                      className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      View Curriculum
                    </Link>
                  </div>

                  <h2 className="font-h2 text-[20px] font-bold text-primary mb-2">
                    {activeCourse.title}
                  </h2>
                  {activeCourse.description && (
                    <p className="text-[14px] text-on-surface-variant mb-5 leading-relaxed">
                      {activeCourse.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/50">
                    <span className="text-[13px] text-on-surface-variant font-medium">
                      Structured curriculum modules
                    </span>
                    <button
                      onClick={() => navigate(`/academy/path/${activeCourse.id}`)}
                      className="px-5 py-2 bg-primary text-white text-[13px] font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                    >
                      Resume Learning
                    </button>
                  </div>
                </div>
              )}

              {/* All Courses Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-h2 text-[18px] font-bold text-primary flex items-center gap-2">
                    Available Learning Paths
                  </h2>
                  <span className="text-[12px] font-medium text-on-surface-variant">
                    {courses.length} {courses.length === 1 ? 'course' : 'courses'}
                  </span>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-32 bg-surface-container animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
                    <p className="text-[15px] font-semibold text-on-surface">No courses available yet</p>
                    <p className="text-[13px] text-on-surface-variant mt-1">Check back soon for new legal modules.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => navigate(`/academy/path/${c.id}`)}
                        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="font-h2 text-[16px] font-bold text-primary group-hover:text-secondary-container transition-colors mb-1.5 line-clamp-1">
                            {c.title}
                          </h3>
                          {c.description && (
                            <p className="text-[13px] text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                              {c.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40 text-[12px]">
                          <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            Explore Path
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Practice & Fast Tools */}
            <div className="space-y-6">
              {/* Mock Test Practice Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <h3 className="font-h2 text-[16px] font-bold text-primary">Mock Tests & Quizzes</h3>
                    <p className="text-[12px] text-on-surface-variant">Test your IPC comprehension</p>
                  </div>
                </div>
                <p className="text-[13px] text-on-surface-variant mb-4 leading-relaxed">
                  Practice scenario-based legal questions and instant explanations to solidify your knowledge.
                </p>
                <button
                  onClick={() => navigate('/academy/quiz')}
                  className="w-full py-2.5 bg-surface-container-high text-primary font-bold text-[13px] rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Start Practice Quiz
                  </button>
              </div>

              {/* AI Assistant Quick Ask */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <h3 className="font-h2 text-[16px] font-bold text-primary">Case Law Research</h3>
                    <p className="text-[12px] text-on-surface-variant">Instant Indian law reference</p>
                  </div>
                </div>
                <p className="text-[13px] text-on-surface-variant mb-4 leading-relaxed">
                  Have a question about specific sections or case precedents? Ask our legal AI directly.
                </p>
                <button
                  onClick={() => navigate('/chat')}
                  className="w-full py-2.5 bg-primary text-white font-bold text-[13px] rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Ask NyayaAI
                  </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
