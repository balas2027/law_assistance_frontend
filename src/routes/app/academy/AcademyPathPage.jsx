import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import Icon from '../../../components/ui/Icon';
import { fetchCoursesApi, fetchLessonsApi } from '../../../lib/api/academy';
import { fetchAcademyStatsApi } from '../../../lib/api/progress';
import { useUiStore } from '../../../stores/uiStore';

export default function AcademyPathPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all courses and pick the active one
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCoursesApi()
      .then(async (allCourses) => {
        const list = Array.isArray(allCourses) ? allCourses : [];
        setCourses(list);

        if (list.length === 0) {
          setSelectedCourse(null);
          setLessons([]);
          setLoading(false);
          return;
        }

        // Match selected course by numeric ID or default to the first course
        let active = null;
        if (courseId && !isNaN(Number(courseId))) {
          active = list.find((c) => String(c.id) === String(courseId));
        }
        if (!active) {
          active = list[0];
        }

        setSelectedCourse(active);

        // Fetch lessons for active course
        const rawLessons = await fetchLessonsApi({ courseId: active.id }).catch(() => []);
        // Learners only see published lessons
        const publishedOnly = (Array.isArray(rawLessons) ? rawLessons : []).filter(
          (l) => l.status === 'published' || !l.status,
        );
        setLessons(publishedOnly);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load courses');
      })
      .finally(() => {
        setLoading(false);
      });

    // Real lesson completion data for progress tracking
    fetchAcademyStatsApi()
      .then((data) => {
        if (!data?.courses) return;
        const ids = new Set();
        for (const c of data.courses) {
          (c.completed_lesson_ids || []).forEach((id) => ids.add(Number(id)));
        }
        setCompletedIds(ids);
      })
      .catch(() => {});
  }, [courseId]);

  const handleSelectCourse = async (c) => {
    setSelectedCourse(c);
    navigate(`/academy/path/${c.id}`);
  };

  const totalCount = lessons.length;
  const completedCount = lessons.filter((l) => completedIds.has(Number(l.id))).length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  // Active lesson = first lesson not yet completed
  const activeLessonIdx = lessons.findIndex((l) => !completedIds.has(Number(l.id)));
  const activeLesson = lessons[activeLessonIdx] || lessons[totalCount - 1] || lessons[0];

  return (
    <div className="flex h-screen overflow-hidden antialiased bg-[#fafbfc] font-sans">
      <AppSidebar variant="academy" />

      <div
        className={`flex-1 flex flex-col bg-[#fafbfc] transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <Topbar variant="academy" />

        <main className="flex-1 flex overflow-hidden">
          {/* ── Main Canvas (Course Map) ── */}
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 min-w-0">

            {/* Course selector tabs if multiple courses exist */}
            {courses.length > 1 && (
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCourse(c)}
                    className={`px-4 py-2 rounded-sm text-[13.5px] font-semibold transition-colors shrink-0 cursor-pointer ${
                      selectedCourse?.id === c.id
                        ? 'bg-[#0b57d0] text-white shadow-xs'
                        : 'bg-white border border-gray-200/90 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            )}

            {/* Header Section */}
            <div className="mb-10 max-w-3xl">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-sm px-4 py-3 text-[13px] flex items-center gap-2">
                  <Icon name="error" size={18} />
                  {error}
                </div>
              ) : selectedCourse ? (
                <>
                  <p className="text-[12px] font-bold text-gray-500 tracking-[0.12em] uppercase mb-1.5">
                    LEARNING PATH
                  </p>
                  <h1 className="text-[28px] md:text-[34px] font-bold text-gray-950 mb-2 tracking-tight">
                    {selectedCourse.title}
                  </h1>
                  {selectedCourse.description && (
                    <p className="text-[14.5px] text-gray-600 mb-6 leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  )}

                  {/* Course Progress Card */}
                  <div className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center gap-6">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className="text-[#0b57d0]"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray={`${progressPct}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[12.5px] font-bold text-[#0b57d0]">
                        {progressPct}%
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                          Course Progress
                        </span>
                        <span className="text-[13px] font-bold text-gray-900">
                          {completedCount} of {lessons.length} {lessons.length === 1 ? 'Module' : 'Modules'} completed
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0b57d0] rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white border border-gray-200/90 rounded-sm p-6">
                  <Icon name="library_books" size={40} className="text-gray-400 mb-2" />
                  <p className="text-[17px] text-gray-900 font-semibold">No courses available</p>
                  <p className="text-[13px] text-gray-500 mt-1">Please check back soon.</p>
                </div>
              )}
            </div>

            {/* ── Timeline Course Map ── */}
            <div className="relative max-w-3xl ml-2">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-6 mb-10 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 bg-white border border-gray-200/90 rounded-sm p-5">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))
              ) : lessons.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center bg-white border border-gray-200/90 rounded-sm p-8">
                  <Icon name="menu_book" size={40} className="text-gray-400 mb-3" />
                  <p className="text-[17px] text-gray-900 font-semibold mb-1">
                    No lessons published yet
                  </p>
                  <p className="text-[13px] text-gray-500">
                    Lessons for this course will appear here once published.
                  </p>
                </div>
              ) : (
                lessons.map((lesson, idx) => {
                  const isCurrent = idx === activeLessonIdx;
                  const isCompleted = completedIds.has(Number(lesson.id));

                  if (isCurrent) {
                    // ── Active / Current Lesson Node ──
                    return (
                      <div key={lesson.id} className="relative flex items-start gap-6 mb-12 group">
                        {idx < lessons.length - 1 && (
                          <div className="absolute left-[31px] top-14 bottom-[-48px] w-0.5 bg-gray-200 -translate-x-px" />
                        )}

                        <div className="w-16 h-16 rounded-full bg-[#0b57d0] text-white shadow-xs flex items-center justify-center border-4 border-[#fafbfc] shrink-0 mt-1 relative z-10">
                          <div className="absolute inset-0 rounded-full bg-[#0b57d0] opacity-20 animate-ping" />
                          <Icon name="play_arrow" size={28} className="relative z-10" />
                        </div>

                        <div className="flex-1 bg-white border-2 border-[#0b57d0] p-6 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] mt-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-[11px] font-bold text-[#0b57d0] bg-[#eaf1fc] px-2.5 py-1 rounded-sm uppercase tracking-wider inline-block">
                              {progressPct > 0 ? 'Resume Here' : 'Start Here'}
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 text-[12px] font-medium">
                              <Icon name="menu_book" size={16} />
                              <span>Lesson {idx + 1}</span>
                            </div>
                          </div>

                          <h3 className="text-[20px] font-bold text-gray-950 mb-2 leading-snug">
                            {lesson.title}
                          </h3>

                          {lesson.content && (
                            <p className="text-[14px] text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                              {lesson.content.replace(/<[^>]+>/g, '').slice(0, 160)}…
                            </p>
                          )}

                          <button
                            onClick={() => navigate(`/academy/lesson/${lesson.id}`)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[13px] tracking-wider uppercase rounded-sm transition-colors cursor-pointer shadow-xs"
                          >
                            <span>{progressPct > 0 ? 'Resume Lesson' : 'Start Lesson'}</span>
                            <Icon name="arrow_forward" size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (isCompleted) {
                    // ── Completed Lesson Node ──
                    return (
                      <div key={lesson.id} className="relative flex items-start gap-6 mb-12 group cursor-pointer">
                        {idx < lessons.length - 1 && (
                          <div className="absolute left-[27px] top-12 bottom-[-48px] w-0.5 bg-[#0b57d0] -translate-x-px" />
                        )}

                        <div className="w-14 h-14 rounded-full bg-[#eaf1fc] text-[#0b57d0] shadow-xs flex items-center justify-center border-4 border-[#fafbfc] shrink-0 mt-2 z-10">
                          <Icon name="check" size={24} />
                        </div>

                        <Link
                          to={`/academy/lesson/${lesson.id}`}
                          className="flex-1 bg-white border border-gray-200/90 p-5 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gray-300 transition-all mt-1 block"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                              Lesson {idx + 1}
                            </div>
                            <Icon name="task_alt" size={20} className="text-[#0b57d0]" />
                          </div>

                          <h3 className="text-[18px] font-bold text-gray-950 mb-1 leading-snug group-hover:text-[#0b57d0] transition-colors">
                            {lesson.title}
                          </h3>

                          {lesson.content && (
                            <p className="text-[13.5px] text-gray-600 line-clamp-2 leading-relaxed">
                              {lesson.content.replace(/<[^>]+>/g, '').slice(0, 140)}…
                            </p>
                          )}
                        </Link>
                      </div>
                    );
                  }

                  // ── Locked / Upcoming Lesson Node ──
                  return (
                    <div key={lesson.id} className="relative flex items-start gap-6 mb-12 group opacity-60">
                      {idx < lessons.length - 1 && (
                        <div className="absolute left-[27px] top-12 bottom-[-48px] w-0.5 bg-gray-200 -translate-x-px" />
                      )}

                      <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center border-4 border-[#fafbfc] shrink-0 mt-2 z-10">
                        <Icon name="lock" size={20} />
                      </div>

                      <div className="flex-1 bg-white border border-gray-200/90 p-5 rounded-sm mt-1">
                        <div className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-2">
                          Lesson {idx + 1}
                        </div>

                        <h3 className="text-[18px] font-bold text-gray-700 mb-1 leading-snug">
                          {lesson.title}
                        </h3>

                        {lesson.content && (
                          <p className="text-[13.5px] text-gray-500 line-clamp-2 leading-relaxed">
                            {lesson.content.replace(/<[^>]+>/g, '').slice(0, 140)}…
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right Side Panel ── */}
          {selectedCourse && (
            <aside className="w-80 bg-white border-l border-gray-200/90 flex flex-col shrink-0 overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-[17px] font-bold text-gray-950 mb-0.5">
                  Module Overview
                </h3>
                <p className="text-[12px] text-gray-500 truncate font-medium">
                  {activeLesson?.title || selectedCourse.title}
                </p>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Visual card */}
                <div className="aspect-video bg-[#eaf1fc] rounded-sm border border-blue-100 flex items-center justify-center relative overflow-hidden group shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center z-10 text-[#0b57d0]">
                    <Icon name="play_arrow" size={24} />
                  </div>
                </div>

                {/* Subtopics list */}
                <div>
                  <h4 className="text-[11px] text-gray-500 uppercase tracking-wider mb-3.5 font-bold">
                    Sub-topics
                  </h4>
                  <ul className="space-y-3">
                    {lessons.slice(0, 4).map((l, i) => {
                      const isDone = completedIds.has(Number(l.id));
                      const isCurrentSub = i === activeLessonIdx;
                      return (
                        <li key={l.id} className="flex gap-3 items-start relative">
                          {isDone ? (
                            <Icon name="check_circle" size={18} className="text-[#0b57d0] mt-0.5 shrink-0" />
                          ) : isCurrentSub ? (
                            <div className="w-4 h-4 rounded-full border-2 border-[#0b57d0] border-t-transparent animate-spin shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/academy/lesson/${l.id}`}
                              className={`text-[13px] font-medium block truncate hover:text-[#0b57d0] transition-colors ${
                                isCurrentSub ? 'text-[#0b57d0] font-bold' : 'text-gray-700'
                              }`}
                            >
                              {l.title}
                            </Link>
                            <p className="text-[11px] text-gray-400">
                              {isDone ? 'Completed' : isCurrentSub ? 'Next up' : 'Upcoming'}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Key Case summary tip */}
                <div className="bg-[#f0f7ff] border border-blue-100 rounded-sm p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-1.5 text-[#0b57d0] font-bold text-[12px] uppercase tracking-wider">
                    <Icon name="lightbulb" size={16} />
                    <span>Key Case Precedent</span>
                  </div>
                  <p className="text-[12.5px] text-gray-600 leading-relaxed">
                    Maneka Gandhi v. Union of India established that legal procedure must be just, fair, and reasonable under Indian constitutional law.
                  </p>
                </div>
              </div>

              {/* Bottom Continue Learning button */}
              {activeLesson && (
                <div className="p-5 border-t border-gray-100 bg-[#fafbfc] shrink-0">
                  <Link
                    to={`/academy/lesson/${activeLesson.id}`}
                    className="w-full py-3 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-sm text-[13px] font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <span>Continue Learning</span>
                    <Icon name="arrow_forward" size={16} />
                  </Link>
                </div>
              )}
            </aside>
          )}
        </main>
      </div>
    </div>
  );
}