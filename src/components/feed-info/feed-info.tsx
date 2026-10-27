import { selectFeed } from '@selectors/feed-selectors';
import { FeedInfoUI } from '@ui';

import { useSelector } from '@services/store';
import { ORDER_STATUS_DONE, ORDER_STATUS_PENDING } from '@utils/constants';

import type { TOrder } from '@utils-types';

const READY_ORDERS_LIMIT = 20;

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, READY_ORDERS_LIMIT);

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector(selectFeed);
  const readyOrders = getOrders(feed.orders, ORDER_STATUS_DONE);
  const pendingOrders = getOrders(feed.orders, ORDER_STATUS_PENDING);

  return (
    <FeedInfoUI feed={feed} pendingOrders={pendingOrders} readyOrders={readyOrders} />
  );
};
