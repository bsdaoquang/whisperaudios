import React, {useState} from 'react';
import {Modal, View, useColorScheme} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ButtonComponent from '../components/ButtonComponent';
import ButtonIcon from '../components/ButtonIcon';
import {InputCompoment} from '../components/InputComponent';
import {RowComponent} from '../components/RowComponent';
import SectionComponent from '../components/SectionComponent';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import {appColors} from '../constants/appColors';
import {i18n} from '../languages/i18n';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  visible: boolean;
  index: number;
  onClose: () => void;
  onSelected: (val: number) => void;
}

const ModalChoiceChap = (props: Props) => {
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
        style={[
          globalStyles.shadow,
          {
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          },
        ]}>
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
          <View style={{marginBottom: 12}}>
            <TextComponent
              line={2}
              text="Nhập chương bạn muốn nghe, sau đó bấm đồng ý để bắt đầu thưởng thức"
              flex={1}
            />
          </View>
          <InputCompoment
            type="number-pad"
            value={indexSelected.toString()}
            onChange={val => setIndexSelected(val ? parseInt(val) : 0)}
            clear={index !== 0}
          />

          <ButtonComponent
            text={i18n.t('agree')}
            onPress={() => onSelected(indexSelected)}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalChoiceChap;
