/** @format */

import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, useColorScheme} from 'react-native';
import {Book} from '../models';
import {darkStyles} from '../styles/darkStyles';
import {globalStyles} from '../styles/globalStyles';
import {lightStyles} from '../styles/lightStyles';
import AuthorComponent from './AuthorComponent';
import HeartListenCount from './HeartListenCount';
import {ImageCard} from './ImageCard';
import RatingComponent from './RatingComponent';
import {RowComponent} from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TitleComponent from './TitleComponent';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';

interface Props {
  book: Book;
  color?: string;
  showRating?: boolean;
}

const ListBookItem = (props: Props) => {
  const {book, color, showRating} = props;
  const navigation: any = useNavigation();

  const [listenCount, setListenCount] = useState(0);

  const theme = useColorScheme();
  const styleTheme = theme === 'dark' ? darkStyles.card : lightStyles.card;

  useEffect(() => {
    getListeningCount();
  }, [book]);

  const getListeningCount = () => {
    firestore()
      .collection(appInfos.databaseNames.listenings)
      .where('audioId', '==', book.key)
      .onSnapshot(snap => {
        if (!snap.empty) {
          setListenCount(snap.size);
        }
      });
  };

  return (
    <RowComponent
      key={book.key}
      onPress={() => navigation.navigate('AudioDetail', {audio: book})}
      styles={[globalStyles.card, styleTheme]}>
      <RowComponent
        styles={{
          alignItems: 'flex-start',
        }}>
        <ImageCard uri={book.image} width={50} height={70} />
        <View
          style={{
            marginHorizontal: 8,
            flex: 1,
            alignItems: 'flex-start',
          }}>
          <TitleComponent text={book.title} line={2} flex={0} />
          {showRating && (
            <RatingComponent readOnly count={5} bookId={book.key} />
          )}
          <RowComponent
            styles={{justifyContent: 'flex-start', flexWrap: 'wrap'}}>
            <AuthorComponent authorId={book.authorId} />
            <SpaceComponent width={8} />
          </RowComponent>
          <SpaceComponent height={8} />
          <HeartListenCount
            liked={book.liked}
            listen={listenCount}
            type={book.type}
            chaps={book.totalChaps}
          />
        </View>
      </RowComponent>
    </RowComponent>
  );
};

export default ListBookItem;
