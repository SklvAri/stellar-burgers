import { selectUserError } from '@selectors/user-selectors';
import { loginUser } from '@slices/user-slice';
import { LoginUI } from '@ui-pages';
import { useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { SyntheticEvent } from 'react';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const errorText = useSelector(selectUserError) ?? '';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      email={email}
      errorText={errorText}
      handleSubmit={handleSubmit}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
    />
  );
};
