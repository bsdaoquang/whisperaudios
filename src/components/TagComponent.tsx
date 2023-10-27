/** @format */

import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {darkStyles} from '../styles/darkStyles';
import {lightStyles} from '../styles/lightStyles';
import TextComponent from './TextComponent';

interface Props {
  text: string;
  onPress?: () => void;
  styles?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const TagComponent = (props: Props) => {
  const {text, onPress, styles, textStyle} = props;
  const theme = useColorScheme();
  const themeStyle = theme === 'light' ? lightStyles.tag : darkStyles.tag;

  return onPress ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        themeStyle,
        {
          borderWidth: 1,
          borderColor: '#f3f3f3',
        },
        styles,
      ]}>
      <TextComponent text={text} styles={textStyle} />
    </TouchableOpacity>
  ) : (
    <View
      style={[
        themeStyle,
        {
          borderWidth: 1,
          borderColor: '#f3f3f3',
        },
        styles,
      ]}>
      <TextComponent text={text} styles={textStyle} />
    </View>
  );
};

export default TagComponent;
