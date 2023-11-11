/** @format */

import React, {useEffect, useState} from 'react';
import {Alert, Image, TouchableOpacity} from 'react-native';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {UserModel} from '../models';
import FastImage from 'react-native-fast-image';
import {RowComponent} from './RowComponent';
import TitleComponent from './TitleComponent';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';

interface Props {
  uid: string;
  size?: number;
  isTitle?: boolean;
}

const UserComponent = (props: Props) => {
  const {uid, size, isTitle} = props;

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

  return isTitle ? (
    <RowComponent>
      <FastImage
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
      <TitleComponent
        text={
          profile
            ? profile.displayName
              ? profile.displayName
              : profile.email
            : ''
        }
        color={appColors.white}
        flex={1}
        styles={{paddingHorizontal: 8}}
      />
    </RowComponent>
  ) : (
    <TouchableOpacity onPress={() => Alert.alert('Login', 'Login request')}>
      <FastImage
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
