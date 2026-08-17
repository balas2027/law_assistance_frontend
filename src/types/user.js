export const USER_ROLES = {
  LAW_STUDENT: 'law_student',
  RESEARCHER: 'researcher',
  COMMON_MAN: 'common_man',
  LAW_PROFESSIONAL: 'law_professional',
  ADMIN: 'admin',
};

export const ROLE_NAMES = {
  law_student: 'Law Student',
  researcher: 'Researcher',
  common_man: 'Common Man',
  law_professional: 'Law Professional',
  admin: 'Admin',
};

export const ROLE_LIST = [
  { value: USER_ROLES.LAW_STUDENT, label: ROLE_NAMES.law_student },
  { value: USER_ROLES.RESEARCHER, label: ROLE_NAMES.researcher },
  { value: USER_ROLES.COMMON_MAN, label: ROLE_NAMES.common_man },
  { value: USER_ROLES.LAW_PROFESSIONAL, label: ROLE_NAMES.law_professional },
  { value: USER_ROLES.ADMIN, label: ROLE_NAMES.admin },
];

export const SIGNUP_ROLES = ROLE_LIST.filter((r) => r.value !== USER_ROLES.ADMIN);

export const USER_TYPE_ROLES = ['law_student', 'researcher', 'law_professional', 'admin'];
export const ADMIN_ROLES = ['law_professional', 'admin'];
