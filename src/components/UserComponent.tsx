/** @format */

import React, {useEffect, useState} from 'react';
import {Alert, Image, TouchableOpacity, View} from 'react-native';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {UserModel} from '../models';
import FastImage from 'react-native-fast-image';
import {RowComponent} from './RowComponent';
import TitleComponent from './TitleComponent';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';
import {Text} from 'react-native-svg';

interface Props {
  uid: string;
  size?: number;
  isTitle?: boolean;
}

const UserComponent = (props: Props) => {
  const {uid, size, isTitle} = props;

  const [profile, setProfile] = useState<UserModel>();

  useEffect(() => {
    firestore()
      .collection(appInfos.databaseNames.users)
      .doc(uid)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setProfile({
            uid,
            ...snap.data(),
          });
        } else {
          console.log('user not found');
        }
      });
  }, [uid]);

  return isTitle ? (
    <RowComponent styles={{justifyContent: 'flex-start'}}>
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
      <View style={{flex: 1, paddingHorizontal: 8}}>
        <TitleComponent
          text={
            profile
              ? profile.displayName
                ? profile.displayName
                : profile.email
              : ''
          }
          color={appColors.white}
          flex={0}
        />
        <TextComponent text={`Lever 3`} size={12} color={appColors.white1} />
      </View>
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
