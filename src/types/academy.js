// Status enums used by academy UI components
export const LESSON_STATUS = {
  COMPLETED:   'completed',
  CURRENT:     'current',
  LOCKED:      'locked',
  PUBLISHED:   'published',
  DRAFT:       'draft',
};

export const SUBTOPIC_STATUS = {
  COMPLETED:   'completed',
  IN_PROGRESS: 'in-progress',
  UPCOMING:    'upcoming',
};

// Stub null exports kept so that any remaining import of demoCourse/demoLesson/demoQuiz
// won't crash. Real data is always fetched from the backend API.
export const demoCourse = null;
export const demoLesson = null;
export const demoQuiz   = null;
