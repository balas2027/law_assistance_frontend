import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Icon from '../../components/ui/Icon';
import { useCmsStore } from '../../stores/cmsStore';
import { useUiStore } from '../../stores/uiStore';
import { PUBLISH_STATUS } from '../../types/admin';

function StatusBadge({ status, onClick, clickable = false, title = '' }) {
  const isPublished = status === PUBLISH_STATUS.PUBLISHED;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      title={title || (clickable ? (isPublished ? 'Click to set as Draft' : 'Click to Publish') : '')}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-label-caps uppercase tracking-wider transition-all duration-150 ${
        isPublished
          ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 hover:bg-emerald-500/25'
          : 'bg-amber-500/15 text-amber-700 border border-amber-500/30 hover:bg-amber-500/25'
      } ${clickable ? 'cursor-pointer hover:scale-105 active:scale-95 shadow-sm' : 'cursor-default'}`}
    >
      <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`} />
      {isPublished ? 'Published' : 'Draft'}
      {clickable && (
        <Icon name="sync" size={12} className="opacity-60 hover:opacity-100 ml-0.5" />
      )}
    </button>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
      <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <Icon name={icon} size={28} className="text-on-surface-variant" />
      </div>
      <p className="font-h2 text-[17px] text-on-surface font-semibold mb-1">{title}</p>
      <p className="font-body-md text-[13px] text-on-surface-variant max-w-sm mb-5">{description}</p>
      {action}
    </div>
  );
}

export default function ContentCMSPage() {
  const navigate = useNavigate();
  const {
    courses,
    lessons,
    selectedCourseId,
    coursesLoading,
    lessonsLoading,
    error,
    loadCourses,
    loadLessons,
    createCourse,
    updateCourse,
    updateLesson,
    deleteCourse,
    deleteLesson,
    setSelectedCourse,
  } = useCmsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseStatus, setCourseStatus] = useState('published');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    loadCourses();
    loadLessons(undefined);
  }, [loadCourses, loadLessons]);

  const handleCourseSelect = (courseId) => {
    const next = selectedCourseId === courseId ? null : courseId;
    setSelectedCourse(next);
    loadLessons(next);
  };

  const handleToggleCourseStatus = async (e, course) => {
    e.stopPropagation();
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await updateCourse(course.id, { status: nextStatus });
    } catch (err) {
      alert(err.message || 'Failed to update course status');
    }
  };

  const handleToggleLessonStatus = async (e, lesson) => {
    e.stopPropagation();
    const nextStatus = lesson.status === 'published' ? 'draft' : 'published';
    try {
      await updateLesson(lesson.id, { status: nextStatus });
    } catch (err) {
      alert(err.message || 'Failed to update lesson status');
    }
  };

  const handleEditCourseClick = (e, course) => {
    e.stopPropagation();
    setEditingCourseId(course.id);
    setCourseTitle(course.title || '');
    setCourseDesc(course.description || '');
    setCourseStatus(course.status || 'published');
    setShowCourseForm(true);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await deleteLesson(lessonId);
    } catch {
      // handled in store
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Delete this course and all its lessons?')) return;
    try {
      await deleteCourse(courseId);
      if (selectedCourseId === courseId) loadLessons(undefined);
    } catch {
      // handled in store
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    setSaving(true);
    setFormError(null);
    try {
      if (editingCourseId) {
        await updateCourse(editingCourseId, {
          title: courseTitle.trim(),
          description: courseDesc.trim() || null,
          status: courseStatus,
        });
      } else {
        await createCourse({
          title: courseTitle.trim(),
          description: courseDesc.trim() || null,
          status: courseStatus,
        });
      }
      setCourseTitle('');
      setCourseDesc('');
      setCourseStatus('published');
      setEditingCourseId(null);
      setShowCourseForm(false);
    } catch (err) {
      setFormError(err.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const { sidebarCollapsed } = useUiStore();

  const filteredLessons = lessons.filter((l) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );


  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col w-full min-w-0 bg-background relative overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >

        {/* Header - Aligned at h-16 matching sidebar header */}
        <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm z-10 w-full h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-h1 font-bold text-primary tracking-tight text-[18px]">
              Content CMS
            </h2>
          </div>
          <button
            id="cms-new-lesson-btn"
            onClick={() => navigate('/admin/cms/lessons/new')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-label-caps text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Icon name="add" size={16} />
            New Lesson
          </button>
        </header>

        {/* Content Body - Responsive fluid width */}
        <div className="flex-1 overflow-y-auto px-8 py-6 w-full pb-24">

          {/* Page heading */}
          <div className="mb-6">
            <h1 className="font-h1 text-[26px] font-bold text-primary mb-1">Content Management</h1>
            <p className="font-body-md text-[14px] text-on-surface-variant">
              Manage courses and lessons. Click any status badge to switch between Published and Draft.
            </p>
          </div>

          {(error || formError) && (
            <div className="mb-6 bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 text-[13px] flex items-center gap-2">
              <Icon name="error" size={18} />
              {formError || error}
            </div>
          )}

          {/* ── Courses Section ─────────────────────────────────────────── */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <h2 className="font-h2 text-[17px] font-bold text-on-surface flex items-center gap-2">
                  <Icon name="library_books" size={20} className="text-primary" />
                  Courses
                </h2>
                <span className="text-[12px] font-medium bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
                  {courses.length}
                </span>
              </div>
              <button
                id="cms-new-course-btn"
                onClick={() => {
                  setEditingCourseId(null);
                  setCourseTitle('');
                  setCourseDesc('');
                  setCourseStatus('published');
                  setShowCourseForm((v) => !v);
                  setFormError(null);
                }}
                className="flex items-center gap-1.5 text-primary hover:bg-surface-container px-3 py-1.5 rounded-lg transition-colors font-label-caps text-[13px] font-semibold"
              >
                <Icon name={showCourseForm && !editingCourseId ? 'close' : 'add_circle'} size={18} />
                {showCourseForm && !editingCourseId ? 'Cancel' : 'New Course'}
              </button>
            </div>

            {/* Inline course create / edit form */}
            {showCourseForm && (
              <form
                onSubmit={handleSaveCourse}
                className="mb-5 bg-surface-container-lowest border-2 border-primary/30 rounded-xl p-5 shadow-level-1 animate-fade-in-up"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-label-caps text-[12px] text-primary font-bold uppercase tracking-wider">
                    {editingCourseId ? 'Edit Course' : 'Create New Course'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-on-surface-variant">Status:</span>
                    <select
                      value={courseStatus}
                      onChange={(e) => setCourseStatus(e.target.value)}
                      className="bg-surface border border-outline-variant text-[12px] font-bold rounded-lg px-2.5 py-1 text-primary focus:outline-none focus:border-primary"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <input
                    id="new-course-title"
                    type="text"
                    placeholder="Course title *"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                    required
                    autoFocus
                  />
                  <input
                    id="new-course-desc"
                    type="text"
                    placeholder="Description (optional)"
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-[14px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors"
                  />
                  <div className="flex gap-3 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCourseForm(false);
                        setEditingCourseId(null);
                        setFormError(null);
                      }}
                      className="px-4 py-2 text-[13px] font-medium text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm"
                    >
                      {saving ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving…
                        </>
                      ) : (
                        editingCourseId ? 'Update Course' : 'Create Course'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Course cards grid */}
            {coursesLoading && courses.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-surface-container animate-pulse rounded-xl" />
                ))}
              </div>
            ) : courses.length === 0 && !showCourseForm ? (
              <EmptyState
                icon="library_books"
                title="No courses yet"
                description="Create your first course to start adding lessons."
                action={
                  <button
                    onClick={() => setShowCourseForm(true)}
                    className="px-5 py-2.5 bg-primary text-white text-[13px] font-semibold rounded-full hover:bg-primary/90 transition-colors"
                  >
                    + New Course
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {courses.map((course) => {
                  const isSelected = selectedCourseId === course.id;
                  const lessonCount = course.lessons?.length ?? 0;
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleCourseSelect(course.id)}
                      className={`bg-surface-container-lowest border rounded-xl p-4 shadow-sm cursor-pointer transition-all duration-200 group relative ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.02]'
                          : 'border-outline-variant hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className="font-h2 text-[15px] font-bold text-primary leading-snug line-clamp-2">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleEditCourseClick(e, course)}
                            className="p-1 text-on-surface-variant hover:text-primary transition-all flex-shrink-0"
                            title="Edit course"
                          >
                            <Icon name="edit" size={15} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.id);
                            }}
                            className="p-1 text-on-surface-variant hover:text-error transition-all flex-shrink-0"
                            title="Delete course"
                          >
                            <Icon name="delete" size={15} />
                          </button>
                        </div>
                      </div>
                      {course.description && (
                        <p className="text-[13px] text-on-surface-variant line-clamp-2 mb-3">
                          {course.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40 text-[12px]">
                        <StatusBadge
                          status={course.status}
                          clickable={true}
                          onClick={(e) => handleToggleCourseStatus(e, course)}
                        />
                        <span className="text-on-surface-variant font-medium">
                          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ── Lessons Section ─────────────────────────────────────────── */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2">
                <h2 className="font-h2 text-[17px] font-bold text-on-surface flex items-center gap-2">
                  <Icon name="menu_book" size={20} className="text-primary" />
                  Lessons
                </h2>
                {selectedCourseId && (
                  <span className="text-[13px] font-normal text-on-surface-variant flex items-center gap-1">
                    in <strong className="text-primary">{courses.find((c) => c.id === selectedCourseId)?.title || ''}</strong>
                  </span>
                )}
                <span className="text-[12px] font-medium bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">
                  {filteredLessons.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedCourseId && (
                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      loadLessons(undefined);
                    }}
                    className="text-[12px] text-primary hover:underline font-medium px-1"
                  >
                    Clear course filter
                  </button>
                )}
                {/* Search input */}
                <div className="relative">
                  <Icon
                    name="search"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  />
                  <input
                    id="lesson-search"
                    type="text"
                    placeholder="Search lessons…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-[13px] text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors w-52"
                  />
                </div>
              </div>
            </div>

            {/* Lessons table */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container/40 border-b border-outline-variant">
                      <th className="px-5 py-3 font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        Title
                      </th>
                      <th className="px-5 py-3 font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold hidden sm:table-cell">
                        Course
                      </th>
                      <th className="px-5 py-3 font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        Status (Click to toggle)
                      </th>
                      <th className="px-5 py-3 font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold hidden md:table-cell">
                        Author
                      </th>
                      <th className="px-5 py-3 font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/50">
                    {lessonsLoading && filteredLessons.length === 0 ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i}>
                          {[1, 2, 3, 4, 5].map((c) => (
                            <td key={c} className="px-5 py-4">
                              <div className="h-3 bg-surface-container animate-pulse rounded w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filteredLessons.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Icon name="menu_book" size={32} className="text-on-surface-variant/40" />
                            <p className="text-[14px] text-on-surface-variant font-medium">
                              {searchQuery
                                ? 'No lessons match your search query.'
                                : 'No lessons found for this course.'}
                            </p>
                            <button
                              onClick={() => navigate('/admin/cms/lessons/new')}
                              className="mt-2 px-4 py-1.5 bg-primary text-white text-[12px] font-semibold rounded-full hover:bg-primary/90 transition-colors"
                            >
                              + Create Lesson
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredLessons.map((lesson) => {
                        const course = courses.find((c) => c.id === lesson.course_id);
                        const date = lesson.updated_at
                          ? new Date(lesson.updated_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: '2-digit',
                            })
                          : '—';
                        return (
                          <tr
                            key={lesson.id}
                            className="hover:bg-surface-container/40 transition-colors group"
                          >
                            <td className="px-5 py-3.5">
                              <p className="font-body-md text-[14px] font-semibold text-primary line-clamp-1">
                                {lesson.title}
                              </p>
                              <p className="text-[11px] text-on-surface-variant mt-0.5">{date}</p>
                            </td>
                            <td className="px-5 py-3.5 hidden sm:table-cell">
                              <span className="text-[13px] text-on-surface-variant font-medium">
                                {course?.title ?? '—'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <StatusBadge
                                status={lesson.status}
                                clickable={true}
                                onClick={(e) => handleToggleLessonStatus(e, lesson)}
                              />
                            </td>
                            <td className="px-5 py-3.5 hidden md:table-cell">
                              <span className="text-[13px] text-on-surface-variant">
                                {lesson.author_name ?? '—'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  id={`edit-lesson-${lesson.id}`}
                                  onClick={() => navigate(`/admin/cms/lessons/${lesson.id}/edit`)}
                                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors"
                                  title="Edit"
                                >
                                  <Icon name="edit" size={16} />
                                </button>
                                <button
                                  id={`delete-lesson-${lesson.id}`}
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-md transition-colors"
                                  title="Delete"
                                >
                                  <Icon name="delete" size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
