/** @format */

import auth from '@react-native-firebase/auth';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {addUser} from '../redux/reducers/userReducer';
import MainNavigator from './MainNavigator';
import {handleAuthentication} from '../utils/handleAuthentication';

const Router = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      user && handleAuthentication.UpdateUser(user, dispatch);
    });
  }, []);

  return <MainNavigator />;
};

export default Router;
