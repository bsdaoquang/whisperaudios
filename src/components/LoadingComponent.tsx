/** @format */

import React from 'react';
import {ActivityIndicator, Text, View, useColorScheme} from 'react-native';
import {fontFamilies} from '../constants/fontFamilies';
import SpaceComponent from './SpaceComponent';
import {appColors} from '../constants/appColors';
import TextComponent from './TextComponent';
import SectionComponent from './SectionComponent';

interface Props {
  isLoading: boolean;
  value: number;
  message?: string;
}

export const LoadingComponent = (props: Props) => {
  const {isLoading, value, message} = props;

  const theme = useColorScheme();

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <SectionComponent
          styles={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <ActivityIndicator
            size={20}
            color={theme === 'light' ? appColors.gray : appColors.light}
          />
          <SpaceComponent height={10} />
          <TextComponent
            styles={{
              color: theme === 'light' ? appColors.gray : appColors.light,
              textAlign: 'center',
            }}
            text="Đang tải..."
            flex={0}
          />
        </SectionComponent>
      ) : (
        <>
          {!isLoading && value === 0 && (
            <SectionComponent
              styles={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <TextComponent
                text={message ? message : 'Không tìm thấy dữ liệu'}
                styles={{
                  textAlign: 'center',
                  fontFamily: fontFamilies.regular,
                }}
                flex={0}
              />
            </SectionComponent>
          )}
        </>
      )}
    </View>
  );
};
