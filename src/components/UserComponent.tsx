/** @format */

import React, {useEffect, useState} from 'react';
import {Alert, Image, TouchableOpacity} from 'react-native';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {UserModel} from '../models';

interface Props {
  uid: string;
  size?: number;
}

const UserComponent = (props: Props) => {
  const {uid, size} = props;

  const [profile, setProfile] = useState<UserModel>();

  useEffect(() => {
    getProfileDetail();
  }, [uid]);

  const getProfileDetail = async () => {
    await firestore()
      .collection(appInfos.databaseNames.users)
      .doc(uid)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setProfile({
            uid,
            ...snap.data(),
          });
        } else {
          console.log('user not found');
        }
      });
  };

  return (
    <TouchableOpacity onPress={() => Alert.alert('Login', 'Login request')}>
      <Image
        source={
          profile && profile.photoURL
            ? {uri: profile.photoURL}
            : require('../../assets/images/default-avatar.webp')
        }
        style={{
          width: size ?? 40,
          height: size ?? 40,
          borderRadius: 100,
        }}
      />
    </TouchableOpacity>
  );
};

export default UserComponent;
