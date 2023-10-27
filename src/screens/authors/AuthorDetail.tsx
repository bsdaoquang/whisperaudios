/** @format */

import React, {useEffect, useState} from 'react';
import {FlatList, Image, View} from 'react-native';
import {useSelector} from 'react-redux';
import ButtonComponent from '../../components/ButtonComponent';
import Container from '../../components/Container';
import ListBookItem from '../../components/ListBookItem';
import {LoadingComponent} from '../../components/LoadingComponent';
import RatingComponent from '../../components/RatingComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TitleComponent from '../../components/TitleComponent';
import {appInfos} from '../../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {i18n} from '../../languages/i18n';
import {Author, Book} from '../../models';
import {userSelector} from '../../redux/reducers/userReducer';

const AuthorDetail = ({navigation, route}: any) => {
  const {author}: {author: Author} = route.params;
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useSelector(userSelector);

  useEffect(() => {
    getBooksByAuthorId();
  }, [author]);

  const getBooksByAuthorId = async () => {
    const filter = firestore()
      .collection(appInfos.databaseNames.audios)
      .where('authorId', '==', author.key);

    setIsLoading(true);
    await filter.get().then(snap => {
      if (snap.empty) {
        console.log('Books not found');
        setIsLoading(false);
      } else {
        const items: Book[] = [];
        snap.forEach((item: any) => {
          items.push({
            key: item.id,
            ...item.data(),
          });
        });

        setBooks(items);
        setIsLoading(false);
      }
    });
  };

  return (
    <Container back title={author.name}>
      <SectionComponent>
        <RowComponent>
          <Image
            source={
              author.image
                ? {uri: author.image}
                : require('../../../assets/images/default-avatar.webp')
            }
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
            }}
          />
          <View
            style={{
              flex: 1,
              marginHorizontal: 12,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              height: '100%',
            }}>
            <TitleComponent text={author.name} size={20} flex={0} />
            <RatingComponent count={5} size={20} />
            <ButtonComponent
              text={i18n.t('follow')}
              onPress={() => {}}
              bordered
              width={'50%'}
            />
          </View>
        </RowComponent>
      </SectionComponent>
      {books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={({item}) => <ListBookItem book={item} key={item.key} />}
        />
      ) : (
        <LoadingComponent isLoading={isLoading} value={books.length} />
      )}
    </Container>
  );
};

export default AuthorDetail;
