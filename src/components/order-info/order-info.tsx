import {
  selectCurrentOrder,
  selectFeedOrders,
  selectUserOrders,
} from '@selectors/feed-selectors';
import { selectIngredients } from '@selectors/ingredients-selectors';
import { fetchOrderByNumber } from '@slices/feed-slice';
import { OrderInfoUI, Preloader } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const orderNumber = Number(number);
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const ingredients = useSelector(selectIngredients);

  const orderData =
    orders.find((order) => order.number === orderNumber) ??
    userOrders.find((order) => order.number === orderNumber) ??
    (currentOrder?.number === orderNumber ? currentOrder : null);

  useEffect(() => {
    if (!orderData && orderNumber) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      date,
      ingredientsInfo,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
