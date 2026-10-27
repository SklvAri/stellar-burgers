import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import { ROUTES } from '@utils/constants';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

const INGREDIENTS_PATH_PREFIX = '/ingredients';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const location = useLocation();
  const isIngredientsPath = location.pathname.startsWith(INGREDIENTS_PATH_PREFIX);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            className={({ isActive }): string =>
              clsx(styles.link, (isActive || isIngredientsPath) && styles.link_active)
            }
            end
            to={ROUTES.constructor}
          >
            {({ isActive }): React.JSX.Element => {
              const isLinkActive = isActive || isIngredientsPath;

              return (
                <>
                  <BurgerIcon type={isLinkActive ? 'primary' : 'secondary'} />
                  <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
                </>
              );
            }}
          </NavLink>
          <NavLink
            className={({ isActive }): string =>
              clsx(styles.link, isActive && styles.link_active)
            }
            to={ROUTES.feed}
          >
            {({ isActive }): React.JSX.Element => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <NavLink className={styles.logo} to={ROUTES.constructor}>
          <Logo className="" />
        </NavLink>
        <div className={styles.link_position_last}>
          <NavLink
            className={({ isActive }): string =>
              clsx(styles.link, isActive && styles.link_active)
            }
            to={ROUTES.profile}
          >
            {({ isActive }): React.JSX.Element => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">
                  {userName ?? 'Личный кабинет'}
                </p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
