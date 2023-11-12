/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';
import {FlatList, Image, View} from 'react-native';
import Container from '../../components/Container';
import RatingComponent from '../../components/RatingComponent';
import {RowComponent} from '../../components/RowComponent';
import TitleComponent from '../../components/TitleComponent';
import {appInfos} from '../../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {i18n} from '../../languages/i18n';
import {Author} from '../../models';
import FastImage from 'react-native-fast-image';

const AuthorsScreen = ({navigation}: any) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const {getItem, setItem} = useAsyncStorage(appInfos.localNames.authors);

  useEffect(() => {
    getAuthors();
  }, []);

  const getAuthors = async () => {
    const items: any = await getItem();
    setAuthors(JSON.parse(items));
    await firestore()
      .collection(appInfos.databaseNames.authors)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Authors not found');
        } else {
          const items: Author[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });

          setItem(
            JSON.stringify(items.sort((a, b) => a.name.localeCompare(b.name))),
          );
          setAuthors(items.sort((a, b) => a.name.localeCompare(b.name)));
        }
      });
  };

  const renderAuthorItem = (item: Author) => (
    <RowComponent
      onPress={() => navigation.navigate('AuthorDetail', {author: item})}
      key={item.key}
      styles={{
        paddingBottom: 16,
        marginHorizontal: 16,
      }}>
      <FastImage
        source={
          item.image
            ? {uri: item.image}
            : require('../../../assets/images/default-avatar.webp')
        }
        style={{
          width: 40,
          height: 40,
          borderRadius: 100,
        }}
      />
      <View style={{flex: 1, marginLeft: 12, alignItems: 'flex-start'}}>
        <TitleComponent text={item.name} />
        <RatingComponent count={0} />
      </View>
    </RowComponent>
  );

  return (
    <Container back title={i18n.t('author')}>
      {authors && authors.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          data={authors}
          renderItem={({item}) => renderAuthorItem(item)}
        />
      )}
    </Container>
  );
};

export default AuthorsScreen;
