import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const ingredientsInitialState: TIngredientsState = {
  error: null,
  ingredients: [],
  isLoading: false,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  extraReducers: (builder): void => {
    builder
      .addCase(fetchIngredients.pending, (state): void => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action): void => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action): void => {
        state.error = action.error;
        state.isLoading = false;
      });
  },
  initialState: ingredientsInitialState,
  name: 'ingredients',
  reducers: {},
});

export const ingredientsReducer = ingredientsSlice.reducer;
