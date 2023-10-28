/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {Book} from '../models';
import {GetTime} from '../utils/getTime';
import ChapterComponent from './ChapterComponent';
import {RowComponent} from './RowComponent';
import SectionComponent from './SectionComponent';
import SpaceComponent from './SpaceComponent';
import TabbarComponent from './TabbarComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';

const LatestBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const {setItem, getItem} = useAsyncStorage(appInfos.localNames.latestBooks);

  const navigation: any = useNavigation();

  useEffect(() => {
    getNewBooks();
  }, []);

  const getNewBooks = async () => {
    const items: any = await getItem();
    setBooks(JSON.parse(items));

    const filter = firestore()
      .collection(appInfos.databaseNames.audios)
      .orderBy('updatedAt')
      .limitToLast(10);

    await filter
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Books not found');
        } else {
          const items: Book[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });
          setItem(JSON.stringify(items));
          setBooks(items);
        }
      })
      .catch(error => {
        console.log('Can not get books');
      });
  };

  const renderBook = (item: Book) => (
    <RowComponent
      onPress={() => navigation.navigate('AudioDetail', {audio: item})}
      key={item.key}
      styles={{
        marginBottom: 24,
      }}>
      <Image
        source={{uri: item.image}}
        style={{
          width: 70,
          height: 70,
          borderRadius: 8,
        }}
      />
      <View
        style={{
          flex: 1,
          paddingLeft: 12,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          height: '100%',
        }}>
        <TitleComponent text={item.title} size={16} flex={0} />

        <ChapterComponent id={item.chapsId} key="title" />
        <TextComponent
          text={GetTime.getFullTimeString(item.updatedAt)}
          size={12}
        />
        <SpaceComponent height={8} />
        <TextComponent
          size={12}
          text={`${item.status === 'Full' ? 'Hoàn thành' : 'Đang cập nhật'}`}
        />
      </View>
    </RowComponent>
  );

  return (
    <View>
      <TabbarComponent
        title="Mới cập nhật"
        seemore
        onPress={() => navigation.navigate('NewBooks', {keyTab: 'updatedAt'})}
      />
      {books && books.length > 0 && (
        <SectionComponent>
          {books.map(item => renderBook(item))}
        </SectionComponent>
      )}
    </View>
  );
};

export default LatestBooks;
