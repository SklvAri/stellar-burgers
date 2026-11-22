import { describe, expect, test } from '@jest/globals';

import { fetchIngredients, ingredientsReducer } from '../ingredients-slice';
import { bun, main, sauce } from './fixtures';

describe('Редьюсер ingredients', () => {
  test('возвращает начальное состояние для undefined и неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('сохраняет существующее состояние при неизвестном экшене', () => {
    const state = { ingredients: [bun], isLoading: false, error: null };
    expect(ingredientsReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });

  test('pending включает загрузку, сбрасывает прошлую ошибку и сохраняет ингредиенты', () => {
    const state = {
      ingredients: [bun],
      isLoading: false,
      error: { message: 'Предыдущая ошибка' },
    };
    const result = ingredientsReducer(state, fetchIngredients.pending('request-id'));

    expect(result).toEqual({ ingredients: [bun], isLoading: true, error: null });
    expect(state.error).toEqual({ message: 'Предыдущая ошибка' });
    expect(state.isLoading).toBe(false);
  });

  test('fulfilled заменяет ингредиенты ответом сервера и завершает загрузку', () => {
    const state = { ingredients: [bun], isLoading: true, error: null };
    const result = ingredientsReducer(
      state,
      fetchIngredients.fulfilled([main, sauce], 'request-id')
    );

    expect(result).toEqual({
      ingredients: [main, sauce],
      isLoading: false,
      error: null,
    });
    expect(state.ingredients).toEqual([bun]);
    expect(state.isLoading).toBe(true);
  });

  test('fulfilled поддерживает пустой список ингредиентов', () => {
    expect(
      ingredientsReducer(
        { ingredients: [bun], isLoading: true, error: null },
        fetchIngredients.fulfilled([], 'request-id')
      )
    ).toEqual({ ingredients: [], isLoading: false, error: null });
  });

  test('rejected сохраняет ошибку, завершает загрузку и сохраняет ингредиенты', () => {
    const state = { ingredients: [bun], isLoading: true, error: null };
    const action = fetchIngredients.rejected(
      new Error('Сервер недоступен'),
      'request-id'
    );

    expect(ingredientsReducer(state, action)).toEqual({
      ingredients: [bun],
      isLoading: false,
      error: action.error,
    });
    expect(state).toEqual({ ingredients: [bun], isLoading: true, error: null });
  });
});
