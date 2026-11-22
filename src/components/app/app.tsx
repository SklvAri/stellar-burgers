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
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import { ROUTES } from '@utils/constants';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const EMPTY_MODAL_TITLE = '';

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

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as TLocationState | null)?.background;

  const handleModalClose = (): void => {
    void navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route element={<ConstructorPage />} path={ROUTES.constructor} />
        <Route element={<Feed />} path={ROUTES.feed} />
        <Route
          element={
            <div className={styles.detailPageWrap}>
              <OrderInfo />
            </div>
          }
          path={ROUTES.feedOrder}
        />
        <Route
          element={
            <div className={styles.detailPageWrap}>
              <IngredientDetails />
            </div>
          }
          path={ROUTES.ingredient}
        />
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
              <div className={styles.detailPageWrap}>
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
          path={ROUTES.profileOrder}
        />
        <Route element={<NotFound404 />} path="*" />
      </Routes>
      {background && (
        <Routes>
          <Route
            element={
              <Modal onClose={handleModalClose} title={EMPTY_MODAL_TITLE}>
                <OrderInfo />
              </Modal>
            }
            path={ROUTES.feedOrder}
          />
          <Route
            element={
              <Modal onClose={handleModalClose} title={EMPTY_MODAL_TITLE}>
                <IngredientDetails />
              </Modal>
            }
            path={ROUTES.ingredient}
          />
          <Route
            element={
              <ProtectedRoute>
                <Modal onClose={handleModalClose} title={EMPTY_MODAL_TITLE}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
            path={ROUTES.profileOrder}
          />
        </Routes>
      )}
    </>
  );
};
