import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { clearConstructor } from './constructor-slice';
import { fetchFeeds } from './feed-slice';

import type { TOrder } from '@utils-types';

type TOrderState = {
  isLoading: boolean;
  order: TOrder | null;
};

const orderInitialState: TOrderState = {
  isLoading: false,
  order: null,
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[], { dispatch }): Promise<TOrder> => {
    const data = await orderBurgerApi(ingredientIds);
    dispatch(clearConstructor());
    void dispatch(fetchFeeds());
    return data.order;
  }
);

const orderSlice = createSlice({
  extraReducers: (builder): void => {
    builder
      .addCase(createOrder.pending, (state): void => {
        state.isLoading = true;
        state.order = null;
      })
      .addCase(createOrder.fulfilled, (state, action): void => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state): void => {
        state.isLoading = false;
      });
  },
  initialState: orderInitialState,
  name: 'order',
  reducers: {
    resetOrder: (state): void => {
      state.isLoading = false;
      state.order = null;
    },
  },
});

export const { resetOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
