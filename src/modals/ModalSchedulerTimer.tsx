import {
  View,
  Text,
  Modal,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {appColors} from '../constants/appColors';
import {RowComponent} from '../components/RowComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {InputCompoment} from '../components/InputComponent';
import TitleComponent from '../components/TitleComponent';
import ButtonIcon from '../components/ButtonIcon';
import TextComponent from '../components/TextComponent';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelected: (val: number) => void;
}

const ModalSchedulerTimer = (props: Props) => {
  const {visible, onClose, onSelected} = props;

  const theme = useColorScheme();

  const timers = [5, 10, 15, 30, 60, 120];

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
            <TitleComponent flex={1} text="Hẹn giờ tắt" />
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
          <View style={{}}>
            <TextComponent
              text="Bản phát nhạc của bạn sẽ tự động ngừng lại sau:"
              line={2}
              flex={1}
            />
            {timers.map((item, index) => (
              <RowComponent
                key={`item${index}`}
                styles={{marginTop: 16}}
                onPress={() => onSelected(item)}>
                <TitleComponent
                  font={fontFamilies.medium}
                  text={`${item} phút`}
                  flex={1}
                />
              </RowComponent>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSchedulerTimer;
