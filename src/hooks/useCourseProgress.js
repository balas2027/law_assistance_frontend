import { useAcademyStore } from '../stores/academyStore';

export const useCourseProgress = () => {
  const course = useAcademyStore((s) => s.course);
  const lesson = useAcademyStore((s) => s.lesson);
  const xp = useAcademyStore((s) => s.xp);
  const streak = useAcademyStore((s) => s.streak);
  const loadCourse = useAcademyStore((s) => s.loadCourse);
  const loadLesson = useAcademyStore((s) => s.loadLesson);
  const addXp = useAcademyStore((s) => s.addXp);

  return { course, lesson, xp, streak, loadCourse, loadLesson, addXp };
};
