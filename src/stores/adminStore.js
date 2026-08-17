import { create } from 'zustand';
import { fetchAdminStatsApi, fetchAdminUsersApi } from '../lib/api/admin';
import {
  fetchTopicsApi,
  fetchCmsQuizApi,
  createQuizApi,
  updateQuizApi,
  publishQuizApi,
} from '../lib/api/cms';
import { useUiStore } from './uiStore';
import { demoQuizBuilder } from '../types/admin';

const DIFFICULTY_TO_API = {
  'Beginner': 'beginner',
  'Intermediate': 'intermediate',
  'Advanced (Bar Level)': 'advanced',
  'Expert': 'expert',
};

const API_TO_DIFFICULTY = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced (Bar Level)',
  expert: 'Expert',
};

const nextOptionKey = (options) => {
  const used = new Set(options.map((opt) => opt.id));
  for (let i = 0; i < 26; i += 1) {
    const letter = String.fromCharCode(65 + i);
    if (!used.has(letter)) return letter;
  }
  return `OPT${Date.now()}`;
};

const genKey = () => `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

function builderToPayload(builder) {
  return {
    title: builder.title,
    description: builder.description || '',
    topic_id: builder.topicId,
    difficulty: DIFFICULTY_TO_API[builder.difficulty] || 'beginner',
    xp_per_question: builder.xpReward || 50,
    max_lives: builder.maxLives || 3,
    status: builder.status || 'draft',
    questions: builder.questions.map((question, qi) => ({
      scenario: question.scenario,
      points: question.points || builder.xpReward || 50,
      sort_order: qi,
      options: question.options.map((opt, oi) => ({
        option_key: opt.id,
        text: opt.text,
        is_correct: opt.isCorrect,
        sort_order: oi,
      })),
    })),
  };
}

function quizToBuilder(quiz) {
  const questions = (quiz.questions ?? []).map((question, qi) => ({
    key: `q_${question.id || qi}`,
    scenario: question.scenario,
    points: question.points ?? quiz.xp_per_question ?? 50,
    options: (question.options ?? []).map((opt) => ({
      id: opt.option_key,
      label: `Option ${opt.option_key}`,
      text: opt.text,
      isCorrect: opt.is_correct,
    })),
  }));
  return {
    ...demoQuizBuilder,
    id: quiz.id,
    header: `${quiz.status === 'published' ? 'Published' : 'Draft'}: ${quiz.title}`,
    title: quiz.title,
    description: quiz.description || '',
    topicId: quiz.topic_id,
    xpReward: quiz.xp_per_question || 50,
    maxLives: quiz.max_lives || 3,
    difficulty: API_TO_DIFFICULTY[quiz.difficulty] || 'Beginner',
    status: quiz.status,
    questions: questions.length ? questions : demoQuizBuilder.questions,
  };
}

export const useAdminStore = create((set, get) => ({
  stats: null,
  users: [],
  topics: [],
  quizBuilder: demoQuizBuilder,
  loading: false,
  error: null,

  // ── Dashboard stats ──────────────────────────────────────────────────────

  loadStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await fetchAdminStatsApi();
      set({ stats, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  loadUsers: async ({ skip = 0, limit = 50 } = {}) => {
    set({ loading: true, error: null });
    try {
      const users = await fetchAdminUsersApi({ skip, limit });
      set({ users, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ── Topics ───────────────────────────────────────────────────────────────

  loadTopics: async () => {
    try {
      const topics = await fetchTopicsApi();
      set({ topics });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ── Quiz Builder: quiz-level fields ──────────────────────────────────────

  loadQuizBuilder: async (id) => {
    set({ loading: true, error: null });
    try {
      if (!id || id === 'new' || id === 'demo') {
        set({ quizBuilder: { ...demoQuizBuilder, header: 'New Quiz' }, loading: false });
        return;
      }
      const quiz = await fetchCmsQuizApi(id);
      set({ quizBuilder: quizToBuilder(quiz), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  setBuilderField: (field, value) =>
    set((state) => ({
      quizBuilder: { ...state.quizBuilder, [field]: value },
    })),

  // ── Quiz Builder: questions ──────────────────────────────────────────────

  addQuestion: () =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: [
          ...state.quizBuilder.questions,
          {
            key: genKey(),
            scenario: '',
            points: state.quizBuilder.xpReward || 50,
            options: [
              { id: 'A', label: 'Option A', text: '', isCorrect: false },
              { id: 'B', label: 'Option B', text: '', isCorrect: false },
            ],
          },
        ],
      },
    })),

  removeQuestion: (qKey) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: state.quizBuilder.questions.filter((q) => q.key !== qKey),
      },
    })),

  setQuestionScenario: (qKey, value) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: state.quizBuilder.questions.map((q) =>
          q.key === qKey ? { ...q, scenario: value } : q,
        ),
      },
    })),

  setQuestionPoints: (qKey, value) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: state.quizBuilder.questions.map((q) =>
          q.key === qKey ? { ...q, points: Number(value) || 0 } : q,
        ),
      },
    })),

  // ── Quiz Builder: options ────────────────────────────────────────────────

  addQuestionOption: (qKey) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: state.quizBuilder.questions.map((q) => {
          if (q.key !== qKey) return q;
          const letter = nextOptionKey(q.options);
          return {
            ...q,
            options: [
              ...q.options,
              { id: letter, label: `Option ${letter}`, text: '', isCorrect: false },
            ],
          };
        }),
      },
    })),

  removeQuestionOption: (qKey, optId) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: state.quizBuilder.questions.map((q) =>
          q.key === qKey ? { ...q, options: q.options.filter((o) => o.id !== optId) } : q,
        ),
      },
    })),

  setQuestionOptionText: (qKey, optId, text) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: state.quizBuilder.questions.map((q) =>
          q.key === qKey
            ? { ...q, options: q.options.map((o) => (o.id === optId ? { ...o, text } : o)) }
            : q,
        ),
      },
    })),

  setQuestionCorrectOption: (qKey, optId) =>
    set((state) => ({
      quizBuilder: {
        ...state.quizBuilder,
        questions: state.quizBuilder.questions.map((q) =>
          q.key === qKey
            ? { ...q, options: q.options.map((o) => ({ ...o, isCorrect: o.id === optId })) }
            : q,
        ),
      },
    })),

  // ── Quiz Builder: citations ──────────────────────────────────────────────

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

  // ── Save / Publish ───────────────────────────────────────────────────────

  saveQuizBuilder: async () => {
    const builder = get().quizBuilder;
    set({ loading: true, error: null });
    try {
      const payload = builderToPayload(builder);
      const saved = builder.id && typeof builder.id === 'number'
        ? await updateQuizApi(builder.id, payload)
        : await createQuizApi(payload);
      set({
        quizBuilder: {
          ...get().quizBuilder,
          id: saved.id,
          status: saved.status,
          header: `Saved: ${saved.title}`,
        },
        loading: false,
      });
      useUiStore.getState().addToast('Quiz saved as draft', 'success');
      return saved;
    } catch (err) {
      set({ error: err.message, loading: false });
      useUiStore.getState().addToast(err.message, 'error');
      throw err;
    }
  },

  publishQuizBuilder: async () => {
    const builder = get().quizBuilder;
    set({ loading: true, error: null });
    try {
      const payload = builderToPayload(builder);
      const saved = builder.id && typeof builder.id === 'number'
        ? await updateQuizApi(builder.id, payload)
        : await createQuizApi(payload);
      await publishQuizApi(saved.id);
      const refreshed = await fetchCmsQuizApi(saved.id);
      set({
        quizBuilder: {
          ...get().quizBuilder,
          id: refreshed.id,
          status: refreshed.status,
          header: `Published: ${refreshed.title}`,
        },
        loading: false,
      });
      useUiStore.getState().addToast('Quiz published successfully', 'success');
      return refreshed;
    } catch (err) {
      set({ error: err.message, loading: false });
      useUiStore.getState().addToast(err.message, 'error');
      throw err;
    }
  },
}));