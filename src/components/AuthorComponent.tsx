/** @format */

import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Author} from '../models';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {RowComponent} from './RowComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';
import RatingComponent from './RatingComponent';
import {appColors} from '../constants/appColors';
import FastImage from 'react-native-fast-image';

interface Props {
  authorId?: string;
  onPress?: () => void;
  author?: Author;
}

const AuthorComponent = (props: Props) => {
  const {authorId, onPress, author} = props;

  const [authorDetail, setAuthorDetail] = useState<Author | undefined>(author);

  useEffect(() => {
    authorId && getAuthorDetail();
  }, [authorId]);

  const getAuthorDetail = async () => {
    await firestore()
      .collection(appInfos.databaseNames.authors)
      .doc(authorId)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setAuthorDetail({
            key: authorId,
            ...snap.data(),
          });
        }
      });
  };

  return authorDetail ? (
    <>
      {authorId && (
        <RowComponent>
          <TextComponent text={authorDetail.name} color={appColors.gray7} />
        </RowComponent>
      )}
      {author && (
        <RowComponent
          onPress={onPress}
          styles={{marginBottom: 16, paddingHorizontal: 16}}>
          <FastImage
            source={
              authorDetail.image
                ? {uri: authorDetail.image}
                : require('../../assets/images/default-avatar.webp')
            }
            style={{
              width: 50,
              height: 50,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={{marginLeft: 12, flex: 1, alignItems: 'flex-start'}}>
            <TitleComponent text={authorDetail.name} />
            <RatingComponent count={5} />
          </View>
        </RowComponent>
      )}
    </>
  ) : (
    <></>
  );
};

export default AuthorComponent;
