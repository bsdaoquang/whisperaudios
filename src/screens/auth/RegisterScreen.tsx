/** @format */

import {useNavigation} from '@react-navigation/native';
import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import ButtonComponent from '../../components/ButtonComponent';
import Container from '../../components/Container';
import {InputCompoment} from '../../components/InputComponent';
import LinkComponent from '../../components/LinkComponent';
import LoginComponent from '../../components/LoginComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {appColors} from '../../constants/appColors';
import {i18n} from '../../languages/i18n';
import {Validate} from '../../utils/validate';
import auth from '@react-native-firebase/auth';
import LoadingModal from '../../modals/LoadingModal';
import {handleAuthentication} from '../../utils/handleAuthentication';
import {useDispatch} from 'react-redux';

const RegisterScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [helpEmail, setHelpEmail] = useState('');
  const [helpPass, setHelpPass] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isShowPass, setIsShowPass] = useState(false);
  const [rePass, setRePass] = useState('');
  const [helpRepass, setHelpRepass] = useState('');
  const [isSecurityPass, setIsSecurityPass] = useState(false);

  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    setHelpEmail('');
    setHelpPass('');
    setHelpRepass('');
    setErrorText('');
  }, [email, pass, rePass]);

  const handleLoginWithEmailAndPass = async () => {
    if (email) {
      setHelpEmail('');

      const errorEmail = Validate.email(email);

      if (errorEmail) {
        setHelpEmail('');

        if (!pass) {
          setHelpPass('Vui lòng nhập mật khẩu');
        } else {
          setHelpPass('');
          if (pass !== rePass) {
            setErrorText('Mật khẩu không trùng khớp');
          } else if (pass.length < 6) {
            setHelpPass('Mật khẩu phải lớn hơn 6 ký tự');
          } else {
            setHelpPass('');
            setErrorText('');

            setIsLogin(true);

            auth()
              .createUserWithEmailAndPassword(email, pass)
              .then(userCredential => {
                console.log(userCredential);
                const user = userCredential.user;

                if (user) {
                  handleAuthentication.UpdateUser(user, dispatch).then(() => {
                    setIsLogin(false);
                    navigation.goBack();
                  });
                }
              })
              .catch(error => {
                setErrorText(JSON.stringify(error));
                console.log('Đăng ký thất bại', error);
                setIsLogin(false);
              });
          }
        }
      } else {
        setHelpEmail('Địa chỉ email không đúng');
      }
    } else {
      setHelpEmail('Vui lòng nhập địa chỉ email');
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <Container isFlex title={i18n.t('register')} back scroll>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <SectionComponent>
            <InputCompoment
              prefix={<Sms size={18} color={appColors.description} />}
              value={email}
              onChange={val => setEmail(val)}
              clear
              placeholder="Email"
              type="email-address"
              isCapitalize="none"
              helpText={helpEmail}
              max={50}
            />

            <InputCompoment
              value={pass}
              onChange={val => setPass(val)}
              isSecure
              isCapitalize="none"
              placeholder={i18n.t('password')}
              show={isShowPass}
              setIsShowPass={() => setIsShowPass(!isShowPass)}
              max={25}
              prefix={<Lock size={18} color={appColors.description} />}
              helpText={helpPass}
            />

            <InputCompoment
              value={rePass}
              onChange={val => setRePass(val)}
              max={25}
              isSecure
              type="default"
              isCapitalize="none"
              placeholder={i18n.t('reComfirm')}
              show={isSecurityPass}
              setIsShowPass={() => setIsSecurityPass(!isSecurityPass)}
              prefix={<Lock size={18} color={appColors.description} />}
              helpText={helpRepass}
            />

            {errorText && (
              <SectionComponent>
                <TextComponent text={errorText} color={appColors.danger} />
              </SectionComponent>
            )}
            <ButtonComponent
              styles={{marginTop: 16}}
              text={i18n.t('register')}
              textStyle={{textTransform: 'uppercase', color: appColors.white}}
              onPress={handleLoginWithEmailAndPass}
              disable={isLogin}
            />
            <RowComponent
              styles={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
              }}>
              <TextComponent
                text="Bạn đã có tài khoản? "
                color={appColors.gray}
              />
              <LinkComponent
                text={i18n.t('login')}
                onPress={() => navigation.goBack()}
              />
            </RowComponent>
          </SectionComponent>

          <LoginComponent />
        </View>
      </Container>
      <LoadingModal visible={isLogin} />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
