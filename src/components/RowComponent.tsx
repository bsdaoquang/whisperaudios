/** @format */

import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface Props {
	children: any;
	styles?: StyleProp<ViewStyle>;
	onPress?: () => void;
	justifyContent?:
		| 'center'
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| 'space-evenly';
	flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
}

export const RowComponent = (props: Props) => {
	const { children, styles, onPress, justifyContent, flexWrap } = props;

	return onPress ? (
		<TouchableOpacity
			onPress={onPress}
			style={[
				{
					...globalStyles.rowCenter,
					alignItems: 'center',
					justifyContent: justifyContent ?? 'flex-start',
					flexWrap: flexWrap ?? 'nowrap',
				},
				styles,
			]}>
			{children}
		</TouchableOpacity>
	) : (
		<View
			style={[
				{
					...globalStyles.rowCenter,
					alignItems: 'center',
				},
				styles,
			]}>
			{children}
		</View>
	);
};
