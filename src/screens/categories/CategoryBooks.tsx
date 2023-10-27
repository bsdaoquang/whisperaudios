/** @format */

import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Container from '../../components/Container';
import {LoadingComponent} from '../../components/LoadingComponent';
import RenderBookItem from '../../components/RenderBookItem';
import {appInfos} from '../../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {Book} from '../../models';

const CategoryBooks = ({navigation, route}: any) => {
  const {id, title}: {id: string; title: string} = route.params;

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    id && getBooksByCategoryId();
  }, [id]);

  const getBooksByCategoryId = async () => {
    const filter = firestore()
      .collection(appInfos.databaseNames.audios)
      .where('categories', 'array-contains', id);

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
    <Container title={title} back>
      {books.length > 0 ? (
        <FlatList
          data={books}
          numColumns={2}
          renderItem={({item}) => <RenderBookItem item={item} key={item.key} />}
        />
      ) : (
        <LoadingComponent isLoading={isLoading} value={books.length} />
      )}
    </Container>
  );
};

export default CategoryBooks;
