/** @format */

import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {i18n} from '../languages/i18n';
import {userSelector} from '../redux/reducers/userReducer';
import TabbarComponent from './TabbarComponent';

import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {Listening} from '../models/Book';
import ListeningCardItem from './ListeningCardItem';
import {RowComponent} from './RowComponent';

const ListeningComponent = () => {
  const user = useSelector(userSelector);

  const [listenings, setListenings] = useState<Listening[]>([]);

  useEffect(() => {
    getListeningAudio();
  }, [user]);

  const getListeningAudio = async () => {
    firestore()
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
