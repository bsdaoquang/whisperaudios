/** @format */

import {View, Text} from 'react-native';
import React from 'react';
import ButtonComponent from '../../components/ButtonComponent';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {removeUser} from '../../redux/reducers/userReducer';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appInfos} from '../../constants/appInfos';

const Profile = () => {
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    await GoogleSignin.signOut();
    await auth()
      .signOut()
      .then(async () => {
        await AsyncStorage.removeItem(appInfos.localNames.uid);
        dispatch(removeUser({}));
      });
  };
  return (
    <View>
      <Text>Profile</Text>
      <ButtonComponent text="Logout" onPress={handleSignOut} />
    </View>
  );
};

export default Profile;
