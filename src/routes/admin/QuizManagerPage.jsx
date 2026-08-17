import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
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

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <header className="bg-surface-container-lowest text-primary border-b border-outline-variant shadow-sm flex justify-between items-center w-full px-gutter h-16 sticky z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-on-surface-variant">
              <Icon name="menu" size={24} />
            </button>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Quiz Builder
              </span>
              <h2 className="font-h2 text-h2 font-bold text-primary md:text-[24px]">Manage Quizzes</h2>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin/quiz-builder/new')}
            className="bg-saffron text-on-primary font-label-caps text-label-caps px-5 py-2 rounded-full font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <Icon name="add" size={18} />
            New Quiz
          </button>
        </header>

        <main className="flex-1 p-margin-mobile md:p-gutter max-w-[1200px] w-full mx-auto overflow-y-auto">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-outline-variant">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 font-label-caps text-label-caps font-bold border-b-2 -mb-px transition-colors ${
                  tab === t.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                {t.label}
                <span className="ml-1.5 text-[11px] bg-surface-container-high rounded-full px-1.5 py-0.5">
                  {t.key === 'all' ? quizzes.length : t.key === 'published' ? publishedCount : draftCount}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="animate-pulse h-44 bg-surface-container rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-error/10 border border-error/30 text-error rounded-xl px-5 py-4 flex items-center gap-2">
              <Icon name="error" size={18} />
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center bg-surface-container-lowest border border-outline-variant rounded-xl">
              <Icon name="quiz" size={48} className="text-on-surface-variant/30 mb-4" />
              <p className="font-h2 text-[18px] text-on-surface-variant">
                {tab === 'draft' ? 'No draft quizzes' : tab === 'published' ? 'No published quizzes' : 'No quizzes yet'}
              </p>
              <p className="font-body-md text-on-surface-variant/60 mt-1 mb-5">
                Create your first quiz to start publishing mock tests.
              </p>
              <button
                onClick={() => navigate('/admin/quiz-builder/new')}
                className="bg-primary text-white font-label-caps text-label-caps px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-1.5"
              >
                <Icon name="add" size={18} />
                Create Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onEdit={(id) => navigate(`/admin/quiz-builder/${id}`)}
                  onTogglePublish={togglePublish}
                  busy={busyId === quiz.id}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}