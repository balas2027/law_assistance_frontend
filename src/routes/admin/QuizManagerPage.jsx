import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import Topbar from '../../components/layout/Topbar';
import Icon from '../../components/ui/Icon';
import { fetchCmsQuizzesApi, publishQuizApi, unpublishQuizApi } from '../../lib/api/cms';
import { useUiStore } from '../../stores/uiStore';

const TABS = [
  { key: 'all', label: 'All Quizzes' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
];

const DIFFICULTY_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

function QuizCard({ quiz, onEdit, onTogglePublish, busy }) {
  const isPublished = quiz.status === 'published';
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-level-1 transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            isPublished
              ? 'bg-tertiary-container/20 text-tertiary-container'
              : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          {isPublished ? 'Published' : 'Draft'}
        </span>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
          {DIFFICULTY_LABEL[quiz.difficulty] || quiz.difficulty}
        </span>
      </div>

      <button onClick={() => onEdit(quiz.id)} className="text-left group">
        <h3 className="font-h2 text-[17px] font-bold text-primary leading-snug group-hover:text-secondary transition-colors">
          {quiz.title || 'Untitled Quiz'}
        </h3>
        {quiz.description && (
          <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed line-clamp-2 mt-1">
            {quiz.description}
          </p>
        )}
      </button>

      <div className="flex items-center gap-5 mt-auto pt-2 text-on-surface-variant">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold">
          <Icon name="balance" size={15} className="text-primary" />
          {quiz.topic?.name || 'General'}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold">
          <Icon name="quiz" size={15} />
          {quiz.questions?.length ?? 0} Questions
        </span>
        <span className="flex items-center gap-1.5 text-[12px] font-semibold">
          <Icon name="diamond" size={15} className="text-secondary-container" />
          +{quiz.xp_per_question}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/60">
        <button
          onClick={() => onEdit(quiz.id)}
          className="flex-1 py-2 rounded-lg bg-surface-container-high text-primary font-bold text-[13px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <Icon name="edit" size={15} />
          Edit
        </button>
        <button
          onClick={() => onTogglePublish(quiz)}
          disabled={busy}
          className={`flex-1 py-2 rounded-lg font-bold text-[13px] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
            isPublished
              ? 'bg-error/10 text-error hover:bg-error hover:text-white'
              : 'bg-saffron/20 text-saffron hover:bg-saffron hover:text-white'
          }`}
        >
          <Icon name={isPublished ? 'visibility_off' : 'publish'} size={15} />
          {isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </div>
  );
}

export default function QuizManagerPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();
  const addToast = useUiStore((s) => s.addToast);

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      setQuizzes(await fetchCmsQuizzesApi());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const togglePublish = async (quiz) => {
    setBusyId(quiz.id);
    try {
      if (quiz.status === 'published') {
        await unpublishQuizApi(quiz.id);
        addToast(`"${quiz.title}" moved to drafts`, 'info');
      } else {
        await publishQuizApi(quiz.id);
        addToast(`"${quiz.title}" published`, 'success');
      }
      await loadQuizzes();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const filtered = quizzes.filter((q) => tab === 'all' || q.status === tab);
  const publishedCount = quizzes.filter((q) => q.status === 'published').length;
  const draftCount = quizzes.filter((q) => q.status === 'draft').length;

  const adminAction = (
    <button
      onClick={() => navigate('/admin/quiz-builder/new')}
      className="flex items-center gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white px-4 py-1.5 rounded-sm text-[12px] font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
    >
      <Icon name="add" size={16} />
      <span>New Quiz</span>
    </button>
  );

  return (
    <div className="bg-[#fafbfc] text-on-background font-body-md antialiased overflow-hidden flex h-screen w-full">
      <Topbar variant="admin" adminTitle="Manage Quizzes" adminAction={adminAction} />
      <AdminSidebar />

      <main
        className={`flex-1 flex flex-col pt-16 h-screen w-full min-w-0 bg-[#fafbfc] relative overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-8 w-full pb-24 bg-[#fafbfc]">
          {/* Header text */}
          <div className="mb-6">
            <p className="text-[12px] font-bold text-gray-500 tracking-[0.12em] uppercase mb-1.5">
              ASSESSMENT BUILDER
            </p>
            <h1 className="text-[28px] md:text-[32px] font-bold text-gray-950 tracking-tight mb-1">
              Mock Tests & Quizzes
            </h1>
            <p className="text-[14px] text-gray-600">
              Create, edit, and publish scenario-based quizzes for law students and practitioners.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-200/90 pb-px">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-[13.5px] font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                  tab === t.key
                    ? 'border-[#0b57d0] text-[#0b57d0]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.label}
                <span className={`ml-2 text-[11px] font-bold rounded-full px-2 py-0.5 ${
                  tab === t.key ? 'bg-[#eaf1fc] text-[#0b57d0]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {t.key === 'all' ? quizzes.length : t.key === 'published' ? publishedCount : draftCount}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="animate-pulse h-48 bg-white border border-gray-200/90 rounded-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-sm px-5 py-4 flex items-center gap-2 text-[13px]">
              <Icon name="error" size={18} />
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center bg-white border border-gray-200/90 rounded-sm p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <Icon name="quiz" size={44} className="text-gray-300 mb-3" />
              <p className="text-[17px] font-bold text-gray-900 mb-1">
                {tab === 'draft' ? 'No draft quizzes' : tab === 'published' ? 'No published quizzes' : 'No quizzes yet'}
              </p>
              <p className="text-[13.5px] text-gray-500 max-w-sm mb-6">
                Create your first quiz to start publishing mock tests for students.
              </p>
              <button
                onClick={() => navigate('/admin/quiz-builder/new')}
                className="bg-[#0b57d0] hover:bg-[#0842a0] text-white text-[13px] font-bold tracking-wider uppercase px-6 py-2.5 rounded-sm transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Icon name="add" size={18} />
                <span>Create Quiz</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gray-300 transition-all flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        quiz.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 border border-amber-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${quiz.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                      {quiz.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                      {DIFFICULTY_LABEL[quiz.difficulty] || quiz.difficulty}
                    </span>
                  </div>

                  <button onClick={() => navigate(`/admin/quiz-builder/${quiz.id}`)} className="text-left group cursor-pointer">
                    <h3 className="text-[17px] font-bold text-gray-950 leading-snug group-hover:text-[#0b57d0] transition-colors line-clamp-1">
                      {quiz.title || 'Untitled Quiz'}
                    </h3>
                    {quiz.description && (
                      <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-2 mt-1">
                        {quiz.description}
                      </p>
                    )}
                  </button>

                  <div className="flex items-center gap-5 mt-auto pt-2 text-gray-600">
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold">
                      <Icon name="balance" size={15} className="text-[#0b57d0]" />
                      {quiz.topic?.name || 'General'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold">
                      <Icon name="quiz" size={15} className="text-gray-400" />
                      {quiz.questions?.length ?? 0} Questions
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-600">
                      <Icon name="diamond" size={15} />
                      +{quiz.xp_per_question} XP
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/admin/quiz-builder/${quiz.id}`)}
                      className="flex-1 py-2 rounded-sm bg-gray-100 hover:bg-gray-200/80 text-gray-900 font-bold text-[12.5px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="edit" size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => togglePublish(quiz)}
                      disabled={busyId === quiz.id}
                      className={`flex-1 py-2 rounded-sm font-bold text-[12.5px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                        quiz.status === 'published'
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-[#eaf1fc] text-[#0b57d0] hover:bg-[#dce1ff]'
                      }`}
                    >
                      <Icon name={quiz.status === 'published' ? 'visibility_off' : 'publish'} size={15} />
                      <span>{quiz.status === 'published' ? 'Unpublish' : 'Publish'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}