import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
} from '@selectors/ingredients-selectors';
import { selectIsAuthChecked } from '@selectors/user-selectors';
import { fetchIngredients } from '@slices/ingredients-slice';
import { checkUserAuth } from '@slices/user-slice';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import { padOrderNumber, ROUTES } from '@utils/constants';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        error={ingredientsError}
        ingredients={ingredients}
        isAuthChecked={isAuthChecked}
        isLoading={isIngredientsLoading}
      />
    </div>
  );
};

export default App;

const AppContent = ({
  ingredients,
  isAuthChecked,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading || !isAuthChecked) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const IngredientPage = (): React.JSX.Element => (
  <div className={styles.detailPageWrap}>
    <p className={`${styles.detailHeader} text text_type_main-large`}>
      Детали ингредиента
    </p>
    <IngredientDetails />
  </div>
);

const OrderPage = (): React.JSX.Element => {
  const { number } = useParams();

  return (
    <div className={styles.detailPageWrap}>
      <p className={`${styles.detailHeader} text text_type_digits-default`}>
        {padOrderNumber(number ?? '')}
      </p>
      <OrderInfo />
    </div>
  );
};

const IngredientModal = (): React.JSX.Element => {
  const navigate = useNavigate();

  const handleClose = (): void => {
    void navigate(-1);
  };

  return (
    <Modal onClose={handleClose} title="Детали ингредиента">
      <IngredientDetails />
    </Modal>
  );
};

const OrderModal = (): React.JSX.Element => {
  const { number } = useParams();
  const navigate = useNavigate();

  const handleClose = (): void => {
    void navigate(-1);
  };

  return (
    <Modal onClose={handleClose} title={padOrderNumber(number ?? '')}>
      <OrderInfo />
    </Modal>
  );
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const background = (location.state as TLocationState | null)?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route element={<ConstructorPage />} path={ROUTES.constructor} />
        <Route element={<Feed />} path={ROUTES.feed} />
        <Route element={<OrderPage />} path={ROUTES.feedOrder} />
        <Route element={<IngredientPage />} path={ROUTES.ingredient} />
        <Route
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
          path={ROUTES.login}
        />
        <Route
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
          path={ROUTES.register}
        />
        <Route
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
          path={ROUTES.forgotPassword}
        />
        <Route
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
          path={ROUTES.resetPassword}
        />
        <Route
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          path={ROUTES.profile}
        />
        <Route
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
          path={ROUTES.profileOrders}
        />
        <Route
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
          path={ROUTES.profileOrder}
        />
        <Route element={<NotFound404 />} path="*" />
      </Routes>
      {background && (
        <Routes>
          <Route element={<OrderModal />} path={ROUTES.feedOrder} />
          <Route element={<IngredientModal />} path={ROUTES.ingredient} />
          <Route
            element={
              <ProtectedRoute>
                <OrderModal />
              </ProtectedRoute>
            }
            path={ROUTES.profileOrder}
          />
        </Routes>
      )}
    </>
  );
};
