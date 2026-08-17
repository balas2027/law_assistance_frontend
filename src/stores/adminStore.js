import { create } from 'zustand';
import { fetchDashboardApi, fetchQuizBuilderApi, saveQuizBuilderApi } from '../lib/api/admin';
import { demoCurriculum, demoPreview, demoQuizBuilder, demoStats } from '../types/admin';

export const useAdminStore = create((set, get) => ({
  stats: demoStats,
  curriculum: demoCurriculum,
  preview: demoPreview,
  quizBuilder: demoQuizBuilder,
  loading: false,

  loadDashboard: async () => {
    set({ loading: true });
    const data = await fetchDashboardApi();
    set({ stats: data.stats, curriculum: data.curriculum, loading: false });
  },

  loadQuizBuilder: async (id) => {
    set({ loading: true });
    const builder = await fetchQuizBuilderApi(id);
    set({ quizBuilder: builder, loading: false });
  },

  setBuilderField: (field, value) =>
    set((state) => ({
      quizBuilder: { ...state.quizBuilder, [field]: value },
    })),

  setBuilderOption: (optionId, text) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        options: state.quizBuilder.options.map((opt) =>
          opt.id === optionId ? { ...opt, text } : opt,
        ),
      },
    })),

  setCorrectOption: (optionId) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        options: state.quizBuilder.options.map((opt) => ({
          ...opt,
          isCorrect: opt.id === optionId,
        })),
      },
    })),

  addBuilderOption: () =>
    set((state) => {
      const nextLetter = String.fromCharCode(65 + state.quizBuilder.options.length);
      return {
        quizBuilder: {
          ...state.quizBuilder,
          options: [
            ...state.quizBuilder.options,
            { id: nextLetter, label: `Option ${nextLetter}`, text: '', isCorrect: false },
          ],
        },
      };
    }),

  addCitation: (citation) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        citations: [...state.quizBuilder.citations, citation],
      },
    })),

  removeCitation: (citation) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        citations: state.quizBuilder.citations.filter((c) => c !== citation),
      },
    })),

  saveQuizBuilder: async () => {
    await saveQuizBuilderApi(get().quizBuilder);
  },
}));
