/** @format */

import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {userSelector} from '../redux/reducers/userReducer';
import TabbarComponent from './TabbarComponent';
import {i18n} from '../languages/i18n';

import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';

const ListeningComponent = () => {
  const user = useSelector(userSelector);

  useEffect(() => {
    if (user && user.uid) {
      getListeningAudio();
    }
  }, [user]);

  const getListeningAudio = async () => {
    await firestore()
      .collection(appInfos.databaseNames.users)
      .doc(user.id)
      .get()
      .then(snap => {
        if (snap.exists) {
          console.log(snap.data());
        }
      });
  };
  return user && user.uid ? (
    <View>
      <TabbarComponent title={i18n.t('listening')} />
    </View>
  ) : (
    <></>
  );
};

export default ListeningComponent;
