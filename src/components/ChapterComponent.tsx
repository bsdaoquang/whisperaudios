/** @format */

import React, {useEffect, useState} from 'react';
import {Chapter} from '../models/Chapter';
import TextComponent from './TextComponent';

import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {LoadingComponent} from './LoadingComponent';
import {RowComponent} from './RowComponent';

interface Props {
  id: string;
  index?: number;
}

const ChapterComponent = (props: Props) => {
  const {id, index} = props;

  const [chapterInfo, setChapterInfo] = useState<Chapter>();

  useEffect(() => {
    getChapterInfo();
  }, [id]);

  const getChapterInfo = async () => {
    await firestore()
      .collection(appInfos.databaseNames.chapters)
      .doc(id)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setChapterInfo({
            key: id,
            ...snap.data(),
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return chapterInfo ? (
    <TextComponent
      text={
        chapterInfo?.chaps[index ?? chapterInfo.chaps.length - 1].title ?? ''
      }
      size={12}
    />
  ) : (
    <></>
  );
};

export default ChapterComponent;
