/** @format */

import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
	rowCenter: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		marginHorizontal: 16,
		marginBottom: 16,
		padding: 8,
		borderRadius: 8,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,
		elevation: 12,
	},
	button: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
