import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_STORAGE_KEY } from '@utils/constants';
import { deleteCookie, getCookie, setCookie } from '@utils/cookie';

import type { TLoginData, TRegisterData } from '@api';
import type { TUser } from '@utils-types';

type TUserState = {
  error: string | null;
  isAuthChecked: boolean;
  user: TUser | null;
};

const userInitialState: TUserState = {
  error: null,
  isAuthChecked: false,
  user: null,
};

const saveTokens = (accessToken: string, refreshToken: string): void => {
  setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
};

const clearTokens = (): void => {
  deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
  localStorage.clear();
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData): Promise<TUser> => {
    const response = await registerUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData): Promise<TUser> => {
    const response = await loginUserApi(data);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (): Promise<void> => {
    await logoutApi();
    clearTokens();
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>): Promise<TUser> => {
    const data = await updateUserApi(user);
    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (): Promise<TUser | null> => {
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);

    if (!accessToken) {
      return null;
    }

    const data = await getUserApi();
    return data.user;
  }
);

const userSlice = createSlice({
  extraReducers: (builder): void => {
    builder
      .addCase(registerUser.pending, (state): void => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action): void => {
        state.error = null;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action): void => {
        state.error = action.error.message ?? 'Не удалось зарегистрироваться';
      })
      .addCase(loginUser.pending, (state): void => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action): void => {
        state.error = null;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action): void => {
        state.error = action.error.message ?? 'Не удалось войти';
      })
      .addCase(logoutUser.fulfilled, (state): void => {
        state.error = null;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action): void => {
        state.error = action.error.message ?? 'Не удалось выйти';
      })
      .addCase(updateUser.pending, (state): void => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action): void => {
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action): void => {
        state.error = action.error.message ?? 'Не удалось обновить данные пользователя';
      })
      .addCase(checkUserAuth.fulfilled, (state, action): void => {
        state.error = null;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state): void => {
        state.isAuthChecked = true;
        state.user = null;
      });
  },
  initialState: userInitialState,
  name: 'user',
  reducers: {},
});

export const userReducer = userSlice.reducer;
