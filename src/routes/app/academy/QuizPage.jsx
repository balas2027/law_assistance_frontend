import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppSidebar from '../../../components/layout/AppSidebar';
import Topbar from '../../../components/layout/Topbar';
import Icon from '../../../components/ui/Icon';
import {
  fetchQuizApi,
  startAttemptApi,
  submitAnswerApi,
  completeAttemptApi,
} from '../../../lib/api/quiz';
import { useUiStore } from '../../../stores/uiStore';


// ── Progress bar ──────────────────────────────────────────────────────────────
function QuizProgressBar({ total, current }) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-label-caps text-label-caps text-on-surface-variant shrink-0">
        {current + 1} / {total}
      </span>
    </div>
  );
}

// ── Option item ───────────────────────────────────────────────────────────────
function QuizOption({ option, selected, answered, isCorrectForOption, onSelect }) {
  const isSelected  = selected === option.id;
  const showCorrect = answered && isCorrectForOption;
  const showWrong   = answered && isSelected && !isCorrectForOption;

  return (
    <button
      id={`quiz-option-${option.id}`}
      onClick={() => !answered && onSelect(option.id)}
      disabled={answered}
      className={`w-full text-left border rounded-xl p-5 flex items-start gap-4 transition-all duration-200 ${
        showCorrect
          ? 'border-tertiary-container bg-tertiary-container/10'
          : showWrong
          ? 'border-error bg-error/10'
          : isSelected
          ? 'border-primary bg-surface-container-high shadow-level-1'
          : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50 hover:shadow-level-1'
      } disabled:cursor-default`}
    >
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm border-2 ${
          showCorrect
            ? 'border-tertiary-container bg-tertiary-container text-on-tertiary'
            : showWrong
            ? 'border-error bg-error text-white'
            : isSelected
            ? 'border-primary bg-primary text-white'
            : 'border-outline-variant text-on-surface-variant'
        }`}
      >
        {option.option_key}
      </div>
      <p className="font-body-md text-on-surface leading-relaxed pt-0.5">{option.text}</p>
      {showCorrect && (
        <Icon name="check_circle" size={20} className="text-tertiary-container ml-auto flex-shrink-0 mt-0.5" />
      )}
      {showWrong && (
        <Icon name="cancel" size={20} className="text-error ml-auto flex-shrink-0 mt-0.5" />
      )}
    </button>
  );
}

// ── Result summary ────────────────────────────────────────────────────────────
function QuizResult({ result, onRetake }) {
  const passed = result.passed;
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center ${
          passed ? 'bg-tertiary-container' : 'bg-error/10'
        }`}
      >
        <Icon name={passed ? 'workspace_premium' : 'replay'} size={40} className={passed ? 'text-on-tertiary' : 'text-error'} fill />
      </div>
      <h2 className="font-h1 text-h1 text-primary">{passed ? 'Quiz Passed!' : 'Quiz Complete'}</h2>
      <div className="grid grid-cols-3 gap-4 max-w-lg w-full">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Score</p>
          <p className="font-h2 text-h2 font-bold text-primary">{result.score} / {result.total_questions}</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Accuracy</p>
          <p className="font-h2 text-h2 font-bold text-primary">{result.accuracy_pct}%</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">XP Earned</p>
          <p className="font-h2 text-h2 font-bold text-secondary-container">+{result.xp_earned}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-on-surface-variant">
        <div className="flex items-center gap-2">
          <Icon name="local_fire_department" size={16} fill className="text-secondary-container" />
          <span className="font-label-caps text-label-caps">{result.streak} day streak</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="military_tech" size={16} className="text-primary-container" />
          <span className="font-label-caps text-label-caps">Level {result.level} · {result.total_xp} XP</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <button
          onClick={onRetake}
          className="bg-primary text-white font-label-caps text-label-caps px-8 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-level-1 flex items-center gap-2"
        >
          <Icon name="replay" size={16} />
          Retake Test
        </button>
        <Link
          to="/academy/quiz"
          className="bg-surface-container-high text-primary font-label-caps text-label-caps px-8 py-3 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2"
        >
          <Icon name="format_list_bulleted" size={16} />
          Back to Mock Tests
        </Link>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function QuizSkeleton() {
  return (
    <div className="animate-pulse space-y-5 flex-1">
      <div className="h-2.5 bg-surface-container rounded-full w-full" />
      <div className="h-32 bg-surface-container rounded-xl" />
      <div className="h-16 bg-surface-container rounded-xl" />
      <div className="h-16 bg-surface-container rounded-xl" />
      <div className="h-16 bg-surface-container rounded-xl" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { quizId } = useParams();

  const [quiz,           setQuiz]          = useState(null);
  const [attemptId,      setAttemptId]     = useState(null);
  const [currentIdx,     setCurrentIdx]     = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered,       setAnswered]       = useState(false);
  const [lastCorrect,    setLastCorrect]    = useState(false);
  const [lastPoints,     setLastPoints]     = useState(0);
  const [lives,          setLives]          = useState(3);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [complete,       setComplete]       = useState(false);
  const [result,         setResult]         = useState(null);
  const [xpEarned,       setXpEarned]       = useState(0);

  useEffect(() => {
    if (!quizId) return;
    const numericId = Number(quizId);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      setError('Quiz not found.');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchQuizApi(quizId)
      .then(async (q) => {
        setQuiz(q);
        setLives(q.max_lives ?? 3);
        const attempt = await startAttemptApi(quizId);
        setAttemptId(attempt.id);
      })
      .catch((err) => {
        const msg = /valid integer|not found/i.test(err.message) ? 'Quiz not found.' : err.message;
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  const questions = quiz?.questions ?? [];
  const question  = questions[currentIdx];
  const maxLives  = quiz?.max_lives ?? 3;

  const handleCheck = async () => {
    if (!selectedOption || answered || !attemptId) return;
    try {
      const res = await submitAnswerApi(attemptId, question.id, selectedOption);
      const correct = res.is_correct;
      setLastCorrect(correct);
      setLastPoints(res.points_earned);
      setAnswered(true);
      if (correct) {
        setXpEarned((x) => x + res.points_earned);
      } else {
        setLives((l) => Math.max(0, l - 1));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNext = async () => {
    if (currentIdx >= questions.length - 1) {
      try {
        const res = await completeAttemptApi(attemptId);
        setResult(res);
        setComplete(true);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
      setLastCorrect(false);
      setLastPoints(0);
    }
  };

  const handleRetake = async () => {
    setComplete(false);
    setResult(null);
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswered(false);
    setLastCorrect(false);
    setLastPoints(0);
    setXpEarned(0);
    setLives(quiz?.max_lives ?? 3);
    setError(null);
    try {
      const attempt = await startAttemptApi(quizId);
      setAttemptId(attempt.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="bg-background text-on-background font-body-md flex min-h-screen">
      <Topbar variant="academy" />
      <AppSidebar variant="curriculum" />

      <div
        className={`flex-1 flex flex-col pt-16 min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <main className="flex-1 p-margin-desktop flex gap-gutter max-w-[1200px] mx-auto w-full">


          {/* ── Left: question area ── */}
          <div className="flex-1 flex flex-col gap-8">
            {loading ? (
              <QuizSkeleton />
            ) : error ? (
              <div className="bg-error/10 border border-error/30 text-error rounded-xl px-5 py-4 flex items-center gap-2">
                <Icon name="error" size={18} />
                {error}
              </div>
            ) : complete && result ? (
              <QuizResult result={result} onRetake={handleRetake} />
            ) : !question ? (
              <div className="flex flex-col items-center py-20 text-center">
                <Icon name="quiz" size={48} className="text-on-surface-variant/30 mb-4" />
                <p className="font-h2 text-[18px] text-on-surface-variant">No questions found</p>
                <p className="font-body-md text-on-surface-variant/60 mt-1">
                  This quiz has no questions yet.
                </p>
              </div>
            ) : (
              <>
                <QuizProgressBar total={questions.length} current={currentIdx} />

                {/* Question scenario card */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1">
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-3">
                    Question {currentIdx + 1}
                  </p>
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                    {question.scenario ?? 'No question text.'}
                  </p>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {question.options.map((opt) => (
                    <QuizOption
                      key={opt.id}
                      option={opt}
                      selected={selectedOption}
                      answered={answered}
                      isCorrectForOption={answered && lastCorrect && opt.id === selectedOption}
                      onSelect={setSelectedOption}
                    />
                  ))}
                </div>

                {/* Feedback + CTA */}
                <div className="flex items-center justify-between">
                  {answered ? (
                    <div
                      className={`flex items-center gap-2 font-label-caps text-label-caps font-bold ${
                        lastCorrect ? 'text-tertiary-container' : 'text-error'
                      }`}
                    >
                      <Icon name={lastCorrect ? 'check_circle' : 'cancel'} size={18} />
                      {lastCorrect ? `Correct! +${lastPoints} XP` : 'Incorrect — 1 life lost'}
                    </div>
                  ) : <div />}
                  <button
                    id={answered ? 'quiz-next-btn' : 'quiz-check-btn'}
                    onClick={answered ? handleNext : handleCheck}
                    disabled={!answered && !selectedOption}
                    className="bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase tracking-widest px-8 py-4 rounded-full shadow-level-1 hover:bg-primary transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {answered
                      ? currentIdx >= questions.length - 1 ? 'Finish Quiz' : 'Next Question'
                      : 'Check Answer'}
                    <Icon name="arrow_forward" size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Right: sidebar ── */}
          <aside className="w-80 flex flex-col gap-6">
            {/* Knowledge check panel */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-level-1">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-5 border-b border-outline-variant pb-2">
                Knowledge Check
              </h4>
              <div className="space-y-5">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Attempts Remaining</p>
                  <div className="flex gap-2">
                    {Array.from({ length: maxLives }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          i < lives
                            ? 'border-error bg-error/10 text-error'
                            : 'border-outline-variant/30 bg-surface-container'
                        }`}
                      >
                        <Icon name="favorite" size={14} fill={i < lives} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">XP Earned This Session</p>
                  <div className="flex items-center gap-2 text-secondary-container font-h2 text-h2">
                    <Icon name="diamond" size={28} fill />
                    +{xpEarned} XP
                  </div>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">XP Per Correct Answer</p>
                  <p className="font-body-md font-bold text-on-surface">+{quiz?.xp_per_question ?? 50} XP</p>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}