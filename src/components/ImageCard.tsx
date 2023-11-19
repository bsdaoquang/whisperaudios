/** @format */

import React from 'react';
import {Platform, View, Image, ImageResizeMode} from 'react-native';
import TitleComponent from './TitleComponent';
import FastImage, {ResizeMode} from 'react-native-fast-image';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  uri?: string;
  height?: number;
  width?: number;
  styles?: any;
  title?: string;
  resize?: ResizeMode;
}

export const ImageCard = (props: Props) => {
  const {uri, height, width, styles, title, resize} = props;

  return (
    <View>
      <FastImage
        source={uri ? {uri} : require('../../assets/images/default-book.png')}
        style={[
          globalStyles.shadow,
          {
            height: height ? height : width ? width * 1.3 : 150,
            width: width ?? 100,
            borderRadius: 4,
          },
          styles,
        ]}
        resizeMode={resize ?? FastImage.resizeMode.cover}
      />
      {title && <TitleComponent text={title} />}
    </View>
  );
};
