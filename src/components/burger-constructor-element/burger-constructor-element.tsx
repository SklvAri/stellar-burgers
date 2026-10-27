import { moveIngredient, removeIngredient } from '@slices/constructor-slice';
import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import { useDispatch } from '@services/store';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
  };

  const handleMoveUp = (): void => {
    dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      handleClose={handleClose}
      handleMoveDown={handleMoveDown}
      handleMoveUp={handleMoveUp}
      index={index}
      ingredient={ingredient}
      totalItems={totalItems}
    />
  );
});
