/** @format */

import {StyleProp, Text, TextStyle, useColorScheme} from 'react-native';
import {lightStyles} from '../styles/lightStyles';
import {darkStyles} from '../styles/darkStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {ReactNode} from 'react';
import {RowComponent} from './RowComponent';
import SpaceComponent from './SpaceComponent';
import {appColors} from '../constants/appColors';

interface Props {
  color?: string;
  size?: number;
  text: string;
  flex?: number;
  styles?: StyleProp<TextStyle>;
  font?: string;
  line?: number;
  icon?: ReactNode;
}

const TextComponent = (props: Props) => {
  const {color, size, text, flex, styles, font, line, icon} = props;
  const theme = useColorScheme();
  const textStyle = theme === 'light' ? lightStyles.text : darkStyles.text;
  const textColor = theme === 'light' ? appColors.text : appColors.light;

  return (
    <RowComponent styles={{flex: flex ?? 0}}>
      {icon && icon}
      <SpaceComponent width={icon ? 4 : 0} />
      <Text
        numberOfLines={line ?? undefined}
        style={[
          textStyle,
          {
            flex: flex ?? 0,
            fontSize: size ?? 14,
            fontFamily: font ?? fontFamilies.regular,
            color: color ?? textColor,
          },
          styles,
        ]}>
        {text}
      </Text>
    </RowComponent>
  );
};

export default TextComponent;
