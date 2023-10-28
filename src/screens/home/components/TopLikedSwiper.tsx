/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import AuthorComponent from '../../../components/AuthorComponent';
import TitleComponent from '../../../components/TitleComponent';
import {appInfos} from '../../../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {Book} from '../../../models/Book';

const TopLikedSwiper = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const {setItem, getItem} = useAsyncStorage(appInfos.localNames.topUpdated);
  const navigation: any = useNavigation();

  useEffect(() => {
    getLikedBooks();
  }, []);

  // get books, story audio and story liked
  const getLikedBooks = async () => {
    const items: any = await getItem();
    setBooks(JSON.parse(items));
    // setIsLoading(true);
    const filter = firestore()
      .collection(appInfos.databaseNames.audios)
      .orderBy('listens')
      .limitToLast(10);

    await filter.get().then(snap => {
      if (!snap.empty) {
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
    });
  };

  const renderCarouselItem = (item: Book) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        alignItems: 'center',
      }}
      onPress={() => navigation.navigate('AudioDetail', {audio: item})}>
      <Image
        source={{uri: item.image}}
        style={{
          width: appInfos.sizes.width - 32,
          height: (appInfos.sizes.width - 32) * 1.3,
          borderRadius: 12,
          resizeMode: 'cover',
        }}
      />
      <View
        style={{
          paddingVertical: 10,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          paddingHorizontal: 16,
        }}>
        <TitleComponent text={item.title} flex={0} size={20} />
        <AuthorComponent authorId={item.authorId} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        marginTop: 20,
      }}>
      {books && books.length > 0 && (
        <Carousel
          height={(appInfos.sizes.width - 32) * 1.4}
          pagingEnabled
          snapEnabled
          mode="parallax"
          autoPlay
          autoPlayInterval={3000}
          width={appInfos.sizes.width}
          data={books}
          renderItem={item => renderCarouselItem(item.item)}
        />
      )}
    </View>
  );
};

export default TopLikedSwiper;
