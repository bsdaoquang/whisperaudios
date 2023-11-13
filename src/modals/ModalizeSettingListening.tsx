// Modal này giúp hiển thị và lựa chọn lịch

import React, {useEffect, useRef} from 'react';
import {View, useColorScheme} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ButtonIcon from '../components/ButtonIcon';
import {RowComponent} from '../components/RowComponent';
import TitleComponent from '../components/TitleComponent';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import {MenuModel} from '../models/MenuModel';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {userSelector} from '../redux/reducers/userReducer';
import {appInfos} from '../constants/appInfos';
import {showToast} from '../utils/showToast';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  menus: MenuModel[];
}
const ModalizeSettingListening = (props: Props) => {
  const {isVisible, onClose, title, menus} = props;

  const theme = useColorScheme();
  const user = useSelector(userSelector);

  const modalizeRef = useRef<Modalize>();

  useEffect(() => {
    isVisible ? modalizeRef.current?.open() : modalizeRef.current?.close();
  }, [isVisible]);

  const handleSettingListening = (key: string) => {
    switch (key) {
      case 'stop':
        firestore()
          .doc(`${appInfos.databaseNames.users}/${user.uid}`)
          .update({
            isLogHistories: false,
          })
          .then(() => showToast('Đã dừng ghi lịch sử nghe audio'));

        break;

      case 'clear':
        firestore()
          .collection(appInfos.databaseNames.listenings)
          .where('uid', '==', user.uid)
          .get()
          .then(snap => {
            if (snap.empty) {
              showToast('Chưa có lịch sử nghe');
            } else {
              snap.forEach(item => {
                firestore()
                  .doc(`${appInfos.databaseNames.listenings}/${item.id}`)
                  .delete();
              });
            }
          });

        modalizeRef.current?.close();

        break;
    }
  };

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

          {menus.map(item => (
            <RowComponent
              key={item.key}
              styles={{paddingVertical: 12}}
              onPress={() => handleSettingListening(item.key)}>
              <TitleComponent text={item.title} font={fontFamilies.medium} />
              {/* <ArrowRight2
                size={20}
                color={theme === 'dark' ? appColors.light : appColors.gray}
              /> */}
            </RowComponent>
          ))}
        </View>
      </Modalize>
    </Portal>
  );
};

export default ModalizeSettingListening;
