/** @format */

import {useNavigation} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {Book} from '../models';
import {RowComponent} from './RowComponent';
import TitleComponent from './TitleComponent';

interface Props {
  id: string;
  type: 'title';
}

const BookComponent = (props: Props) => {
  const {id, type} = props;

  const [bookDetail, setBookDetail] = useState<Book>();

  const navigation: any = useNavigation();

  useEffect(() => {
    getBookDetailById();
  }, [id]);

  const getBookDetailById = async () => {
    await firestore()
      .collection(appInfos.databaseNames.audios)
      .doc(id)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setBookDetail({
            key: id,
            ...snap.data(),
          });
        } else {
          console.log(`Book not found`);
        }
      });
  };

  let content = <></>;

  switch (type) {
    case 'title':
      content = (
        <RowComponent
          onPress={() =>
            navigation.navigate('AudioDetail', {audio: bookDetail})
          }>
          <TitleComponent text={bookDetail?.title ?? ''} />
        </RowComponent>
      );
      break;
  }

  return content;
};

export default BookComponent;
