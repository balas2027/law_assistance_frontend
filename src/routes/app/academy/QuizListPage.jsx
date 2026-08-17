import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import Icon from '../../../components/ui/Icon';
import { fetchQuizzesApi, fetchUserQuizProgressApi } from '../../../lib/api/quiz';
import { useUiStore } from '../../../stores/uiStore';

const DIFFICULTY_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

export default function QuizListPage() {
  const navigate = useNavigate();
  const { sidebarCollapsed } = useUiStore();
  const [quizzes, setQuizzes] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchQuizzesApi(), fetchUserQuizProgressApi()])
      .then(([quizList, progress]) => {
        setQuizzes(quizList);
        setProgressMap(Object.fromEntries(progress.map((p) => [p.quiz_id, p])));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-background">
      <AppSidebar variant="academy" />

      <div
        className={`flex-1 flex flex-col bg-background transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <Topbar variant="academy" />

        <main className="flex-1 overflow-y-auto px-8 py-6 w-full pb-20 max-w-[1200px] mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary-container/20 text-primary mb-3">
                <Icon name="quiz" size={14} />
                Mock Tests
              </span>
              <h1 className="font-h1 text-[26px] md:text-[30px] font-bold text-primary mb-1 tracking-tight">
                Test Your Knowledge
              </h1>
              <p className="text-on-surface-variant text-[14px] max-w-xl leading-relaxed">
                Attempt quizzes to earn XP, build your streak, and track your mastery across legal topics.
              </p>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant">
                <Icon name="check_circle" size={15} className="text-tertiary-container" />
                <span className="font-label-caps text-label-caps font-bold">
                  {Object.values(progressMap).filter((p) => p.passed).length} passed
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant">
                <Icon name="local_fire_department" size={15} className="text-secondary-container" />
                <span className="font-label-caps text-label-caps font-bold">
                  {Object.keys(progressMap).length} completed
                </span>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse h-44 bg-surface-container rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-error/10 border border-error/30 text-error rounded-xl px-5 py-4 flex items-center gap-2">
              <Icon name="error" size={18} />
              {error}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center bg-surface-container-lowest border border-outline-variant rounded-xl">
              <Icon name="quiz" size={48} className="text-on-surface-variant/30 mb-4" />
              <p className="font-h2 text-[18px] text-on-surface-variant">No quizzes published yet</p>
              <p className="font-body-md text-on-surface-variant/60 mt-1">
                Check back soon — new mock tests are on the way.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => {
                const progress = progressMap[quiz.id];
                const completed = Boolean(progress);
                return (
                  <div
                    key={quiz.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-level-1 transition-all flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                        {quiz.topic_name || 'Mock Test'}
                      </span>
                      {completed ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-tertiary-container/20 text-tertiary-container">
                          <Icon name="check_circle" size={13} />
                          {progress.passed ? 'Passed' : 'Completed'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-surface-container-high text-on-surface-variant">
                          {DIFFICULTY_LABEL[quiz.difficulty] || quiz.difficulty}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/academy/quiz/${quiz.id}`)}
                      className="text-left"
                    >
                      <h3 className="font-h2 text-[17px] font-bold text-primary leading-snug hover:text-secondary transition-colors">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="font-body-md text-[13px] text-on-surface-variant leading-relaxed line-clamp-2 mt-1">
                          {quiz.description}
                        </p>
                      )}
                    </button>

                    <div className="flex items-center gap-5 mt-auto pt-2 text-on-surface-variant">
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold">
                        <Icon name="quiz" size={15} />
                        {quiz.questions?.length ?? 0} Questions
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] font-semibold">
                        <Icon name="diamond" size={15} className="text-secondary-container" />
                        +{quiz.xp_per_question} XP / correct
                      </span>
                    </div>

                    {completed && (
                      <div className="flex items-center gap-5 bg-surface-container rounded-lg px-3 py-2 text-[12px] font-semibold text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                          <Icon name="replay" size={15} className="text-primary" />
                          {progress.attempts_count} {progress.attempts_count === 1 ? 'attempt' : 'attempts'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Icon name="check_circle" size={15} className={progress.passed ? 'text-tertiary-container' : 'text-on-surface-variant'} />
                          Best {progress.best_accuracy_pct}%
                        </span>
                        <span className="flex items-center gap-1.5 ml-auto">
                          <Icon name="diamond" size={15} className="text-secondary-container" />
                          {progress.best_score} pts
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/academy/quiz/${quiz.id}`)}
                      className={`w-full py-2.5 font-bold text-[13px] rounded-xl transition-all flex items-center justify-center gap-2 ${
                        completed
                          ? 'bg-surface-container-high text-primary hover:bg-primary hover:text-white'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      <Icon name={completed ? 'replay' : 'play_arrow'} size={16} />
                      {completed ? 'Re-take Test' : 'Start Test'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}