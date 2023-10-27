/** @format */

import React from 'react';
import {ImageBackground, View} from 'react-native';
import {appInfos} from '../../constants/appInfos';
import {Book} from '../../models';
import HeaderAudioDetail from './components/HeaderAudioDetail';

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
          backgroundColor: 'rgba(0, 0,0,0.5)',
        }}>
        <HeaderAudioDetail />
      </View>
    </ImageBackground>
  );
};

export default AudioDetail;
