import { demoCurriculum, demoQuizBuilder, demoStats } from '../../types/admin';

export async function fetchDashboardApi() {
  return Promise.resolve({ stats: demoStats, curriculum: demoCurriculum });
}

export async function fetchQuizBuilderApi(_id) {
  return Promise.resolve(demoQuizBuilder);
}

export async function saveQuizBuilderApi(payload) {
  return Promise.resolve(payload);
}
