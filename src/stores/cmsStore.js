import { create } from 'zustand';
import {
  fetchCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  fetchLessonsApi,
  createLessonApi,
  updateLessonApi,
  deleteLessonApi,
} from '../lib/api/academy';

export const useCmsStore = create((set) => ({

  courses: [],
  lessons: [],
  selectedCourseId: null,
  coursesLoading: false,
  lessonsLoading: false,
  error: null,

  // ── Courses ──────────────────────────────────────────────────────────────

  loadCourses: async () => {
    set({ coursesLoading: true, error: null });
    try {
      const courses = await fetchCoursesApi();
      set({ courses: Array.isArray(courses) ? courses : [], coursesLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load courses', coursesLoading: false });
    }
  },

  createCourse: async (payload) => {
    set({ error: null });
    try {
      const course = await createCourseApi(payload);
      set((state) => ({ courses: [course, ...state.courses] }));
      return course;
    } catch (err) {
      set({ error: err.message || 'Failed to create course' });
      throw err;
    }
  },

  updateCourse: async (courseId, payload) => {
    set({ error: null });
    try {
      const updated = await updateCourseApi(courseId, payload);
      set((state) => ({
        courses: state.courses.map((c) => (c.id === courseId ? updated : c)),
      }));
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to update course' });
      throw err;
    }
  },

  deleteCourse: async (courseId) => {
    set({ error: null });
    try {
      await deleteCourseApi(courseId);
      set((state) => ({
        courses: state.courses.filter((c) => c.id !== courseId),
        selectedCourseId: state.selectedCourseId === courseId ? null : state.selectedCourseId,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to delete course' });
      throw err;
    }
  },

  // ── Lessons ──────────────────────────────────────────────────────────────

  loadLessons: async (courseId) => {
    set({ lessonsLoading: true, error: null, selectedCourseId: courseId ?? null });
    try {
      const lessons = await fetchLessonsApi({ courseId });
      set({ lessons: Array.isArray(lessons) ? lessons : [], lessonsLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load lessons', lessonsLoading: false });
    }
  },

  createLesson: async (payload) => {
    set({ error: null });
    try {
      const lesson = await createLessonApi(payload);
      set((state) => ({ lessons: [lesson, ...state.lessons] }));
      return lesson;
    } catch (err) {
      set({ error: err.message || 'Failed to create lesson' });
      throw err;
    }
  },

  updateLesson: async (lessonId, payload) => {
    set({ error: null });
    try {
      const updated = await updateLessonApi(lessonId, payload);
      set((state) => ({
        lessons: state.lessons.map((l) => (l.id === lessonId ? updated : l)),
      }));
      return updated;
    } catch (err) {
      set({ error: err.message || 'Failed to update lesson' });
      throw err;
    }
  },

  deleteLesson: async (lessonId) => {
    set({ error: null });
    try {
      await deleteLessonApi(lessonId);
      set((state) => ({
        lessons: state.lessons.filter((l) => l.id !== lessonId),
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to delete lesson' });
      throw err;
    }
  },

  setSelectedCourse: (courseId) => set({ selectedCourseId: courseId }),
}));
