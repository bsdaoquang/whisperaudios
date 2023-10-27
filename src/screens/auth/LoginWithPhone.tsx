/** @format */

import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ArrowDown2} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import ButtonComponent from '../../components/ButtonComponent';
import Container from '../../components/Container';
import {InputCompoment} from '../../components/InputComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TitleComponent from '../../components/TitleComponent';
import {appColors} from '../../constants/appColors';
import {globalStyles} from '../../styles/globalStyles';
import {handleAuthentication} from '../../utils/handleAuthentication';

const LoginWithPhone = ({navigation}: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [helpPhone, setHelpPhone] = useState('');
  const [phoneCode, setPhoneCode] = useState('+84');
  const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
  const [confirmation, setConfirmation] = useState<
    FirebaseAuthTypes.ConfirmationResult
  >();

  const handleRegisterWithPhone = async () => {
    if (phoneNumber && phoneNumber.length === 10) {
      setHelpPhone('');

      const res: any = await handleAuthentication.LoginWithPhoneNumber(
        phoneCode + phoneNumber.substring(1, 10),
      );

      if (res) {
        setHelpPhone('');
        setConfirmation(res);
        setIsShowModalConfirm(true);
      } else {
        setHelpPhone('Số điện thoại không đúng');
      }
    } else {
      setHelpPhone('Số điện thoại không đúng');
    }
  };

  return (
    <>
      <Container back scroll title="Đăng nhập bằng số điện thoại">
        <SectionComponent>
          <TitleComponent text="Hãy nhập số điện thoại của bạn" size={24} />
          <RowComponent
            styles={{
              flex: 5,
              alignItems: 'flex-start',
            }}
          >
            <TouchableOpacity
              style={{
                ...globalStyles.rowCenter,
                flex: 2,
                // marginBottom: 10,
                marginTop: 6,

                backgroundColor: appColors.white,
                padding: 10,
                borderRadius: 8,
                justifyContent: 'space-between',
              }}
            >
              <RowComponent>
                <Image
                  source={require('../../../assets/images/icons/icons8-vietnam-48.png')}
                  style={{
                    width: 32,
                    height: 20,
                    marginHorizontal: 10,
                  }}
                />
                <TitleComponent text="+84" />
              </RowComponent>
              <ArrowDown2 size={18} color={appColors.description} />
            </TouchableOpacity>
            <SpaceComponent width={16} />
            <View
              style={{
                flex: 3,
              }}
            >
              <InputCompoment
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={val => setPhoneNumber(val)}
                max={10}
                clear
                type="phone-pad"
                helpText={helpPhone}
              />
            </View>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <ButtonComponent
            text="Tiếp tục"
            onPress={handleRegisterWithPhone}
            disable={isRegister}
          />
        </SectionComponent>
      </Container>

      {/* <ModalConfirmPhoneCode
        visible={isShowModalConfirm}
        onClose={() => setIsShowModalConfirm(false)}
        confirmation={confirmation}
      /> */}
    </>
  );
};

export default LoginWithPhone;
