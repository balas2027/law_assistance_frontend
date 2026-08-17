export const LESSON_STATUS = {
  COMPLETED: 'completed',
  CURRENT: 'current',
  LOCKED: 'locked',
};

export const SUBTOPIC_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in-progress',
  UPCOMING: 'upcoming',
};

export const demoCourse = {
  id: 'course_fr',
  title: 'Fundamental Rights',
  subtitle: 'Part III of the Indian Constitution (Articles 12-35)',
  progress: 50,
  completedModules: 2,
  totalModules: 4,
  currentModule: 'Life & Liberty (Art. 21)',
  lessons: [
    {
      id: 'l1',
      courseId: 'course_fr',
      title: 'Equality (Art. 14-18)',
      description: 'Equality before law, prohibition of discrimination, and equality of opportunity.',
      status: LESSON_STATUS.COMPLETED,
      module: 'Lesson 1',
    },
    {
      id: 'l2',
      courseId: 'course_fr',
      title: 'Freedom (Art. 19-22)',
      description: 'Protection of six rights regarding freedom of speech, assembly, and movement.',
      status: LESSON_STATUS.COMPLETED,
      module: 'Lesson 2',
    },
    {
      id: 'l3',
      courseId: 'course_fr',
      title: 'Life & Liberty (Art. 21)',
      description: 'The core of fundamental rights: Protection of life and personal liberty.',
      status: LESSON_STATUS.CURRENT,
      module: 'Current Lesson',
      duration: '15 mins',
    },
    {
      id: 'l4',
      courseId: 'course_fr',
      title: 'Right against Exploitation',
      description: 'Prohibition of traffic in human beings and forced labor.',
      status: LESSON_STATUS.LOCKED,
      module: 'Lesson 4',
    },
  ],
  overview: {
    subTopics: [
      {
        id: 'st1',
        title: 'Concept of Personal Liberty',
        status: SUBTOPIC_STATUS.COMPLETED,
        meta: 'Completed',
      },
      {
        id: 'st2',
        title: 'Procedure Established by Law',
        status: SUBTOPIC_STATUS.IN_PROGRESS,
        meta: 'In Progress \u2022 5 mins left',
      },
      {
        id: 'st3',
        title: 'Right to Privacy (Puttaswamy)',
        status: SUBTOPIC_STATUS.UPCOMING,
        meta: '10 mins',
      },
    ],
    keyCase: {
      title: 'Key Case',
      description:
        'Maneka Gandhi v. Union of India established that procedure established by law must be just, fair and reasonable.',
    },
  },
};

export const demoLesson = {
  id: 'lesson_art21',
  courseId: 'course_fr',
  breadcrumbs: [
    { label: 'Constitutional Law', to: '/academy/path/course_fr' },
    { label: 'Part III', to: '/academy/path/course_fr' },
    { label: 'Article 21', to: null },
  ],
  tags: ['Fundamental Rights', 'Est. 45 mins'],
  title: 'Protection of Life and Personal Liberty',
  intro:
    'Article 21 is considered the heart and soul of the Constitution. It guarantees that no person shall be deprived of their life or personal liberty except according to the procedure established by law.',
  bareAct:
    'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
  body: [
    {
      heading: 'Understanding the Scope',
      paragraphs: [
        'The interpretation of Article 21 has undergone a massive transformation. Initially confined to a literal interpretation protecting mere animal existence, the judiciary has expanded its horizon to encompass the right to live with human dignity. The term "procedure established by law" was re-interpreted post the Menaka Gandhi case to mean that the procedure must be "just, fair, and reasonable."',
        'This singular article has become the repository of various unarticulated fundamental rights, acting as a constitutional safety net for citizens.',
      ],
    },
  ],
  landmarkCase: {
    name: 'Maneka Gandhi',
    vs: 'vs. Union of India (1978)',
    heading: 'The Paradigm Shift',
    description:
      "This watershed judgment established that 'procedure established by law' under Art. 21 must meet the test of reasonableness under Art. 14. It inextricably linked Articles 14, 19, and 21, creating the \"Golden Triangle\" of the Indian Constitution.",
  },
  keyTerms: [
    {
      id: 'kt1',
      title: 'Right to Livelihood',
      description:
        "Included within the right to life, preventing arbitrary deprivation of one's means of living (Olga Tellis case).",
    },
    {
      id: 'kt2',
      title: 'Right to Privacy',
      description:
        'Recognized as an intrinsic part of the right to life and personal liberty (Puttaswamy case).',
    },
    {
      id: 'kt3',
      title: 'Due Process',
      description:
        'Though not explicitly in the text, Indian jurisprudence has read substantive due process into Art. 21.',
    },
    {
      id: 'kt4',
      title: 'Right to Health',
      description:
        'The state has an obligation to preserve life, making access to medical aid a fundamental right.',
    },
  ],
  moduleProgress: {
    percent: 65,
    lessons: [
      { id: 'lp1', title: 'Historical Context', meta: '15 mins \u2022 Reading', status: LESSON_STATUS.COMPLETED },
      { id: 'lp2', title: 'A.K. Gopalan Case', meta: '20 mins \u2022 Video', status: LESSON_STATUS.COMPLETED },
      { id: 'lp3', title: 'Protection of Life & Liberty', meta: 'Current \u2022 45 mins', status: LESSON_STATUS.CURRENT },
      { id: 'lp4', title: 'Exceptions & Limitations', meta: '30 mins \u2022 Interactive', status: LESSON_STATUS.LOCKED },
      { id: 'lp5', title: 'Knowledge Check', meta: '10 Questions \u2022 Quiz', status: LESSON_STATUS.LOCKED },
    ],
  },
};

export const demoQuiz = {
  id: 'quiz_fr_01',
  title: 'Fundamental Rights Quiz',
  totalQuestions: 10,
  currentIndex: 3,
  xpPotential: 50,
  lives: 2,
  maxLives: 3,
  reference: {
    title: 'Constitution of India, Art. 22',
    text:
      'Protection against arrest and detention in certain cases. (1) No person who is arrested shall be detained in custody without being informed, as soon as may be, of the grounds for such arrest...',
  },
  question: {
    id: 'q4',
    scenario:
      'A citizen is detained without being informed of the grounds of arrest and is held in police custody for 48 hours without being produced before a magistrate. Which fundamental rights have been violated, and under what specific provisions?',
    options: [
      {
        id: 'A',
        text: 'Article 14 and Article 19, relating to equality and freedom of movement.',
        isCorrect: false,
      },
      {
        id: 'B',
        text: 'Article 22(1) and Article 22(2), mandating the right to be informed of grounds and production before a magistrate within 24 hours.',
        isCorrect: true,
        selected: true,
      },
      {
        id: 'C',
        text: 'Article 21 only, as it broadly covers the protection of life and personal liberty.',
        isCorrect: false,
      },
      {
        id: 'D',
        text: 'No fundamental rights have been violated if the arrest was made under a valid preventive detention law.',
        isCorrect: false,
      },
    ],
  },
};
