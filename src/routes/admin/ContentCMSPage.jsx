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
        <header className="bg-white border-b border-gray-200/90 shadow-xs z-10 w-full h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0b57d0] text-white flex items-center justify-center font-bold shadow-xs">
              <Icon name="edit_note" size={20} />
            </div>
            <h2 className="text-[18px] font-bold text-gray-950 tracking-tight">
              Content CMS
            </h2>
          </div>
          <button
            id="cms-new-lesson-btn"
            onClick={() => navigate('/admin/cms/lessons/new')}
            className="flex items-center gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white px-4 py-2 rounded-sm text-[13px] font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
          >
            <Icon name="add" size={16} />
            <span>New Lesson</span>
          </button>
        </header>

        {/* Content Body - Responsive fluid width */}
        <div className="flex-1 overflow-y-auto px-8 py-8 w-full pb-24 bg-[#fafbfc]">

          {/* Page heading */}
          <div className="mb-6">
            <p className="text-[12px] font-bold text-gray-500 tracking-[0.12em] uppercase mb-1.5">
              CURRICULUM MANAGEMENT
            </p>
            <h1 className="text-[28px] md:text-[32px] font-bold text-gray-950 tracking-tight mb-1">
              Courses & Lessons CMS
            </h1>
            <p className="text-[14px] text-gray-600">
              Manage courses and interactive lessons. Toggle between Published and Draft with a single click.
            </p>
          </div>

          {(error || formError) && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-sm px-4 py-3 text-[13px] flex items-center gap-2">
              <Icon name="error" size={18} />
              {formError || error}
            </div>
          )}

          {/* ── Courses Section ─────────────────────────────────────────── */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[17px] font-bold text-gray-950 flex items-center gap-2">
                  <Icon name="library_books" size={20} className="text-[#0b57d0]" />
                  Courses
                </h2>
                <span className="text-[12px] font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
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
                className="flex items-center gap-1.5 text-[#0b57d0] hover:bg-[#eaf1fc] px-3 py-1.5 rounded-sm transition-colors text-[13px] font-bold tracking-wider uppercase cursor-pointer"
              >
                <Icon name={showCourseForm && !editingCourseId ? 'close' : 'add_circle'} size={18} />
                <span>{showCourseForm && !editingCourseId ? 'Cancel' : 'New Course'}</span>
              </button>
            </div>

            {/* Inline course create / edit form */}
            {showCourseForm && (
              <form
                onSubmit={handleSaveCourse}
                className="mb-6 bg-white border-2 border-[#0b57d0] rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] animate-fade-in-up"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[12px] text-[#0b57d0] font-bold uppercase tracking-wider">
                    {editingCourseId ? 'Edit Course' : 'Create New Course'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Status:</span>
                    <select
                      value={courseStatus}
                      onChange={(e) => setCourseStatus(e.target.value)}
                      className="bg-white border border-gray-300 text-[12.5px] font-bold rounded-sm px-3 py-1.5 text-gray-900 focus:outline-none focus:border-[#0b57d0]"
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
                    className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors"
                    required
                    autoFocus
                  />
                  <input
                    id="new-course-desc"
                    type="text"
                    placeholder="Description (optional)"
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-sm px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors"
                  />
                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCourseForm(false);
                        setEditingCourseId(null);
                        setFormError(null);
                      }}
                      className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 rounded-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white text-[13px] font-bold tracking-wider uppercase rounded-sm transition-colors disabled:opacity-60 flex items-center gap-2 shadow-xs cursor-pointer"
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
                  <div key={i} className="h-28 bg-white border border-gray-200/90 animate-pulse rounded-sm" />
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
                    className="px-6 py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white text-[13px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
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
                      className={`bg-white border rounded-sm p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer transition-all duration-200 group relative ${
                        isSelected
                          ? 'border-2 border-[#0b57d0] bg-[#fafbfc]'
                          : 'border-gray-200/90 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-[15px] font-bold text-gray-950 leading-snug line-clamp-2 group-hover:text-[#0b57d0] transition-colors">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={(e) => handleEditCourseClick(e, course)}
                            className="p-1 text-gray-400 hover:text-[#0b57d0] transition-all cursor-pointer"
                            title="Edit course"
                          >
                            <Icon name="edit" size={15} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-all cursor-pointer"
                            title="Delete course"
                          >
                            <Icon name="delete" size={15} />
                          </button>
                        </div>
                      </div>
                      {course.description && (
                        <p className="text-[13px] text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          {course.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[12px]">
                        <StatusBadge
                          status={course.status}
                          clickable={true}
                          onClick={(e) => handleToggleCourseStatus(e, course)}
                        />
                        <span className="text-gray-500 font-semibold">
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
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[17px] font-bold text-gray-950 flex items-center gap-2">
                  <Icon name="menu_book" size={20} className="text-[#0b57d0]" />
                  Lessons
                </h2>
                {selectedCourseId && (
                  <span className="text-[13px] font-normal text-gray-500 flex items-center gap-1">
                    in <strong className="text-gray-900 font-bold">{courses.find((c) => c.id === selectedCourseId)?.title || ''}</strong>
                  </span>
                )}
                <span className="text-[12px] font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
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
                    className="text-[12px] text-[#0b57d0] hover:underline font-bold px-1 cursor-pointer"
                  >
                    Clear course filter
                  </button>
                )}
                {/* Search input */}
                <div className="relative">
                  <Icon
                    name="search"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="lesson-search"
                    type="text"
                    placeholder="Search lessons…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-white border border-gray-300 rounded-sm text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors w-56 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Lessons table */}
            <div className="bg-white border border-gray-200/90 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fafbfc] border-b border-gray-200/80">
                      <th className="px-6 py-3.5 text-[11px] text-gray-500 uppercase tracking-wider font-bold">
                        Title
                      </th>
                      <th className="px-6 py-3.5 text-[11px] text-gray-500 uppercase tracking-wider font-bold hidden sm:table-cell">
                        Course
                      </th>
                      <th className="px-6 py-3.5 text-[11px] text-gray-500 uppercase tracking-wider font-bold">
                        Status (Click to toggle)
                      </th>
                      <th className="px-6 py-3.5 text-[11px] text-gray-500 uppercase tracking-wider font-bold hidden md:table-cell">
                        Author
                      </th>
                      <th className="px-6 py-3.5 text-[11px] text-gray-500 uppercase tracking-wider font-bold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lessonsLoading && filteredLessons.length === 0 ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i}>
                          {[1, 2, 3, 4, 5].map((c) => (
                            <td key={c} className="px-6 py-4">
                              <div className="h-3 bg-gray-100 animate-pulse rounded-sm w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filteredLessons.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-14">
                          <div className="flex flex-col items-center gap-2">
                            <Icon name="menu_book" size={36} className="text-gray-300" />
                            <p className="text-[14.5px] text-gray-700 font-semibold">
                              {searchQuery
                                ? 'No lessons match your search query.'
                                : 'No lessons found for this course.'}
                            </p>
                            <button
                              onClick={() => navigate('/admin/cms/lessons/new')}
                              className="mt-2 px-5 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white text-[12.5px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-xs"
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
                              year: 'numeric',
                            })
                          : '—';
                        return (
                          <tr
                            key={lesson.id}
                            className="hover:bg-gray-50/70 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <p className="text-[14px] font-bold text-gray-950 group-hover:text-[#0b57d0] transition-colors line-clamp-1">
                                {lesson.title}
                              </p>
                              <p className="text-[11.5px] text-gray-500 mt-0.5">{date}</p>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                              <span className="text-[13px] text-gray-700 font-medium">
                                {course?.title ?? '—'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge
                                status={lesson.status}
                                clickable={true}
                                onClick={(e) => handleToggleLessonStatus(e, lesson)}
                              />
                            </td>
                            <td className="px-6 py-4 hidden md:table-cell">
                              <span className="text-[13px] text-gray-600">
                                {lesson.author_name ?? '—'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  id={`edit-lesson-${lesson.id}`}
                                  onClick={() => navigate(`/admin/cms/lessons/${lesson.id}/edit`)}
                                  className="p-1.5 text-gray-500 hover:text-[#0b57d0] hover:bg-[#eaf1fc] rounded-sm transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Icon name="edit" size={16} />
                                </button>
                                <button
                                  id={`delete-lesson-${lesson.id}`}
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors cursor-pointer"
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
