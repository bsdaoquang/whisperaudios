/** @format */

import React from 'react';
import {ImageBackground, View} from 'react-native';
import {appInfos} from '../../constants/appInfos';
import {Book} from '../../models';
import HeaderAudioDetail from './components/HeaderAudioDetail';
import SectionComponent from '../../components/SectionComponent';
import {RowComponent} from '../../components/RowComponent';
import FastImage from 'react-native-fast-image';

const AudioDetail = ({route, navigation}: any) => {
  const {audio}: {audio: Book} = route.params;

  return (
    <ImageBackground
      source={{uri: audio.image}}
      style={{
        width: appInfos.sizes.width,
        height: appInfos.sizes.height,
      }}
      imageStyle={{resizeMode: 'cover'}}>
      <View
        style={{
          width: appInfos.sizes.width,
          height: appInfos.sizes.height,
          flex: 1,
          backgroundColor: 'rgba(0, 0,0,0.8)',
        }}>
        <HeaderAudioDetail />
        <SectionComponent>
          <RowComponent>
            <FastImage
              source={{uri: audio.image}}
              style={{width: 150, height: 180, borderRadius: 12}}
              resizeMode={FastImage.resizeMode.cover}
            />
          </RowComponent>
        </SectionComponent>
      </View>
    </ImageBackground>
  );
};

export default AudioDetail;
