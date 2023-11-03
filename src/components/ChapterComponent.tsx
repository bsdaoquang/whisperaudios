/** @format */

import React, {useEffect, useState} from 'react';
import {Chapter} from '../models/Chapter';
import TextComponent from './TextComponent';

import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {RowComponent} from './RowComponent';
import {Play} from 'iconsax-react-native';
import {appColors} from '../constants/appColors';

interface Props {
  id: string;
  index?: number;
  isList?: boolean;
}

const ChapterComponent = (props: Props) => {
  const {id, index, isList} = props;

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
      .catch(error => console.log(error));
  };

  return chapterInfo ? (
    isList ? (
      <>
        {chapterInfo.chaps.map((item, index) => (
          <RowComponent
            onPress={() => console.log(item)}
            key={`item${index}`}
            styles={{paddingHorizontal: 16, marginBottom: 12}}>
            <TextComponent text={item.title} flex={1} />
          </RowComponent>
        ))}
      </>
    ) : (
      <TextComponent
        text={
          chapterInfo?.chaps[index ?? chapterInfo.chaps.length - 1].title ?? ''
        }
        size={12}
      />
    )
  ) : (
    <></>
  );
};

export default ChapterComponent;
