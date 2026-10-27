import { createSlice } from '@reduxjs/toolkit';

import { INGREDIENT_TYPE_BUN } from '@utils/constants';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const constructorInitialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  initialState: constructorInitialState,
  name: 'burgerConstructor',
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>): void => {
      const ingredient = action.payload;
      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: crypto.randomUUID(),
      };

      if (ingredient.type === INGREDIENT_TYPE_BUN) {
        state.bun = constructorIngredient;
        return;
      }

      state.ingredients.push(constructorIngredient);
    },
    clearConstructor: (state): void => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ): void => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.ingredients;

      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= ingredients.length ||
        toIndex >= ingredients.length
      ) {
        return;
      }

      const [movedIngredient] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedIngredient);
    },
    removeIngredient: (state, action: PayloadAction<string>): void => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addIngredient, clearConstructor, moveIngredient, removeIngredient } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
