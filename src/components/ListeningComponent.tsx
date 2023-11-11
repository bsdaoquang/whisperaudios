/** @format */

import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {userSelector} from '../redux/reducers/userReducer';
import TabbarComponent from './TabbarComponent';
import {i18n} from '../languages/i18n';

import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {RowComponent} from './RowComponent';
import {Listening} from '../models/Book';
import TextComponent from './TextComponent';
import ListeningCardItem from './ListeningCardItem';

const ListeningComponent = () => {
  const user = useSelector(userSelector);

  const [listenings, setListenings] = useState<Listening[]>([]);

  useEffect(() => {
    getListeningAudio();
  }, [user]);

  const getListeningAudio = async () => {
    await firestore()
      .collection(appInfos.databaseNames.listenings)
      .where('uid', '==', user.uid)
      .limit(6)
      .onSnapshot(snap => {
        if (!snap.empty) {
          const items: Listening[] = [];
          snap.forEach((item: any) => {
            item.data().position &&
              items.push({
                key: item.id,
                ...item.data(),
              });
          });

          setListenings(items);
        }
      });
  };

  return user && user.uid && listenings.length > 0 ? (
    <View>
      <TabbarComponent title={i18n.t('listening')} />

      <RowComponent
        styles={{
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        }}>
        {listenings.map(item => (
          <ListeningCardItem item={item} key={item.key} />
        ))}
      </RowComponent>
    </View>
  ) : (
    <></>
  );
};

export default ListeningComponent;
