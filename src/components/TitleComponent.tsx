/** @format */

import {StyleProp, Text, TextStyle, useColorScheme} from 'react-native';
import {lightStyles} from '../styles/lightStyles';
import {darkStyles} from '../styles/darkStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {appColors} from '../constants/appColors';

interface Props {
  color?: string;
  size?: number;
  text: string;
  line?: number;
  flex?: number;
  styles?: StyleProp<TextStyle>;
  font?: string;
}

const TitleComponent = (props: Props) => {
  const {color, size, text, line, flex, styles, font} = props;
  const theme = useColorScheme();
  const textStyle = theme === 'light' ? lightStyles.text : darkStyles.text;

  return (
    <Text
      numberOfLines={line ? line : undefined}
      style={[
        textStyle,
        {
          fontSize: size ?? 16,
          fontFamily: font ?? fontFamilies.bold,
          flex: flex ?? 1,
          color: color
            ? color
            : theme === 'light'
            ? appColors.dark
            : appColors.light,
        },
        styles,
      ]}>
      {text}
    </Text>
  );
};

export default TitleComponent;
