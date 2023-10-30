/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {Author} from '../models';
import {globalStyles} from '../styles/globalStyles';
import TabbarComponent from './TabbarComponent';
import TextComponent from './TextComponent';
import FastImage from 'react-native-fast-image';

const TopAuthorBooks = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const {getItem, setItem} = useAsyncStorage(appInfos.localNames.topAuthors);

  useEffect(() => {
    getAllAuthors();
  }, []);
  // get 10 authors ramdom
  const getAllAuthors = async () => {
    const items: any = await getItem();
    setAuthors(JSON.parse(items));
    const filter = firestore()
      .collection(appInfos.databaseNames.authors)
      .limit(10);

    await filter
      .get()
      .then(async snap => {
        if (!snap.empty) {
          const items: Author[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });
          await setItem(JSON.stringify(items));
          setAuthors(items);
        } else {
        }
      })
      .catch(error => console.log(error));
  };

  const navigation: any = useNavigation();

  return (
    <View>
      <TabbarComponent
        title="Tác giả"
        seemore
        onPress={() => navigation.navigate('AuthorsScreen')}
      />

      {authors && authors.length > 0 && (
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={authors}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                globalStyles.center,
                {
                  paddingLeft: 16,
                  maxWidth: 120,
                },
              ]}
              onPress={() =>
                navigation.navigate('AuthorDetail', {author: item})
              }>
              <FastImage
                source={{
                  uri: item.image ? item.image : appInfos.avatarDefault,
                }}
                style={{
                  width: 60,
                  height: 60,
                  marginBottom: 8,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <TextComponent text={item.name} line={1} />
            </TouchableOpacity>
          )}
          horizontal
        />
      )}
    </View>
  );
};

export default TopAuthorBooks;
