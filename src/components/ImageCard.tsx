/** @format */

import React from 'react';
import {Platform, View, Image, ImageResizeMode} from 'react-native';
import TitleComponent from './TitleComponent';
import FastImage, {ResizeMode} from 'react-native-fast-image';

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
          styles,
          {
            height: height ? height : width ? width * 1.3 : 150,
            width: width ?? 100,
            borderRadius: 4,
            shadowColor: 'rgba(44, 62, 80,0.4)',
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: Platform.OS === 'ios' ? 0.28 : 0.58,
            shadowRadius: 16.0,
          },
        ]}
        resizeMode={resize ?? FastImage.resizeMode.cover}
      />
      {title && <TitleComponent text={title} />}
      {/* {title && (
				<LinearGradient
					style={{
						position: 'absolute',
						bottom: 0,
						left: 8,
						right: 8,
						padding: 8,
						borderBottomLeftRadius: 8,
						borderBottomRightRadius: 8,
					}}
					colors={['#000', 'rgba(0,0,0,0)']}
					start={{ x: 0, y: 1 }}
					end={{ x: 0, y: 0 }}>
					<TitleComponent
						size={12}
						color={appColors.white}
						text={title}
						line={2}
					/>
				</LinearGradient>
			)} */}
    </View>
  );
};
