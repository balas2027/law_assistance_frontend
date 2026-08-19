import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Topbar from '../../components/layout/Topbar';
import Icon from '../../components/ui/Icon';
import { useCmsStore } from '../../stores/cmsStore';
import { useUiStore } from '../../stores/uiStore';

// ── Skeleton Card ────────────────────────────────────────────────
function SkeletonCourseCard() {
  return (
    <div className="bg-white border border-gray-200/90 rounded-xl p-6 animate-pulse shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
        <div className="h-5 w-24 bg-gray-200 rounded" />
      </div>
      <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
      <div className="h-px bg-gray-100 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ── Course Card ─────────────────────────────────────────────────
function CourseCard({ course, onEdit, onDelete, onStatusToggle, lessonCount }) {
  const navigate = useNavigate();
  const isPublished = course.status === 'published';

  return (
    <div className="bg-white border border-gray-200/90 p-6 shadow-sm hover:shadow-md hover:border-[#0b57d0]/30 transition-all duration-200 flex flex-col group cursor-pointer"
      onClick={() => navigate(`/admin/cms/courses/${course.id}`)}
    >
      {/* Top: Icon + Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#eaf1fc] flex items-center justify-center shrink-0">
            <Icon name="library_books" size={20} className="text-[#0b57d0]" />
          </div>
          {/* <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
            COURSE
          </span> */}
        </div>

        {/* Action Menu */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => onEdit(e, course)}
            className="w-7 h-7 rounded-lg hover:bg-[#eaf1fc] flex items-center justify-center text-gray-400 hover:text-[#0b57d0] transition-colors cursor-pointer"
            title="Edit Course"
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            onClick={(e) => onDelete(e, course.id)}
            className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
            title="Delete Course"
          >
            <Icon name="delete" size={15} />
          </button>
        </div>
      </div>

      {/* Course Title */}
      <h2 className="text-[17px] font-bold text-gray-950 tracking-tight mb-1.5 group-hover:text-[#0b57d0] transition-colors line-clamp-2 leading-snug">
        {course.title}
      </h2>

      {/* Description */}
      {course.description && (
        <p className="text-[12.5px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
      )}

      <div className="flex-1" />

      {/* Bottom Divider + Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Icon name="check_circle" size={14} className={isPublished ? 'text-emerald-500' : 'text-amber-500'} />
          <span className="text-[12px] font-semibold">
            {lessonCount} {lessonCount === 1 ? 'Lesson' : 'Lessons'}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/admin/cms/courses/${course.id}`); }}
          className="text-[12px] font-bold text-[#0b57d0] hover:text-[#0842a0] flex items-center gap-1 cursor-pointer transition-colors"
        >
          View Lessons
          <Icon name="arrow_forward" size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Course Form Modal ────────────────────────────────────────────
function CourseFormModal({ open, editingCourse, onClose, onSave, saving, error }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('published');

  useEffect(() => {
    if (editingCourse) {
      setTitle(editingCourse.title || '');
      setDesc(editingCourse.description || '');
      setStatus(editingCourse.status || 'published');
    } else {
      setTitle('');
      setDesc('');
      setStatus('published');
    }
  }, [editingCourse, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: desc.trim() || null, status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-gray-200/90 p-8 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-bold text-gray-950 tracking-tight">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {editingCourse ? 'Update course details' : 'Add a new course to the curriculum'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
            <Icon name="close" size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-[13px] flex items-center gap-2">
            <Icon name="error" size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Course Title *
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Constitutional Law Fundamentals"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] focus:bg-white transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of the course..."
              rows={3}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] focus:bg-white transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#0b57d0] cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="px-5 py-2 rounded-lg text-[13px] font-bold bg-[#0b57d0] hover:bg-[#0842a0] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            >
              {saving ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function ContentCMSPage() {
  const navigate = useNavigate();
  const {
    courses,
    lessons,
    coursesLoading,
    error,
    loadCourses,
    loadLessons,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCmsStore();

  const { sidebarCollapsed } = useUiStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    loadCourses();
    loadLessons(undefined);
  }, [loadCourses, loadLessons]);

  // Count lessons per course
  const lessonCountByCourse = (courses || []).reduce((acc, course) => {
    acc[course.id] = (lessons || []).filter((l) => l.course_id === course.id).length;
    return acc;
  }, {});

  const handleEdit = (e, course) => {
    e.stopPropagation();
    setEditingCourse(course);
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async (e, courseId) => {
    e.stopPropagation();
    if (!confirm('Delete this course and all its lessons?')) return;
    try {
      await deleteCourse(courseId);
    } catch { /* handled in store */ }
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError(null);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, payload);
      } else {
        await createCourse(payload);
      }
      setShowModal(false);
      setEditingCourse(null);
    } catch (err) {
      setFormError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const adminAction = (
    <button
      id="cms-new-course-btn"
      onClick={() => { setEditingCourse(null); setFormError(null); setShowModal(true); }}
    >
    </button>
  );

  return (
    <div className="bg-[#fafbfc] text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <Topbar variant="admin" adminTitle="Content CMS" adminAction={adminAction} />
      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col pt-16 h-screen w-full min-w-0 bg-[#fafbfc] relative overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
          }`}
      >
        <div className="flex-1 overflow-y-auto px-8 py-8 pb-24 w-full">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium mb-2">
              <Icon name="library_books" size={14} className="text-gray-400" />
              <span>Content CMS</span>
            </div>
            <h1 className="text-[28px] font-bold text-gray-950 tracking-tight mb-1">
              COURSES
            </h1>
            <p className="text-[13.5px] text-gray-500">
              Select a course to manage its lessons, or create a new course.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-[13px] flex items-center gap-2">
              <Icon name="error" size={18} />
              {error}
            </div>
          )}

          {/* Course Grid */}
          {coursesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCourseCard key={i} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#eaf1fc] flex items-center justify-center mb-5">
                <Icon name="library_books" size={32} className="text-[#0b57d0]" />
              </div>
              <h2 className="text-[20px] font-bold text-gray-900 mb-2">No Courses Yet</h2>
              <p className="text-[14px] text-gray-500 mb-6 max-w-sm">
                Create your first course to start building the curriculum.
              </p>
              <button
                onClick={() => { setEditingCourse(null); setShowModal(true); }}
                className="flex items-center gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white px-6 py-2.5 rounded-lg text-[13.5px] font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Icon name="add" size={18} />
                Create First Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  lessonCount={lessonCountByCourse[course.id] ?? 0}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusToggle={() => { }}
                />
              ))}

              {/* + New Course Card */}
              <button
                onClick={() => { setEditingCourse(null); setFormError(null); setShowModal(true); }}
                className="border-2 border-dashed border-gray-300 hover:border-[#0b57d0] p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-[#0b57d0] hover:bg-[#eaf1fc]/30 transition-all cursor-pointer min-h-[180px] group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="add" size={24} />
                </div>
                <span className="text-[13px] font-bold uppercase tracking-wider">New Course</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Course Form Modal */}
      <CourseFormModal
        open={showModal}
        editingCourse={editingCourse}
        onClose={() => { setShowModal(false); setEditingCourse(null); setFormError(null); }}
        onSave={handleSave}
        saving={saving}
        error={formError}
      />
    </div>
  );
}
