/** @format */

import { StyleSheet } from 'react-native';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';

export const darkStyles = StyleSheet.create({
	container: {
		backgroundColor: appColors.dark,
		flex: 1,
	},
	text: {
		fontFamily: fontFamilies.regular,
		color: appColors.light,
		fontSize: 14,
	},
	tag: {
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderColor: appColors.light,
		borderRadius: 100,
		marginHorizontal: 8,
	},
	card: {
		shadowColor: 'rgba(0,0,0,0.4)',
		backgroundColor: '#212121',
	},
});
