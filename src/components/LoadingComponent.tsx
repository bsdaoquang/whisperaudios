/** @format */

import React from 'react';
import {ActivityIndicator, Text, View, useColorScheme} from 'react-native';
import {fontFamilies} from '../constants/fontFamilies';
import SpaceComponent from './SpaceComponent';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';

interface Props {
  isLoading: boolean;
  value: number;
  message?: string;
}

export const LoadingComponent = (props: Props) => {
  const {isLoading, value, message} = props;

  const theme = useColorScheme();

  return (
    <View>
      {isLoading ? (
        <>
          <ActivityIndicator
            size={20}
            color={theme === 'light' ? appColors.gray : appColors.light}
          />
          <SpaceComponent height={10} />
          <Text
            style={{
              color: theme === 'light' ? appColors.gray : appColors.light,
              textAlign: 'center',
            }}>
            Đang tải...
          </Text>
        </>
      ) : (
        <>
          {!isLoading && value === 0 && (
            <TextComponent
              text={message ? message : 'Không tìm thấy dữ liệu'}
              styles={{
                textAlign: 'center',
                fontFamily: fontFamilies.regular,
              }}
            />
          )}
        </>
      )}
    </View>
  );
};
