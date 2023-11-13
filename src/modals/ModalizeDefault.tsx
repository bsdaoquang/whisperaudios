// Modal này giúp hiển thị và lựa chọn lịch

import React, {useEffect, useRef} from 'react';
import {View, useColorScheme} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {appColors} from '../constants/appColors';
import {RowComponent} from '../components/RowComponent';
import TitleComponent from '../components/TitleComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ButtonIcon from '../components/ButtonIcon';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
}
const ModalizeDefault = (props: Props) => {
  const {isVisible, onClose, title} = props;

  const theme = useColorScheme();

  const modalizeRef = useRef<Modalize>();

  useEffect(() => {
    isVisible ? modalizeRef.current?.open() : modalizeRef.current?.close();
  }, [isVisible]);

  return (
    <Portal>
      <Modalize
        panGestureEnabled={true}
        adjustToContentHeight
        closeOnOverlayTap
        onClosed={onClose}
        ref={modalizeRef}
        handlePosition="inside"
        handleStyle={{
          backgroundColor: theme === 'dark' ? appColors.light : appColors.gray,
        }}
        modalStyle={{
          backgroundColor: theme === 'dark' ? appColors.dark1 : appColors.light,
        }}>
        <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
          <RowComponent styles={{paddingVertical: 20}}>
            <View
              style={{
                flex: 1,
                marginRight: -22,
              }}>
              {title && (
                <TitleComponent
                  text="fasfsa"
                  flex={1}
                  styles={{textAlign: 'center'}}
                  line={1}
                />
              )}
            </View>
            <ButtonIcon
              icon={
                <AntDesign
                  name="close"
                  size={22}
                  color={theme === 'dark' ? appColors.light : appColors.dark}
                />
              }
              onPress={() => modalizeRef.current?.close()}
            />
          </RowComponent>
        </View>
      </Modalize>
    </Portal>
  );
};

export default ModalizeDefault;
