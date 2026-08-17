export const MESSAGE_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

export const SUGGESTED_PROMPTS = [
  {
    id: 'p1',
    icon: 'mail',
    text: 'What are my rights if I receive a legal notice?',
  },
  {
    id: 'p2',
    icon: 'contract',
    text: 'Explain this rental agreement',
  },
  {
    id: 'p3',
    icon: 'local_police',
    text: 'What should I do after receiving an FIR?',
  },
  {
    id: 'p4',
    icon: 'apartment',
    text: 'Process for registering a Private Limited Company',
  },
  {
    id: 'p5',
    icon: 'family_restroom',
    text: 'Grounds for mutual consent divorce',
  },
  {
    id: 'p6',
    icon: 'gavel',
    text: 'Difference between bailable and non-bailable offense',
  },
];

export const DOMAINS = [
  { id: 'criminal', icon: '⚖️', label: 'Criminal' },
  { id: 'property', icon: '🏠', label: 'Property' },
  { id: 'corporate', icon: '💼', label: 'Corporate' },
  { id: 'family', icon: '👨‍👩‍👧', label: 'Family' },
];

export const demoChatSession = {
  id: 'chat_rental_2024',
  title: 'Drafting Rental Agreement Review',
  createdAt: '2026-08-16T10:00:00Z',
  updatedAt: '2026-08-16T10:12:00Z',
  messages: [
    {
      id: 'm1',
      role: MESSAGE_ROLES.USER,
      content:
        "I've uploaded my rental agreement for an apartment in Bangalore. Can you check if the notice period and security deposit clauses are standard under Karnataka law?",
      timestamp: '2026-08-16T10:02:00Z',
      document: {
        name: 'Bangalore_Rental_2024.pdf',
        description:
          'Standard residential lease agreement for property located in Indiranagar, Bangalore. Document spans 12 pages including annexures.',
        size: '1.2 MB',
        type: 'pdf',
      },
    },
    {
      id: 'm2',
      role: MESSAGE_ROLES.ASSISTANT,
      timestamp: '2026-08-16T10:05:00Z',
      content:
        'I have reviewed "Bangalore_Rental_2024.pdf" against standard practices and the applicable statutory framework in Karnataka. Here is a breakdown of the specific clauses you inquired about:',
      blocks: [
        {
          type: 'section',
          title: 'Notice Period',
          items: [
            'Your agreement stipulates a 3-month notice period for early termination by the tenant.',
            'In Bangalore, a 1 to 2-month notice period is more common for residential leases, though 3 months is legally permissible if mutually agreed upon.',
            'The Karnataka Rent Control Act, 1999 does not strictly cap notice periods for private agreements outside specific rent-controlled premises, relying instead on contract law principles.',
          ],
        },
        {
          type: 'section',
          title: 'Security Deposit',
          items: [
            'The agreement demands a 10-month rent equivalent as a security deposit.',
            'While historically common in Bangalore, there has been a significant shift. The Model Tenancy Act, 2021 (adopted in spirit by many states) recommends capping residential security deposits at 2 months\u2019 rent.',
            'A 10-month deposit is exceptionally high in the current market and ties up significant capital. You may want to negotiate this down to 3-5 months.',
          ],
        },
      ],
      sources: [
        { title: 'Karnataka Rent Control Act, 1999', active: true },
        { title: 'Indian Contract Act, 1872', active: false },
      ],
      sections: ['Section 12', 'Section 25'],
    },
  ],
};
