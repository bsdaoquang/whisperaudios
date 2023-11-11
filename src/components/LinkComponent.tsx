/** @format */

import React from 'react';
import {TouchableOpacity} from 'react-native';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';

interface Props {
  text: string;
  onPress: () => void;
  color?: string;
  size?: number;
}

const LinkComponent = (props: Props) => {
  const {text, onPress, color, size} = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <TextComponent
        text={text}
        color={color ?? appColors.link}
        size={size ?? 14}
      />
    </TouchableOpacity>
  );
};

export default LinkComponent;
