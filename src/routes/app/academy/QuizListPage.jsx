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
    <div className="flex h-screen overflow-hidden antialiased bg-[#fafbfc] font-sans">
      <AppSidebar variant="academy" />

      <div
        className={`flex-1 flex flex-col bg-[#fafbfc] transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <Topbar variant="academy" />

        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-10 w-full pb-24 max-w-[1200px] mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.12em] mb-1.5">
                MOCK TESTS & QUIZZES
              </p>
              <h1 className="text-[28px] md:text-[34px] font-bold text-gray-950 mb-2 tracking-tight">
                Test Your Knowledge
              </h1>
              <p className="text-gray-600 text-[14.5px] max-w-xl leading-relaxed">
                Attempt quizzes to earn XP, build your streak, and track your mastery across legal topics and landmark cases.
              </p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white border border-gray-200/90 text-[12.5px] font-semibold shadow-2xs">
                <Icon name="check_circle" size={16} className="text-[#0b57d0]" />
                <span>
                  {Object.values(progressMap).filter((p) => p.passed).length} passed
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white border border-gray-200/90 text-[12.5px] font-semibold shadow-2xs">
                <Icon name="local_fire_department" size={16} className="text-amber-500" />
                <span>
                  {Object.keys(progressMap).length} completed
                </span>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse h-48 bg-white border border-gray-200/90 rounded-sm p-6" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-sm px-5 py-4 flex items-center gap-2 text-[14px]">
              <Icon name="error" size={18} />
              {error}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center bg-white border border-gray-200/90 rounded-sm p-8">
              <Icon name="quiz" size={44} className="text-gray-400 mb-3" />
              <p className="text-[17px] font-bold text-gray-900">No quizzes published yet</p>
              <p className="text-[13.5px] text-gray-500 mt-1">
                Check back soon — new mock tests are on the way.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => {
                const progress = progressMap[quiz.id];
                const completed = Boolean(progress);
                return (
                  <div
                    key={quiz.id}
                    className="bg-white border border-gray-200/90 rounded-sm p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-gray-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-[#0b57d0] uppercase tracking-wider bg-[#eaf1fc] px-2.5 py-1 rounded-sm">
                          {quiz.topic_name || 'Mock Test'}
                        </span>
                        {completed ? (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Icon name="check_circle" size={13} />
                            {progress.passed ? 'Passed' : 'Completed'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                            {DIFFICULTY_LABEL[quiz.difficulty] || quiz.difficulty}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/academy/quiz/${quiz.id}`)}
                        className="text-left w-full cursor-pointer"
                      >
                        <h3 className="text-[18px] font-bold text-gray-950 leading-snug group-hover:text-[#0b57d0] transition-colors">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="text-[13.5px] text-gray-600 leading-relaxed line-clamp-2 mt-2">
                            {quiz.description}
                          </p>
                        )}
                      </button>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
                      <div className="flex items-center gap-5 text-gray-500 text-[13px]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Icon name="quiz" size={16} />
                          {quiz.questions?.length ?? 0} Questions
                        </span>
                        <span className="flex items-center gap-1.5 font-medium text-amber-600">
                          <Icon name="diamond" size={16} />
                          +{quiz.xp_per_question} XP / correct
                        </span>
                      </div>

                      {completed && (
                        <div className="flex items-center gap-4 bg-gray-50 rounded-sm px-3.5 py-2 text-[12px] font-semibold text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Icon name="replay" size={15} className="text-[#0b57d0]" />
                            {progress.attempts_count} {progress.attempts_count === 1 ? 'attempt' : 'attempts'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Icon name="check_circle" size={15} className={progress.passed ? 'text-emerald-600' : 'text-gray-400'} />
                            Best {progress.best_accuracy_pct}%
                          </span>
                          <span className="flex items-center gap-1.5 ml-auto text-amber-600">
                            <Icon name="diamond" size={15} />
                            {progress.best_score} pts
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => navigate(`/academy/quiz/${quiz.id}`)}
                        className="w-full py-2.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-[13px] tracking-wider uppercase rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Icon name={completed ? 'replay' : 'play_arrow'} size={16} />
                        <span>{completed ? 'Re-take Test' : 'Start Test'}</span>
                      </button>
                    </div>
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