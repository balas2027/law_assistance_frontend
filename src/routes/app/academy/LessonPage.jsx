import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import Icon from '../../../components/ui/Icon';
import { fetchLessonApi, fetchLessonsApi } from '../../../lib/api/academy';
import { useUiStore } from '../../../stores/uiStore';


// ── Skeleton ──────────────────────────────────────────────────────────────────
function LessonSkeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-[850px] mx-auto px-gutter py-10">
      <div className="h-3 bg-surface-container rounded w-40 mb-2" />
      <div className="h-8 bg-surface-container rounded w-3/4" />
      <div className="h-4 bg-surface-container rounded w-1/2" />
      <div className="h-40 bg-surface-container rounded-xl" />
      <div className="space-y-2">
        <div className="h-3 bg-surface-container rounded" />
        <div className="h-3 bg-surface-container rounded w-5/6" />
        <div className="h-3 bg-surface-container rounded w-4/6" />
      </div>
    </div>
  );
}

// ── Side milestone item ───────────────────────────────────────────────────────
function MilestoneItem({ lesson: l, current }) {
  const isCurrent = l.id === current;
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
        isCurrent ? 'bg-surface-container' : 'hover:bg-surface-container/50'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
          isCurrent
            ? 'bg-secondary-container text-on-secondary-container'
            : l.status === 'published'
            ? 'bg-tertiary-container/30 text-tertiary-container'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        {isCurrent ? (
          <Icon name="play_arrow" size={12} fill />
        ) : l.status === 'published' ? (
          <Icon name="check" size={12} />
        ) : (
          <Icon name="draft" size={12} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`font-body-md text-[13px] leading-snug ${
            isCurrent ? 'text-primary font-semibold' : 'text-on-surface-variant'
          }`}
        >
          {l.title}
        </p>
        {l.author_name && (
          <p className="text-[11px] text-on-surface-variant/60 mt-0.5">{l.author_name}</p>
        )}
      </div>
    </div>
  );
}

// ── Reading toolbar (WYSIWYG-style) ──────────────────────────────────────────
function ReadingToolbar({ lesson }) {
  return (
    <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur border-b border-outline-variant/50 px-4 py-2 flex items-center gap-2 text-[12px] text-on-surface-variant">
      {/* Breadcrumb */}
      <Link
        to={lesson?.course_id ? `/academy/path/${lesson.course_id}` : '/chat'}
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <Icon name="arrow_back" size={14} />
        Back to Course
      </Link>
      <span className="text-outline-variant">›</span>
      <span className="text-primary font-medium truncate max-w-[260px]">{lesson?.title}</span>
      <div className="ml-auto flex items-center gap-3">
        {lesson?.status === 'published' ? (
          <span className="flex items-center gap-1 text-tertiary-container font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
            Published
          </span>
        ) : (
          <span className="flex items-center gap-1 text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/40" />
            Draft
          </span>
        )}
        {lesson?.author_name && (
          <>
            <span className="text-outline-variant">|</span>
            <span className="flex items-center gap-1">
              <Icon name="person" size={12} />
              {lesson.author_name}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LessonPage() {

  const { lessonId } = useParams();
  const { sidebarCollapsed } = useUiStore();
  const [lesson,      setLesson]      = useState(null);
  const [siblings,    setSiblings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    setError(null);
    fetchLessonApi(lessonId)
      .then(async (l) => {
        setLesson(l);
        if (l?.course_id) {
          const ls = await fetchLessonsApi({ courseId: l.course_id }).catch(() => []);
          setSiblings(Array.isArray(ls) ? ls : []);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [lessonId]);

  const currentIdx = siblings.findIndex((l) => String(l.id) === String(lessonId));
  const prevLesson = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextLesson = currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  return (
    <div className="bg-background text-on-background font-body-md text-body-md overflow-hidden flex h-screen">
      <AppSidebar variant="curriculum" />
      <div
        className={`flex-1 flex flex-col h-screen relative transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >


        <Topbar variant="academy" />

        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* WYSIWYG-style reading toolbar */}
          {!loading && lesson && <ReadingToolbar lesson={lesson} />}

          <div className="flex-1 flex">
            {/* Article body */}
            <div className="flex-1 max-w-[820px] w-full mx-auto px-4 sm:px-gutter py-8 lg:py-10">
              {loading ? (
                <LessonSkeleton />
              ) : error ? (
                <div className="bg-error/10 border border-error/30 text-error rounded-xl px-5 py-4 flex items-center gap-2">
                  <Icon name="error" size={18} />
                  {error}
                </div>
              ) : !lesson ? (
                <div className="flex flex-col items-center py-20 text-center">
                  <Icon name="menu_book" size={48} className="text-on-surface-variant/30 mb-4" />
                  <p className="font-h2 text-[18px] text-on-surface-variant">Lesson not found</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <header className="mb-8">
                    <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary mb-4 text-balance">
                      {lesson.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-on-surface-variant">
                      {lesson.course_id && (
                        <Link
                          to={`/academy/path/${lesson.course_id}`}
                          className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full hover:bg-surface-container-high transition-colors"
                        >
                          <Icon name="library_books" size={12} />
                          View Course
                        </Link>
                      )}
                      {lesson.author_name && (
                        <span className="flex items-center gap-1">
                          <Icon name="person" size={12} />
                          {lesson.author_name}
                        </span>
                      )}
                      {lesson.updated_at && (
                        <span className="flex items-center gap-1">
                          <Icon name="schedule" size={12} />
                          Updated{' '}
                          {new Date(lesson.updated_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </header>

                  {/* Rich-text content rendered as HTML (from the WYSIWYG editor) */}
                  {lesson.content ? (
                    <article
                      className="prose-lesson"
                      dangerouslySetInnerHTML={{ __html: lesson.content }}
                    />
                  ) : (
                    <div className="bg-surface-container border border-outline-variant/50 rounded-xl p-8 text-center">
                      <Icon name="edit_note" size={40} className="text-on-surface-variant/30 mb-3" />
                      <p className="font-body-md text-on-surface-variant">
                        No content yet. The admin hasn't added content to this lesson.
                      </p>
                    </div>
                  )}

                  {/* Prev / Next navigation */}
                  <div className="mt-12 pt-6 border-t border-outline-variant flex justify-between gap-4">
                    {prevLesson ? (
                      <Link
                        to={`/academy/lesson/${prevLesson.id}`}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps"
                      >
                        <Icon name="arrow_back" size={16} />
                        <span className="max-w-[200px] truncate">{prevLesson.title}</span>
                      </Link>
                    ) : <div />}

                    {nextLesson ? (
                      <Link
                        to={`/academy/lesson/${nextLesson.id}`}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps"
                      >
                        <span className="max-w-[200px] truncate">{nextLesson.title}</span>
                        <Icon name="arrow_forward" size={16} />
                      </Link>
                    ) : (
                      lesson.course_id && (
                        <Link
                          to={`/academy/path/${lesson.course_id}`}
                          className="flex items-center gap-2 text-primary font-label-caps text-label-caps font-semibold"
                        >
                          Back to Course
                          <Icon name="arrow_forward" size={16} />
                        </Link>
                      )
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right sidebar — lesson list for this course */}
            {!loading && siblings.length > 0 && (
              <aside className="hidden xl:block w-72 bg-surface-container-lowest border-l border-outline-variant sticky top-0 h-full overflow-y-auto p-5 shadow-[-4px_0_24px_rgba(23,37,84,0.02)]">
                <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-4 border-b border-outline-variant pb-3">
                  Course Lessons
                </h3>
                <div className="space-y-1">
                  {siblings.map((l) => (
                    <Link key={l.id} to={`/academy/lesson/${l.id}`} className="block">
                      <MilestoneItem lesson={l} current={lessonId} />
                    </Link>
                  ))}
                </div>
                {lesson?.course_id && (
                  <div className="mt-6 pt-4 border-t border-outline-variant">
                    <Link
                      to={`/academy/path/${lesson.course_id}`}
                      className="w-full bg-primary text-white font-label-caps text-label-caps px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-level-1 flex items-center justify-center gap-2"
                    >
                      <Icon name="library_books" size={16} />
                      Course Overview
                    </Link>
                  </div>
                )}
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}