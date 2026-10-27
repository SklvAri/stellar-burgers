import { selectUser, selectUserError } from '@selectors/user-selectors';
import { updateUser } from '@slices/user-slice';
import { ProfileUI } from '@ui-pages';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { SyntheticEvent } from 'react';

const emptyUser = {
  email: '',
  name: '',
};

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser) ?? emptyUser;
  const updateUserError = useSelector(selectUserError) ?? undefined;

  const [formValue, setFormValue] = useState({
    email: user.email,
    name: user.name,
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      email: user.email,
      name: user.name,
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(
      updateUser({
        email: formValue.email,
        name: formValue.name,
        ...(formValue.password ? { password: formValue.password } : {}),
      })
    ).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue((prevState) => ({
          ...prevState,
          password: '',
        }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      email: user.email,
      name: user.name,
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
    />
  );
};
