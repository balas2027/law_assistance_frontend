import { demoCourse, demoLesson, demoQuiz } from '../../types/academy';

export async function fetchCourseApi(_courseId) {
  return Promise.resolve(demoCourse);
}

export async function fetchLessonApi(_lessonId) {
  return Promise.resolve(demoLesson);
}

export async function fetchQuizApi(_quizId) {
  return Promise.resolve(demoQuiz);
}

export async function submitQuizAnswerApi(_quizId, _questionId, _optionId) {
  return Promise.resolve({ correct: true, xp: 50 });
}
