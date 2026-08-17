import { useAcademyStore } from '../stores/academyStore';

export const useQuiz = () => {
  const quizProgress = useAcademyStore((s) => s.quizProgress);
  const selectQuizOption = useAcademyStore((s) => s.selectQuizOption);
  const checkQuizAnswer = useAcademyStore((s) => s.checkQuizAnswer);
  const nextQuizQuestion = useAcademyStore((s) => s.nextQuizQuestion);

  return {
    quiz: quizProgress.quiz,
    currentIndex: quizProgress.currentIndex,
    selectedOption: quizProgress.selectedOption,
    lives: quizProgress.lives,
    answered: quizProgress.answered,
    isCorrect: quizProgress.isCorrect,
    xpEarned: quizProgress.xpEarned,
    selectQuizOption,
    checkQuizAnswer,
    nextQuizQuestion,
  };
};
