/** @format */

import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, useColorScheme} from 'react-native';
import {appInfos} from '../constants/appInfos';
import {Book} from '../models';
import {darkStyles} from '../styles/darkStyles';
import {lightStyles} from '../styles/lightStyles';
import AuthorComponent from './AuthorComponent';
import HeartListenCount from './HeartListenCount';
import {ImageCard} from './ImageCard';
import RatingComponent from './RatingComponent';
import {RowComponent} from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TitleComponent from './TitleComponent';
import {Rating} from '@kolking/react-native-rating';
import TextComponent from './TextComponent';
import {appColors} from '../constants/appColors';

interface Props {
  book: Book;
  color?: string;
  showRating?: boolean;
  isShowAuthor?: boolean;
}

const ListBookItem = (props: Props) => {
  const {book, color, showRating, isShowAuthor} = props;
  const navigation: any = useNavigation();

  const [listenCount, setListenCount] = useState(0);

  const theme = useColorScheme();
  const styleTheme = theme === 'light' ? darkStyles.card : lightStyles.card;

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
      activeOpacity={0.8}
      styles={{
        paddingHorizontal: 16,
        marginBottom: 20,
      }}
      key={book.key}
      onPress={() => navigation.navigate('AudioDetail', {audio: book})}>
      <ImageCard uri={book.image} width={95} height={130} />
      <View
        style={{
          marginLeft: 12,
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <TitleComponent text={book.title} line={2} flex={0} />
        <RatingComponent
          readOnly
          bookId={book.key}
          size={18}
          styles={{marginVertical: 8}}
        />
        <TextComponent
          text={book.description}
          line={3}
          color={appColors.gray}
        />
        <TextComponent
          text={`${book.listens} người nghe`}
          line={1}
          color={appColors.link}
          size={13}
        />
      </View>
    </RowComponent>
  );
};

export default ListBookItem;
