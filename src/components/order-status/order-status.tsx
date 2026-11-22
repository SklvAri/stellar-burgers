import { OrderStatusUI } from '@ui';

import {
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_CREATED,
  ORDER_STATUS_DONE,
  ORDER_STATUS_PENDING,
} from '@utils/constants';

import type { OrderStatusProps } from './type';

const STATUS_DONE_COLOR = '#00CCCC';
const STATUS_PENDING_COLOR = '#E52B1A';
const STATUS_DEFAULT_COLOR = '#F2F2F3';

const STATUS_TEXT: Record<string, string | undefined> = {
  [ORDER_STATUS_CANCELED]: 'Отменён',
  [ORDER_STATUS_CANCELLED]: 'Отменён',
  [ORDER_STATUS_CREATED]: 'Создан',
  [ORDER_STATUS_DONE]: 'Выполнен',
  [ORDER_STATUS_PENDING]: 'Готовится',
};

const STATUS_COLOR: Record<string, string | undefined> = {
  [ORDER_STATUS_CANCELED]: STATUS_DEFAULT_COLOR,
  [ORDER_STATUS_CANCELLED]: STATUS_DEFAULT_COLOR,
  [ORDER_STATUS_CREATED]: STATUS_DEFAULT_COLOR,
  [ORDER_STATUS_DONE]: STATUS_DONE_COLOR,
  [ORDER_STATUS_PENDING]: STATUS_PENDING_COLOR,
};

const UNKNOWN_STATUS_TEXT = 'Неизвестен';
const UNKNOWN_STATUS_COLOR = '#F2F2F3';

export const OrderStatus = ({ status }: OrderStatusProps): React.JSX.Element => (
  <OrderStatusUI
    textStyle={STATUS_COLOR[status] ?? UNKNOWN_STATUS_COLOR}
    text={STATUS_TEXT[status] ?? UNKNOWN_STATUS_TEXT}
  />
);
