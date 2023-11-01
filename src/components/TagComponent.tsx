/** @format */

import React, {ReactNode} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {darkStyles} from '../styles/darkStyles';
import {globalStyles} from '../styles/globalStyles';
import {lightStyles} from '../styles/lightStyles';
import TextComponent from './TextComponent';

interface Props {
  text: string;
  onPress?: () => void;
  styles?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: ReactNode;
}

const TagComponent = (props: Props) => {
  const {text, onPress, styles, textStyle, icon} = props;
  const theme = useColorScheme();
  const themeStyle = theme === 'light' ? lightStyles.tag : darkStyles.tag;

  return onPress ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        themeStyle,
        globalStyles.rowCenter,
        {
          borderWidth: 1,
          borderColor: '#f3f3f3',
        },
        styles,
      ]}
    >
      {icon ?? icon}
      <TextComponent text={text} styles={textStyle} />
    </TouchableOpacity>
  ) : (
    <View
      style={[
        themeStyle,
        globalStyles.rowCenter,
        {
          borderWidth: 1,
          borderColor: '#f3f3f3',
        },
        styles,
      ]}
    >
      {icon ?? icon}
      <TextComponent text={text} styles={textStyle} />
    </View>
  );
};

export default TagComponent;
