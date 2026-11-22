import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';

export type AppContentProps = {
  ingredients: TIngredient[];
  isAuthChecked: boolean;
  isLoading: boolean;
  error: SerializedError | null;
};
