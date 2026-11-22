import type { TIngredient } from '@utils-types';

export const bun: TIngredient = {
  _id: 'bun',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '/bun.png',
  image_large: '/bun-large.png',
  image_mobile: '/bun-mobile.png',
};

export const main: TIngredient = {
  ...bun,
  _id: 'main',
  name: 'Биокотлета',
  type: 'main',
  price: 424,
};

export const sauce: TIngredient = {
  ...bun,
  _id: 'sauce',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 90,
};
