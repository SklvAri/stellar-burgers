import { describe, expect, test } from '@jest/globals';

import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
} from '../constructor-slice';
import { bun, main, sauce } from './fixtures';

import type { TConstructorState } from '@utils-types';

const constructorBun = { ...bun, id: 'bun-instance' };
const firstMain = { ...main, id: 'main-first' };
const secondMain = { ...main, id: 'main-second' };
const constructorSauce = { ...sauce, id: 'sauce-instance' };

const createState = (): TConstructorState => ({
  bun: constructorBun,
  ingredients: [firstMain, constructorSauce, secondMain],
});

describe('Редьюсер burgerConstructor', () => {
  test('возвращает начальное состояние для undefined и неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('сохраняет существующее состояние при неизвестном экшене', () => {
    const state = createState();
    expect(constructorReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });

  describe('addIngredient', () => {
    test('добавляет булку отдельно от начинки', () => {
      const action = addIngredient(bun);
      expect(constructorReducer(undefined, action)).toEqual({
        bun: { ...bun, id: action.payload.id },
        ingredients: [],
      });
    });

    test('заменяет выбранную булку, сохраняя начинки', () => {
      const state = createState();
      const replacement = { ...bun, _id: 'other-bun', name: 'Другая булка' };
      const action = addIngredient(replacement);

      expect(constructorReducer(state, action)).toEqual({
        bun: action.payload,
        ingredients: state.ingredients,
      });
      expect(state.bun).toEqual(constructorBun);
    });

    test.each([main, sauce])(
      'добавляет $type в конец начинки и сохраняет булку',
      (item) => {
        const state = createState();
        const action = addIngredient(item);

        expect(constructorReducer(state, action)).toEqual({
          bun: constructorBun,
          ingredients: [...state.ingredients, action.payload],
        });
        expect(state.ingredients).toEqual([firstMain, constructorSauce, secondMain]);
      }
    );

    test('создаёт разные id для повторных добавлений одного ингредиента', () => {
      const first = addIngredient(main);
      const second = addIngredient(main);
      const state = constructorReducer(constructorReducer(undefined, first), second);

      expect(first.payload.id).toEqual(expect.any(String));
      expect(first.payload.id).not.toBe('');
      expect(first.payload.id).not.toBe(second.payload.id);
      expect(state.ingredients).toEqual([first.payload, second.payload]);
      expect(main).not.toHaveProperty('id');
    });
  });

  describe('removeIngredient', () => {
    test('удаляет только указанный экземпляр ингредиента, сохраняя остальные и булку', () => {
      const state = createState();
      expect(constructorReducer(state, removeIngredient(firstMain.id))).toEqual({
        bun: constructorBun,
        ingredients: [constructorSauce, secondMain],
      });
      expect(state.ingredients).toHaveLength(3);
    });

    test('сохраняет состав при удалении несуществующего id', () => {
      const state = createState();
      expect(constructorReducer(state, removeIngredient('missing'))).toEqual(state);
    });
  });

  describe('moveIngredient', () => {
    test.each([
      { fromIndex: 0, toIndex: 2, expected: [constructorSauce, secondMain, firstMain] },
      { fromIndex: 2, toIndex: 0, expected: [secondMain, firstMain, constructorSauce] },
    ])(
      'перемещает начинку с $fromIndex на $toIndex и сохраняет булку',
      ({ fromIndex, toIndex, expected }) => {
        const state = createState();
        expect(
          constructorReducer(state, moveIngredient({ fromIndex, toIndex }))
        ).toEqual({
          bun: constructorBun,
          ingredients: expected,
        });
        expect(state.ingredients).toEqual([firstMain, constructorSauce, secondMain]);
      }
    );

    test.each([
      { fromIndex: 1, toIndex: 1 },
      { fromIndex: -1, toIndex: 0 },
      { fromIndex: 0, toIndex: -1 },
      { fromIndex: 3, toIndex: 0 },
      { fromIndex: 0, toIndex: 3 },
    ])('сохраняет состояние для индексов $fromIndex и $toIndex', (indexes) => {
      const state = createState();
      expect(constructorReducer(state, moveIngredient(indexes))).toBe(state);
    });

    test('не изменяет пустой конструктор', () => {
      expect(
        constructorReducer(undefined, moveIngredient({ fromIndex: 0, toIndex: 1 }))
      ).toEqual({
        bun: null,
        ingredients: [],
      });
    });
  });

  describe('clearConstructor', () => {
    test('очищает булку и все начинки', () => {
      const state = createState();
      expect(constructorReducer(state, clearConstructor())).toEqual({
        bun: null,
        ingredients: [],
      });
      expect(state).toEqual(createState());
    });

    test('сохраняет пустое состояние при повторной очистке', () => {
      expect(constructorReducer(undefined, clearConstructor())).toEqual({
        bun: null,
        ingredients: [],
      });
    });
  });
});
