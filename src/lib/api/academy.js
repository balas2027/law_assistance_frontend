import { API_BASE } from '../api_endpoint';
import { demoCourse, demoLesson, demoQuiz } from '../../types/academy';

function getAuthHeaders() {
  const token = JSON.parse(localStorage.getItem('nyayaai-auth') || '{}')?.state?.token;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function handle(res) {
  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const detail = typeof data.detail === 'string' ? data.detail : data.detail?.[0]?.msg || 'Request failed';
    throw new Error(detail);
  }
  return data;
}

// ── Courses ──────────────────────────────────────────────────────────────────

export async function fetchCoursesApi() {
  const res = await fetch(`${API_BASE}/academy/courses`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function fetchCourseApi(courseId) {
  if (!courseId || isNaN(Number(courseId))) return Promise.resolve(demoCourse);
  const res = await fetch(`${API_BASE}/academy/courses/${courseId}`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function createCourseApi(payload) {
  const res = await fetch(`${API_BASE}/academy/courses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateCourseApi(courseId, payload) {
  const res = await fetch(`${API_BASE}/academy/courses/${courseId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteCourseApi(courseId) {
  const res = await fetch(`${API_BASE}/academy/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handle(res);
}

// ── Lessons ──────────────────────────────────────────────────────────────────

export async function fetchLessonsApi({ courseId } = {}) {
  const url = courseId
    ? `${API_BASE}/academy/lessons?course_id=${courseId}`
    : `${API_BASE}/academy/lessons`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handle(res);
}

export async function fetchLessonApi(lessonId) {
  if (!lessonId || isNaN(Number(lessonId))) return Promise.resolve(demoLesson);
  const res = await fetch(`${API_BASE}/academy/lessons/${lessonId}`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function createLessonApi(payload) {
  const res = await fetch(`${API_BASE}/academy/lessons`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateLessonApi(lessonId, payload) {
  const res = await fetch(`${API_BASE}/academy/lessons/${lessonId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteLessonApi(lessonId) {
  const res = await fetch(`${API_BASE}/academy/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handle(res);
}

// ── Quiz (stubs - not yet wired to CMS) ──────────────────────────────────────

export async function fetchQuizApi(_quizId) {
  return Promise.resolve(demoQuiz);
}

export async function submitQuizAnswerApi(_quizId, _questionId, _optionId) {
  return Promise.resolve({ correct: true, xp: 50 });
}

