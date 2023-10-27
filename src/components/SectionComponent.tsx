/** @format */

import { View, Text, StyleProp, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';

interface Props {
	children: ReactNode;
	styles?: StyleProp<ViewStyle>;
	flex?: number;
}

const SectionComponent = (props: Props) => {
	const { children, styles, flex } = props;

	return (
		<View
			style={[
				{ paddingHorizontal: 16, marginBottom: 16, flex: flex ?? 0 },
				styles,
			]}>
			{children}
		</View>
	);
};

export default SectionComponent;
