export const PUBLISH_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

export const demoStats = [
  {
    id: 's1',
    label: 'Total Students',
    value: '12,450',
    icon: 'school',
    trend: '+8% this month',
    trendIcon: 'trending_up',
    trendPositive: true,
  },
  {
    id: 's2',
    label: 'Lessons Published',
    value: '342',
    icon: 'menu_book',
    footnote: 'Across 12 Categories',
  },
  {
    id: 's3',
    label: 'Avg. Quiz Score',
    value: '86%',
    icon: 'workspace_premium',
    trend: '+2.1% improvement',
    trendIcon: 'trending_up',
    trendPositive: true,
  },
];

export const demoCurriculum = [
  {
    id: 'row1',
    title: 'Fundamental Rights: Article 21',
    code: 'MOD-CON-01a',
    status: PUBLISH_STATUS.DRAFT,
    author: 'A. Sharma, Esq.',
    lastUpdated: 'Just now',
  },
  {
    id: 'row2',
    title: 'Corporate Compliance Basics',
    code: 'MOD-CORP-11',
    status: PUBLISH_STATUS.PUBLISHED,
    author: 'NyayaAI System',
    lastUpdated: 'Oct 24, 2023',
  },
  {
    id: 'row3',
    title: 'Criminal Procedure Code Overview',
    code: 'MOD-CRM-04',
    status: PUBLISH_STATUS.PUBLISHED,
    author: 'R. Desai, Sr. Adv',
    lastUpdated: 'Oct 20, 2023',
  },
  {
    id: 'row4',
    title: 'Contract Law Exceptions',
    code: 'MOD-CIV-08',
    status: PUBLISH_STATUS.DRAFT,
    author: 'A. Sharma, Esq.',
    lastUpdated: 'Oct 18, 2023',
  },
];

export const demoPreview = {
  module: 'Module: Constitutional Law',
  title: 'Fundamental Rights: Protection of Life and Personal Liberty (Article 21)',
  body: 'No person shall be deprived of his life or personal liberty except according to procedure established by law. This article is the heart of the Constitution, arguably the most organic and progressive provision.',
  precedent:
    "In Maneka Gandhi v. Union of India (1978), the Supreme Court expanded the scope of Article 21, stating that the 'procedure established by law' must be fair, just, and reasonable, not fanciful, oppressive, or arbitrary.",
  suggestion:
    "Consider adding a quiz question here regarding the distinction between 'due process' and 'procedure established by law'.",
};

export const demoQuizBuilder = {
  id: 'quiz_b_art21',
  title: 'Article 21 Scenario: Right to Privacy vs National Security',
  description:
    "A prominent journalist discovers that their communications have been intercepted by state agencies without a formal warrant under the Telegraph Act. The state cites 'national security' as the primary justification, refusing to disclose the operational details. The journalist files a writ petition under Article 32. Based on the KS Puttaswamy judgment, evaluate the state's action.",
  header: 'Draft: Article 21 - Privacy Rights',
  options: [
    {
      id: 'A',
      label: 'Option A',
      text: 'The interception is unconstitutional. While national security is a legitimate state aim, the action lacks procedural safeguards and proportionality, failing the three-fold test established in Puttaswamy.',
      isCorrect: true,
    },
    {
      id: 'B',
      label: 'Option B',
      text: 'The interception is perfectly legal. National security concerns override the fundamental right to privacy under all circumstances without requiring judicial oversight.',
      isCorrect: false,
    },
  ],
  xpReward: 150,
  difficulty: 'Advanced (Bar Level)',
  difficultyOptions: ['Beginner', 'Intermediate', 'Advanced (Bar Level)', 'Expert'],
  citations: ['Constitution of India', 'KS Puttaswamy v. UOI'],
};
