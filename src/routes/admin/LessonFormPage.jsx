import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Icon from '../../components/ui/Icon';
import { useCmsStore } from '../../stores/cmsStore';
import { useAuth } from '../../hooks/useAuth';
import { fetchLessonApi } from '../../lib/api/academy';
import { useUiStore } from '../../stores/uiStore';


// ── Mini rich-text toolbar ────────────────────────────────────────────────────

const TOOLBAR_ACTIONS = [
  { cmd: 'bold',          icon: 'format_bold',          title: 'Bold (Ctrl+B)' },
  { cmd: 'italic',        icon: 'format_italic',        title: 'Italic (Ctrl+I)' },
  { cmd: 'underline',     icon: 'format_underlined',    title: 'Underline (Ctrl+U)' },
  { cmd: 'insertUnorderedList', icon: 'format_list_bulleted', title: 'Bullet list' },
  { cmd: 'insertOrderedList',   icon: 'format_list_numbered', title: 'Numbered list' },
];

function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const initialized = useRef(false);

  // Initialise from value on first render only
  useEffect(() => {
    if (editorRef.current && !initialized.current && value) {
      editorRef.current.innerHTML = value;
      initialized.current = true;
    }
  }, [value]);

  const execCmd = useCallback((cmd) => {
    document.execCommand(cmd, false, null);
    editorRef.current?.focus();
    if (onChange) onChange(editorRef.current?.innerHTML ?? '');
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (onChange) onChange(editorRef.current?.innerHTML ?? '');
  }, [onChange]);

  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden focus-within:border-primary transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 bg-surface border-b border-outline-variant flex-wrap">
        {TOOLBAR_ACTIONS.map(({ cmd, icon, title }) => (
          <button
            key={cmd}
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
            className="p-1.5 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Icon name={icon} size={18} />
          </button>
        ))}
        <div className="w-px h-5 bg-outline-variant mx-1" />
        <button
          type="button"
          title="Clear formatting"
          onMouseDown={(e) => { e.preventDefault(); execCmd('removeFormat'); }}
          className="p-1.5 rounded-md text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
        >
          <Icon name="format_clear" size={18} />
        </button>
      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        id="lesson-content-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[320px] max-h-[480px] overflow-y-auto px-5 py-4 font-body-md text-on-surface focus:outline-none prose-sm leading-relaxed"
        style={{ whiteSpace: 'pre-wrap' }}
        data-placeholder="Write the lesson content here…"
      />
    </div>
  );
}

// ── Main Form Page ────────────────────────────────────────────────────────────

export default function LessonFormPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const isEdit = Boolean(lessonId);

  const { user } = useAuth();
  const { courses, loadCourses, createLesson, updateLesson } = useCmsStore();
  const { sidebarCollapsed } = useUiStore();

  const [form, setForm] = useState({
    title:       '',
    content:     '',
    course_id:   '',
    status:      'draft',
    author_name: '',
  });
  const [loadingLesson, setLoadingLesson] = useState(isEdit);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState(null);

  // Load courses for the dropdown
  useEffect(() => { loadCourses(); }, [loadCourses]);

  // Auto-fill author from current user
  useEffect(() => {
    if (user?.full_name && !isEdit) {
      setForm((prev) => ({ ...prev, author_name: user.full_name }));
    }
  }, [user, isEdit]);

  // Load existing lesson when editing
  useEffect(() => {
    if (!isEdit) return;
    setLoadingLesson(true);
    fetchLessonApi(lessonId)
      .then((lesson) =>
        setForm({
          title:       lesson.title ?? '',
          content:     lesson.content ?? '',
          course_id:   lesson.course_id ?? '',
          status:      lesson.status ?? 'draft',
          author_name: lesson.author_name ?? '',
        }),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoadingLesson(false));
  }, [isEdit, lessonId]);

  const handleField = (field, val) => setForm((prev) => ({ ...prev, [field]: val }));

  const handleSave = async (statusOverride) => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.course_id)    { setError('Please select a course.'); return; }
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        course_id: Number(form.course_id),
        status: statusOverride ?? form.status,
        author_name: form.author_name || user?.full_name || null,
      };
      if (isEdit) {
        await updateLesson(Number(lessonId), payload);
      } else {
        await createLesson(payload);
      }
      navigate('/admin/cms');
    } catch (err) {
      setError(err.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingLesson) {
    return (
      <div className="bg-background flex h-screen w-full">
        <AdminSidebar />
        <main 
          className={`flex-1 flex items-center justify-center transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-body-md text-on-surface-variant">Loading lesson…</p>
          </div>
        </main>
      </div>
    );
  }

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
            <button
              onClick={() => navigate('/admin/cms')}
              className="p-1.5 rounded-sm text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Back to CMS"
            >
              <Icon name="arrow_back" size={20} />
            </button>
            <h2 className="text-[18px] font-bold text-gray-950 tracking-tight">
              {isEdit ? 'Edit Lesson' : 'New Lesson'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="lesson-save-draft-btn"
              type="button"
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-4 py-2 font-label-caps text-[12.5px] font-bold tracking-wider uppercase border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 cursor-pointer"
            >
              Save Draft
            </button>
            <button
              id="lesson-publish-btn"
              type="button"
              onClick={() => handleSave('published')}
              disabled={saving}
              className="px-6 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-label-caps text-[12.5px] font-bold tracking-wider uppercase rounded-sm transition-colors disabled:opacity-60 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Icon name="publish" size={16} />
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 w-full max-w-4xl pb-24 bg-[#fafbfc]">

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-sm px-4 py-3 text-[13px] flex items-center gap-2">
              <Icon name="error" size={18} />
              {error}
            </div>
          )}

          <div className="bg-white border border-gray-200/90 rounded-sm p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-6">
            {/* Status indicator strip */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  form.status === 'published'
                    ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-700 border border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${form.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                {form.status === 'published' ? 'Published' : 'Draft'}
              </span>
              <button
                type="button"
                onClick={() => handleField('status', form.status === 'published' ? 'draft' : 'published')}
                className="text-[12px] text-[#0b57d0] hover:underline font-bold cursor-pointer"
              >
                Toggle Status
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Lesson Title *
              </label>
              <input
                id="lesson-title-input"
                type="text"
                placeholder="e.g. Fundamental Rights under Article 21"
                value={form.title}
                onChange={(e) => handleField('title', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-sm px-4 py-3 text-[20px] font-bold text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors shadow-2xs"
              />
            </div>

            {/* Metadata row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Course selector */}
              <div>
                <label htmlFor="lesson-course-select" className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Course Assignment *
                </label>
                <select
                  id="lesson-course-select"
                  value={form.course_id}
                  onChange={(e) => handleField('course_id', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-sm px-3.5 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#0b57d0] transition-colors"
                >
                  <option value="">Select a course…</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div>
                <label htmlFor="lesson-author-input" className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Author / Instructor
                </label>
                <input
                  id="lesson-author-input"
                  type="text"
                  placeholder="Author name"
                  value={form.author_name}
                  onChange={(e) => handleField('author_name', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-sm px-3.5 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0b57d0] transition-colors"
                />
              </div>
            </div>

            {/* Rich content editor */}
            <div>
              <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Lesson Content (HTML / Rich Text)
              </label>
              <RichEditor
                value={form.content}
                onChange={(html) => handleField('content', html)}
              />
              <p className="mt-2 text-[12px] text-gray-500">
                Format your lesson with headings, bold text, lists, and landmark case notes.
              </p>
            </div>

            {/* Bottom action strip */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/admin/cms')}
                className="text-gray-600 hover:text-[#0b57d0] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                ← Back to CMS
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="px-4 py-2 text-[12.5px] font-bold tracking-wider uppercase border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="px-6 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white text-[12.5px] font-bold tracking-wider uppercase rounded-sm transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                >
                  Publish Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
