import { create } from 'zustand';
import { fetchCourseApi, fetchLessonApi } from '../lib/api/academy';

export const useAcademyStore = create((set) => ({
  xp:     0,
  streak: 0,

  // These are kept for the progress hook but pages now load their own data directly.
  loadCourse: async (courseId) => {
    await fetchCourseApi(courseId);
  },

  loadLesson: async (lessonId) => {
    await fetchLessonApi(lessonId);
  },

  addXp:     (amount)  => set((state) => ({ xp: state.xp + amount })),
  setStreak: (streak)  => set({ streak }),
}));

