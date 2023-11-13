/** @format */

import React from 'react';
import {Image, TouchableOpacity, View, useColorScheme} from 'react-native';
import {appColors} from '../constants/appColors';
import {appInfos} from '../constants/appInfos';
import {fontFamilies} from '../constants/fontFamilies';
import {Book} from '../models';
import AuthorComponent from './AuthorComponent';
import RatingComponent from './RatingComponent';
import TextComponent from './TextComponent';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  item: Book;
}

const RenderBookItem = (props: Props) => {
  const {item} = props;

  const width = (appInfos.sizes.width - 48) / 2;
  const theme = useColorScheme();
  const navigation: any = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AudioDetail', {audio: item})}
      style={[
        globalStyles.shadow,
        {
          width,
          marginLeft: 16,
          marginBottom: 16,
          // backgroundColor: theme === 'dark' ? appColors.dark1 : appColors.white,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        },
      ]}>
      <FastImage
        source={{uri: item.image}}
        style={{
          width,
          height: width * 1.2,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <View
        style={{
          padding: 8,
          alignItems: 'flex-start',
          backgroundColor: theme === 'dark' ? appColors.dark1 : appColors.white,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}>
        <RatingComponent bookId={item.key} readOnly size={14} />
        <TextComponent text={item.title} font={fontFamilies.medium} />
        <AuthorComponent authorId={item.authorId} />
      </View>
    </TouchableOpacity>
  );
};

export default RenderBookItem;
