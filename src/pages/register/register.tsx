import { selectUserError } from '@selectors/user-selectors';
import { registerUser } from '@slices/user-slice';
import { RegisterUI } from '@ui-pages';
import { useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { SyntheticEvent } from 'react';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const errorText = useSelector(selectUserError) ?? '';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ email, name: userName, password }));
  };

  return (
    <RegisterUI
      email={email}
      errorText={errorText}
      handleSubmit={handleSubmit}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      userName={userName}
    />
  );
};
