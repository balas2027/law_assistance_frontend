import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import QuizProgressBar from '../../../components/features/academy/QuizProgressBar';
import QuizQuestionCard from '../../../components/features/academy/QuizQuestionCard';
import QuizOptionItem from '../../../components/features/academy/QuizOptionItem';
import LivesIndicator from '../../../components/features/academy/LivesIndicator';
import ReferenceMaterialCard from '../../../components/features/academy/ReferenceMaterialCard';
import Icon from '../../../components/ui/Icon';
import { useQuiz } from '../../../hooks/useQuiz';
import { useAcademyStore } from '../../../stores/academyStore';

export default function QuizPage() {
  const { quizId } = useParams();
  const loadQuiz = useAcademyStore((s) => s.loadQuiz);
  const { quiz, currentIndex, selectedOption, lives, answered, isCorrect, selectQuizOption, checkQuizAnswer, nextQuizQuestion } =
    useQuiz();

  useEffect(() => {
    if (quizId && quizId !== quiz.id) {
      loadQuiz(quizId);
    }
  }, [quizId, quiz.id, loadQuiz]);

  const handleCheck = async () => {
    if (!selectedOption) return;
    await checkQuizAnswer();
  };

  const handleNext = () => {
    nextQuizQuestion();
  };

  const question = quiz.question;

  return (
    <div className="bg-background text-on-background font-body-md flex min-h-screen">
      <AppSidebar variant="curriculum" />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Topbar variant="academy" />
        <main className="flex-1 p-margin-desktop flex gap-gutter max-w-[1200px] mx-auto w-full">
          <div className="flex-1 flex flex-col gap-8">
            <QuizProgressBar total={quiz.totalQuestions} current={currentIndex} />

            <QuizQuestionCard scenario={question.scenario} />

            <div className="flex flex-col gap-4">
              {question.options.map((option) => (
                <QuizOptionItem
                  key={option.id}
                  option={option}
                  selected={selectedOption === option.id}
                  onSelect={selectQuizOption}
                />
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              {answered ? (
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <span className="font-label-caps text-label-caps text-tertiary-container font-bold">Correct! +50 XP</span>
                  ) : (
                    <span className="font-label-caps text-label-caps text-error font-bold">Incorrect — 1 life lost</span>
                  )}
                  <button
                    onClick={handleNext}
                    className="bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest px-8 py-4 rounded-full shadow-level-1 hover:bg-primary transition-all flex items-center gap-2"
                  >
                    Next Question
                    <Icon name="arrow_forward" size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCheck}
                  disabled={!selectedOption}
                  className="bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest px-8 py-4 rounded-full shadow-level-1 hover:bg-primary transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                  <Icon name="arrow_forward" size={18} />
                </button>
              )}
            </div>
          </div>

          <aside className="w-80 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-6 border-b border-outline-variant pb-2">
                Knowledge Check
              </h4>
              <div className="space-y-6">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Attempts Remaining</p>
                  <LivesIndicator lives={lives} maxLives={quiz.maxLives} />
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Current XP Potential</p>
                  <div className="flex items-center gap-2 text-secondary-container font-h2 text-h2">
                    <Icon name="diamond" size={28} fill />
                    +{quiz.xpPotential} XP
                  </div>
                </div>
              </div>
            </div>

            <ReferenceMaterialCard reference={quiz.reference} />
          </aside>
        </main>
      </div>
    </div>
  );
}