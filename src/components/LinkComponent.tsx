/** @format */

import React from 'react';
import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';

interface Props {
  text: string;
  onPress: () => void;
  color?: string;
  size?: number;
  flex?: number;
  styles?: StyleProp<ViewStyle>;
}

const LinkComponent = (props: Props) => {
  const {text, onPress, color, size, flex, styles} = props;

  return (
    <TouchableOpacity onPress={onPress} style={[styles]}>
      <TextComponent
        flex={flex ?? 0}
        text={text}
        color={color ?? appColors.link}
        size={size ?? 14}
      />
    </TouchableOpacity>
  );
};

export default LinkComponent;
