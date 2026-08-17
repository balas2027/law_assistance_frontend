export const USER_ROLES = {
  COMMON_MAN: 'common_man',
  ADMIN: 'admin',
};

export const ROLE_NAMES = {
  common_man: 'Common Man',
  admin: 'Admin',
};

export const ROLE_LIST = [
  { value: USER_ROLES.COMMON_MAN, label: ROLE_NAMES.common_man },
  { value: USER_ROLES.ADMIN, label: ROLE_NAMES.admin },
];

export const SIGNUP_ROLES = ROLE_LIST.filter((r) => r.value !== USER_ROLES.ADMIN);

export const USER_TYPE_ROLES = ['common_man', 'admin'];
export const ADMIN_ROLES = ['admin'];
