/** @format */

import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Container from '../../components/Container';
import ListBookItem from '../../components/ListBookItem';
import {LoadingComponent} from '../../components/LoadingComponent';
import {appInfos} from '../../constants/appInfos';
import {Book} from '../../models';

const BooksByAuthor = ({navigation, route}: any) => {
  const {authorId, title}: {authorId: string; title: string} = route.params;
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getBooksByAuthorId();
  }, [authorId]);

  const getBooksByAuthorId = async () => {
    const filter = firestore()
      .collection(appInfos.databaseNames.audios)
      .where('authorId', '==', authorId);

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
    <Container back title={title}>
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

export default BooksByAuthor;
