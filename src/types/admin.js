export const PUBLISH_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// demoQuizBuilder is the initial builder state (quiz + questions + options).
export const demoQuizBuilder = {
  id: null,
  header: 'New Quiz',
  title: '',
  description: '',
  topicId: null,
  difficulty: 'Beginner',
  difficultyOptions: ['Beginner', 'Intermediate', 'Advanced (Bar Level)', 'Expert'],
  xpReward: 50,
  maxLives: 3,
  status: 'draft',
  citations: [],
  questions: [
    {
      key: 'q_1',
      scenario: '',
      points: 50,
      options: [
        { id: 'A', label: 'Option A', text: '', isCorrect: false },
        { id: 'B', label: 'Option B', text: '', isCorrect: false },
      ],
    },
  ],
};