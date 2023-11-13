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
  flex?: number;
}

const LinkComponent = (props: Props) => {
  const {text, onPress, color, size, flex} = props;

  return (
    <TouchableOpacity onPress={onPress}>
      <TextComponent
        flex={flex ?? 1}
        text={text}
        color={color ?? appColors.link}
        size={size ?? 14}
      />
    </TouchableOpacity>
  );
};

export default LinkComponent;
