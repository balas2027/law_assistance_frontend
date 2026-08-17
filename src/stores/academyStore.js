import { create } from 'zustand';
import { fetchCourseApi, fetchLessonApi, fetchQuizApi, submitQuizAnswerApi } from '../lib/api/academy';
import { demoCourse, demoLesson, demoQuiz } from '../types/academy';

const initialQuiz = {
  quiz: demoQuiz,
  currentIndex: demoQuiz.currentIndex,
  selectedOption: 'B',
  lives: demoQuiz.lives,
  answered: false,
  xpEarned: 0,
};

export const useAcademyStore = create((set, get) => ({
  course: demoCourse,
  lesson: demoLesson,
  quizProgress: initialQuiz,
  xp: 1250,
  streak: 12,

  loadCourse: async (courseId) => {
    const course = await fetchCourseApi(courseId);
    set({ course });
  },

  loadLesson: async (lessonId) => {
    const lesson = await fetchLessonApi(lessonId);
    set({ lesson });
  },

  loadQuiz: async (quizId) => {
    const quiz = await fetchQuizApi(quizId);
    set({
      quizProgress: {
        quiz,
        currentIndex: quiz.currentIndex,
        selectedOption: null,
        lives: quiz.lives,
        answered: false,
        xpEarned: 0,
      },
    });
  },

  selectQuizOption: (optionId) =>
    set((state) => ({
      quizProgress: { ...state.quizProgress, selectedOption: optionId, answered: false },
    })),

  checkQuizAnswer: async () => {
    const { quizProgress } = get();
    const { quiz, selectedOption } = quizProgress;
    const option = quiz.question.options.find((o) => o.id === selectedOption);
    const result = await submitQuizAnswerApi(quiz.id, quiz.question.id, selectedOption);
    const isCorrect = option?.isCorrect ?? false;
    const lives = isCorrect ? quizProgress.lives : Math.max(0, quizProgress.lives - 1);
    const xpEarned = isCorrect ? quizProgress.xpEarned + quiz.xpPotential : quizProgress.xpEarned;
    set((state) => ({
      quizProgress: { ...state.quizProgress, answered: true, isCorrect, lives, xpEarned },
      xp: state.xp + xpEarned,
    }));
    return result;
  },

  nextQuizQuestion: () =>
    set((state) => {
      const { quizProgress } = state;
      const nextIndex = quizProgress.currentIndex + 1;
      const answered = false;
      return {
        quizProgress: {
          ...quizProgress,
          currentIndex: nextIndex,
          selectedOption: null,
          answered,
        },
      };
    }),

  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  setStreak: (streak) => set({ streak }),
}));
