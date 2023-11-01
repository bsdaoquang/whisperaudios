/** @format */

import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {StyleProp, TextStyle, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {appColors} from '../constants/appColors';
import {appInfos} from '../constants/appInfos';
import {Author} from '../models';
import RatingComponent from './RatingComponent';
import {RowComponent} from './RowComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';

interface Props {
  authorId?: string;
  onPress?: () => void;
  author?: Author;
  textStyle?: StyleProp<TextStyle>;
}

const AuthorComponent = (props: Props) => {
  const {authorId, onPress, author, textStyle} = props;

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
        <RowComponent onPress={onPress ? () => onPress() : undefined}>
          <TextComponent
            styles={[textStyle]}
            text={authorDetail.name}
            color={appColors.gray7}
          />
        </RowComponent>
      )}
      {author && (
        <RowComponent
          onPress={onPress}
          styles={{marginBottom: 16, paddingHorizontal: 16}}
        >
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
