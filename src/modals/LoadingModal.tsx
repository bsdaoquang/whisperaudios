/** @format */

import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';
import TextComponent from '../components/TextComponent';
import {appColors} from '../constants/appColors';
import {appInfos} from '../constants/appInfos';

interface Props {
  visible: boolean;
  mess?: string;
}

const LoadingModal = (props: Props) => {
  const {visible, mess} = props;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent>
      <View
        style={[
          {
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            height: appInfos.sizes.height,
          },
        ]}>
        <ActivityIndicator color={appColors.primary} size={32} />
        <TextComponent
          text={mess ?? 'Loading...'}
          flex={0}
          color={appColors.text}
        />
      </View>
    </Modal>
  );
};

export default LoadingModal;
