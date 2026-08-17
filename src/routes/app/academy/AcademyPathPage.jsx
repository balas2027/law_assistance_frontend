import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import Icon from '../../../components/ui/Icon';
import { fetchCoursesApi, fetchLessonsApi } from '../../../lib/api/academy';
import { useUiStore } from '../../../stores/uiStore';

export default function AcademyPathPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
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
  }, [courseId]);

  const handleSelectCourse = async (c) => {
    setSelectedCourse(c);
    navigate(`/academy/path/${c.id}`);
  };

  const totalCount = lessons.length;
  // Let active lesson be the first lesson or the one currently in progress
  const activeLessonIdx = totalCount > 0 ? (totalCount >= 3 ? 2 : totalCount - 1) : 0;
  const activeLesson = lessons[activeLessonIdx] || lessons[0];

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-background">
      <AppSidebar variant="academy" />

      <div
        className={`flex-1 flex flex-col bg-background transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <Topbar variant="academy" />

        <main className="flex-1 flex overflow-hidden">
          {/* ── Main Canvas (Course Map) ── */}
          <div className="flex-1 overflow-y-auto px-8 py-8 min-w-0">

            {/* Course selector tabs if multiple courses exist */}
            {courses.length > 1 && (
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCourse(c)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors shrink-0 ${
                      selectedCourse?.id === c.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
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
                  <div className="h-8 bg-surface-container rounded w-1/2" />
                  <div className="h-4 bg-surface-container rounded w-3/4" />
                </div>
              ) : error ? (
                <div className="bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 text-[13px] flex items-center gap-2">
                  <Icon name="error" size={18} />
                  {error}
                </div>
              ) : selectedCourse ? (
                <>
                  <h1 className="font-h1 text-[32px] font-bold text-primary-container mb-1 tracking-tight">
                    {selectedCourse.title}
                  </h1>
                  {selectedCourse.description && (
                    <p className="font-body-lg text-[15px] text-on-surface-variant mb-6 leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  )}

                  {/* Course Progress Arc / Bar (from UI Reference) */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-level-1 flex items-center gap-6">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-surface-container-highest"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                        />
                        <path
                          className="text-[#fe9832]"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeDasharray="50, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-label-caps text-[13px] font-bold text-primary-container">
                        50%
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-2">
                        <span className="font-label-caps text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                          Course Progress
                        </span>
                        <span className="text-[13px] font-bold text-primary-container">
                          {lessons.length} {lessons.length === 1 ? 'Module' : 'Modules'}
                        </span>
                      </div>
                      <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-[#fe9832] rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6">
                  <Icon name="library_books" size={40} className="text-on-surface-variant/30 mb-2" />
                  <p className="font-h2 text-[17px] text-on-surface font-semibold">No courses available</p>
                  <p className="text-[13px] text-on-surface-variant mt-1">Please check back soon.</p>
                </div>
              )}
            </div>

            {/* ── Timeline Course Map (Exact design from nyayaai_academy.html) ── */}
            <div className="relative max-w-3xl ml-2">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-6 mb-10 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-surface-container shrink-0" />
                    <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-5">
                      <div className="h-4 bg-surface-container rounded w-24 mb-3" />
                      <div className="h-6 bg-surface-container rounded w-2/3 mb-2" />
                      <div className="h-4 bg-surface-container rounded w-full" />
                    </div>
                  </div>
                ))
              ) : lessons.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl p-8">
                  <Icon name="menu_book" size={40} className="text-on-surface-variant/30 mb-3" />
                  <p className="font-h2 text-[17px] text-on-surface font-semibold mb-1">
                    No lessons published yet
                  </p>
                  <p className="text-[13px] text-on-surface-variant">
                    Lessons for this course will appear here once published.
                  </p>
                </div>
              ) : (
                lessons.map((lesson, idx) => {
                  const isCurrent = idx === activeLessonIdx;
                  const isCompleted = idx < activeLessonIdx;
                  const isLocked = idx > activeLessonIdx;

                  if (isCurrent) {
                    // ── Active / Current Lesson Node ──
                    return (
                      <div key={lesson.id} className="relative flex items-start gap-6 mb-12 group">
                        {/* Timeline connector line */}
                        {idx < lessons.length - 1 && (
                          <div className="absolute left-[31px] top-14 bottom-[-48px] w-0.5 bg-outline-variant/60 -translate-x-px" />
                        )}

                        <div className="w-16 h-16 rounded-full bg-[#fe9832] text-white shadow-level-2 flex items-center justify-center border-4 border-background shrink-0 mt-1 relative z-10">
                          <div className="absolute inset-0 rounded-full bg-[#fe9832] opacity-30 animate-ping" />
                          <Icon name="play_arrow" size={28} className="relative z-10" />
                        </div>

                        <div className="flex-1 bg-surface-container-lowest border-2 border-[#fe9832] p-6 rounded-2xl shadow-level-2 mt-0 transform transition-transform hover:-translate-y-0.5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-[11px] font-bold text-[#8f4e00] bg-[#ffdcc2] px-2.5 py-1 rounded font-label-caps uppercase tracking-wider inline-block">
                              Current Lesson
                            </div>
                            <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px] font-medium">
                              <Icon name="schedule" size={16} />
                              <span>15 mins</span>
                            </div>
                          </div>

                          <h3 className="font-h2 text-[22px] font-bold text-primary-container mb-2 leading-snug">
                            {lesson.title}
                          </h3>

                          {lesson.content && (
                            <p className="font-body-md text-[14px] text-on-surface-variant mb-5 line-clamp-2 leading-relaxed">
                              {lesson.content.replace(/<[^>]+>/g, '').slice(0, 160)}…
                            </p>
                          )}

                          <Link
                            to={`/academy/lesson/${lesson.id}`}
                            className="inline-flex items-center gap-2 bg-primary-container text-white px-6 py-2.5 rounded-full font-label-caps text-[13px] font-bold hover:bg-primary transition-colors shadow-sm"
                          >
                            <span>Resume Learning</span>
                            <Icon name="arrow_forward" size={15} />
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  if (isCompleted) {
                    // ── Completed Lesson Node ──
                    return (
                      <div key={lesson.id} className="relative flex items-start gap-6 mb-12 group cursor-pointer">
                        {/* Timeline connector line */}
                        {idx < lessons.length - 1 && (
                          <div className="absolute left-[27px] top-12 bottom-[-48px] w-0.5 bg-[#013000] -translate-x-px" />
                        )}

                        <div className="w-14 h-14 rounded-full bg-[#013000] text-white shadow-level-1 flex items-center justify-center border-4 border-background shrink-0 mt-2 z-10">
                          <Icon name="check" size={24} />
                        </div>

                        <Link
                          to={`/academy/lesson/${lesson.id}`}
                          className="flex-1 bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl shadow-xs hover:shadow-md transition-shadow mt-1 block"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[11px] font-semibold text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                              Lesson {idx + 1}
                            </div>
                            <Icon name="task_alt" size={20} className="text-[#013000]" />
                          </div>

                          <h3 className="font-h2 text-[18px] font-bold text-primary-container mb-1 leading-snug">
                            {lesson.title}
                          </h3>

                          {lesson.content && (
                            <p className="font-body-md text-[13.5px] text-on-surface-variant line-clamp-2 leading-relaxed">
                              {lesson.content.replace(/<[^>]+>/g, '').slice(0, 140)}…
                            </p>
                          )}
                        </Link>
                      </div>
                    );
                  }

                  // ── Locked / Upcoming Lesson Node ──
                  return (
                    <div key={lesson.id} className="relative flex items-start gap-6 mb-12 group opacity-70">
                      {/* Timeline connector line */}
                      {idx < lessons.length - 1 && (
                        <div className="absolute left-[27px] top-12 bottom-[-48px] w-0.5 bg-outline-variant/50 -translate-x-px" />
                      )}

                      <div className="w-14 h-14 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center border-4 border-background shrink-0 mt-2 z-10">
                        <Icon name="lock" size={22} />
                      </div>

                      <div className="flex-1 bg-surface-container-low border border-outline-variant p-5 rounded-2xl mt-1">
                        <div className="text-[11px] font-semibold text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-2">
                          Lesson {idx + 1}
                        </div>

                        <h3 className="font-h2 text-[18px] font-bold text-on-surface-variant mb-1 leading-snug">
                          {lesson.title}
                        </h3>

                        {lesson.content && (
                          <p className="font-body-md text-[13.5px] text-on-surface-variant line-clamp-2 leading-relaxed">
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

          {/* ── Right Side Panel (Module Overview from nyayaai_academy.html) ── */}
          {selectedCourse && (
            <aside className="w-80 bg-surface-container-low border-l border-outline-variant flex flex-col shrink-0 overflow-y-auto">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-h2 text-[18px] font-bold text-primary-container mb-0.5">
                  Module Overview
                </h3>
                <p className="font-label-caps text-[12px] text-on-surface-variant truncate">
                  {activeLesson?.title || selectedCourse.title}
                </p>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Visual / Video card */}
                <div className="aspect-video bg-surface-container-lowest rounded-xl border border-outline-variant flex items-center justify-center relative overflow-hidden group shadow-xs">
                  <div className="absolute inset-0 bg-primary-container/10 group-hover:bg-primary-container/20 transition-colors" />
                  <div className="w-12 h-12 rounded-full bg-surface-container-lowest/90 backdrop-blur shadow-md flex items-center justify-center z-10 text-primary">
                    <Icon name="play_arrow" size={24} />
                  </div>
                </div>

                {/* Subtopics list */}
                <div>
                  <h4 className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider mb-3.5 font-bold">
                    Sub-topics
                  </h4>
                  <ul className="space-y-3">
                    {lessons.slice(0, 4).map((l, i) => {
                      const isDone = i < activeLessonIdx;
                      const isCurrentSub = i === activeLessonIdx;
                      return (
                        <li key={l.id} className="flex gap-3 items-start relative">
                          {isDone ? (
                            <Icon name="check_circle" size={18} className="text-[#013000] mt-0.5 shrink-0" />
                          ) : isCurrentSub ? (
                            <div className="w-4 h-4 rounded-full border-2 border-[#fe9832] border-t-transparent animate-spin shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-outline-variant shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/academy/lesson/${l.id}`}
                              className={`text-[13px] font-medium block truncate hover:text-primary transition-colors ${
                                isCurrentSub ? 'text-primary font-bold' : 'text-on-surface-variant'
                              }`}
                            >
                              {l.title}
                            </Link>
                            <p className="text-[11px] text-on-surface-variant">
                              {isDone ? 'Completed' : isCurrentSub ? 'In Progress • 5 mins left' : '10 mins'}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Key Case summary tip */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-1.5 text-primary font-bold text-[12px] font-label-caps">
                    <Icon name="lightbulb" size={16} />
                    <span>Key Case Precedent</span>
                  </div>
                  <p className="text-[12.5px] text-on-surface-variant leading-relaxed">
                    Maneka Gandhi v. Union of India established that legal procedure must be just, fair, and reasonable under Indian constitutional law.
                  </p>
                </div>
              </div>

              {/* Bottom Continue Learning button */}
              {activeLesson && (
                <div className="p-5 border-t border-outline-variant bg-surface shrink-0">
                  <Link
                    to={`/academy/lesson/${activeLesson.id}`}
                    className="w-full py-3 bg-[#fe9832] text-white rounded-xl font-label-caps text-[13px] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
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