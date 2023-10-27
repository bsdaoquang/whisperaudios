/** @format */

import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { fontFamilies } from '../constants/fontFamilies';
import SpaceComponent from './SpaceComponent';
import { appColors } from '../constants/appColors';

interface Props {
	isLoading: boolean;
	value: number;
	message?: string;
}

export const LoadingComponent = (props: Props) => {
	const { isLoading, value, message } = props;

	return (
		<View>
			<ActivityIndicator />
			{/* {isLoading ? (
				<>
					<ActivityIndicator size={20} color={appColors.light} />
					<SpaceComponent height={10} />
					<Text style={{ color: appColors.light, textAlign: 'center' }}>
						Đang tải...
					</Text>
				</>
			) : (
				<>
					{!isLoading && value === 0 && (
						<Text
							style={{
								color: appColors.gray,
								textAlign: 'center',
								fontFamily: fontFamilies.text,
							}}>
							{message ? message : 'Không tìm thấy dữ liệu'}
						</Text>
					)}
				</>
			)} */}
		</View>
	);
};
