export const INGREDIENT_TYPE_BUN = 'bun';

export const ORDER_STATUS_DONE = 'done';
export const ORDER_STATUS_PENDING = 'pending';
export const ORDER_STATUS_CREATED = 'created';
export const ORDER_STATUS_CANCELLED = 'cancelled';
export const ORDER_STATUS_CANCELED = 'canceled';

export const ORDER_NUMBER_PAD_LENGTH = 6;

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

export const ROUTES = {
  constructor: '/',
  feed: '/feed',
  feedOrder: '/feed/:number',
  forgotPassword: '/forgot-password',
  ingredient: '/ingredients/:id',
  login: '/login',
  profile: '/profile',
  profileOrder: '/profile/orders/:number',
  profileOrders: '/profile/orders',
  register: '/register',
  resetPassword: '/reset-password',
} as const;

export const padOrderNumber = (number: number | string): string =>
  `#${String(number).padStart(ORDER_NUMBER_PAD_LENGTH, '0')}`;
