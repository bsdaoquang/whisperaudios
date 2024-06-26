import React from 'react';
import {Modal, View, useColorScheme} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ButtonIcon from '../components/ButtonIcon';
import {RowComponent} from '../components/RowComponent';
import TitleComponent from '../components/TitleComponent';
import {appColors} from '../constants/appColors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelected: (val: number) => void;
}

const ModalDefault = (props: Props) => {
  const {visible, onClose, onSelected} = props;

  const theme = useColorScheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      style={{flex: 1, height: '100%'}}
      statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <View
          style={{
            backgroundColor:
              theme === 'light' ? appColors.white : appColors.dark,
            width: '100%',
            padding: 16,
            borderRadius: 12,
          }}>
          <RowComponent styles={{justifyContent: 'flex-end', marginBottom: 12}}>
            <TitleComponent flex={1} text="Chọn chương" />
            <ButtonIcon
              onPress={onClose}
              icon={
                <AntDesign
                  name="close"
                  size={24}
                  color={theme === 'light' ? appColors.dark : appColors.white}
                />
              }
            />
          </RowComponent>
        </View>
      </View>
    </Modal>
  );
};

export default ModalDefault;
