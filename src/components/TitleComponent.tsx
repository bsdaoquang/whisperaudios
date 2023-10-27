/** @format */

import { StyleProp, Text, TextStyle, useColorScheme } from 'react-native';
import { lightStyles } from '../styles/lightStyles';
import { darkStyles } from '../styles/darkStyles';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
	color?: string;
	size?: number;
	text: string;
	line?: number;
	flex?: number;
	styles?: StyleProp<TextStyle>;
}

const TitleComponent = (props: Props) => {
	const { color, size, text, line, flex, styles } = props;
	const theme = useColorScheme();
	const textStyle = theme === 'light' ? lightStyles.text : darkStyles.text;

	return (
		<Text
			numberOfLines={line ?? 1}
			style={[
				textStyle,
				{
					fontSize: size ?? 16,
					fontFamily: fontFamilies.semiBole,
					flex: flex ?? 1,
				},
				styles,
			]}>
			{text}
		</Text>
	);
};

export default TitleComponent;
