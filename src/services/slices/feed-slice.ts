import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TFeedState, TOrder } from '@utils-types';

type TFeedSliceState = TFeedState & {
  currentOrder: TOrder | null;
  isUserOrdersLoading: boolean;
  userOrders: TOrder[];
};

const feedInitialState: TFeedSliceState = {
  currentOrder: null,
  error: null,
  isLoading: false,
  isUserOrdersLoading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  userOrders: [],
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', getFeedsApi);

export const fetchUserOrders = createAsyncThunk('feed/fetchUserOrders', getOrdersApi);

export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number): Promise<TOrder | null> => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0] ?? null;
  }
);

const feedSlice = createSlice({
  extraReducers: (builder): void => {
    builder
      .addCase(fetchFeeds.pending, (state): void => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action): void => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action): void => {
        state.error = action.error.message ?? 'Не удалось загрузить ленту заказов';
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.pending, (state): void => {
        state.isUserOrdersLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action): void => {
        state.isUserOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state): void => {
        state.isUserOrdersLoading = false;
      })
      .addCase(fetchOrderByNumber.pending, (state): void => {
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action): void => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state): void => {
        state.currentOrder = null;
      });
  },
  initialState: feedInitialState,
  name: 'feed',
  reducers: {},
});

export const feedReducer = feedSlice.reducer;
