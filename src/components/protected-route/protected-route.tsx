import { selectIsAuthChecked, selectUser } from '@selectors/user-selectors';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';
import { ROUTES } from '@utils/constants';

import type { Location } from 'react-router-dom';

type TProtectedRouteProps = {
  children: React.JSX.Element;
  onlyUnAuth?: boolean;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as TLocationState | null)?.from ?? {
      pathname: ROUTES.constructor,
    };

    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace state={{ from: location }} to={ROUTES.login} />;
  }

  return children;
};
