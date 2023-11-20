/** @format */

import {StyleProp, Text, TextStyle, View, useColorScheme} from 'react-native';
import {lightStyles} from '../styles/lightStyles';
import {darkStyles} from '../styles/darkStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';

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
    <View style={{flex: flex ?? 0}}>
      <TextComponent
        text={text}
        font={font ?? fontFamilies.bold}
        line={line ?? undefined}
        styles={[
          textStyle,
          {
            fontSize: size ?? 16,
            fontFamily: font ?? fontFamilies.bold,

            color: color
              ? color
              : theme === 'light'
              ? appColors.dark
              : appColors.light,
          },
          styles,
        ]}
      />
    </View>
  );
};

export default TitleComponent;
