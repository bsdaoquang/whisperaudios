/** @format */

import auth from '@react-native-firebase/auth';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {addUser} from '../redux/reducers/userReducer';
import MainNavigator from './MainNavigator';

const Router = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      user &&
        dispatch(
          addUser({
            displayName: user.displayName
              ? user.displayName
              : user.email
              ? user.email.split('@')[0]
              : '',
            email: user.email ?? '',
            mota: '',
            phoneNumber: user.phoneNumber ?? '',
            photoURL: user.photoURL ?? '',
            emailVerified: user.emailVerified,
            uid: user.uid,
          }),
        );
    });
  }, []);

  return <MainNavigator />;
};

export default Router;
