/** @format */

import React, {ReactNode} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {appColors} from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';
import TitleComponent from './TitleComponent';

interface Props {
  text?: string;
  icon?: ReactNode;
  onPress: () => void;
  bordered?: boolean;
  bgColor?: string;
  width?: any;
  styles?: StyleProp<ViewStyle>;
  disable?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

const ButtonComponent = (props: Props) => {
  const {
    text,
    icon,
    onPress,
    bordered,
    bgColor,
    width,
    styles,
    disable,
    textStyle,
  } = props;

  const theme = useColorScheme();

  const borderColor = theme === 'light' ? appColors.dark : appColors.light;

  const backgroundColor = disable
    ? appColors.gray
    : bgColor
    ? bgColor
    : theme === 'dark'
    ? appColors.gray7
    : appColors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      style={[
        globalStyles.button,
        {
          borderWidth: bordered ? 1 : 0,
          width: width ?? 'auto',
          borderColor: borderColor,
          backgroundColor,
        },
        styles,
      ]}>
      {icon && icon}
      {text && (
        <TitleComponent
          styles={[{color: appColors.white}, textStyle]}
          text={text}
          flex={0}
        />
      )}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
