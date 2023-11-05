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

interface Props {
  visible: boolean;
  index: number;
  onClose: () => void;
  onSelected: (val: number) => void;
}

const ModalDefault = (props: Props) => {
  const {visible, index, onClose, onSelected} = props;

  const [indexSelected, setIndexSelected] = useState(index);

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
            <TouchableOpacity onPress={onClose}>
              <AntDesign
                name="close"
                size={24}
                color={theme === 'light' ? appColors.dark : appColors.white}
              />
            </TouchableOpacity>
          </RowComponent>

          <InputCompoment
            type="number-pad"
            value={index.toString()}
            onChange={val => onSelected(parseInt(val))}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalDefault;
