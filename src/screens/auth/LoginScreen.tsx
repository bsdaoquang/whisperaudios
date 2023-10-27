/** @format */

import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, View} from 'react-native';
import {handleAuthentication} from '../../utils/handleAuthentication';
import {Validate} from '../../utils/validate';
import Container from '../../components/Container';
import SectionComponent from '../../components/SectionComponent';
import {InputCompoment} from '../../components/InputComponent';
import {appColors} from '../../constants/appColors';
import {RowComponent} from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import ButtonComponent from '../../components/ButtonComponent';
import LoginComponent from '../../components/LoginComponent';
import {i18n} from '../../languages/i18n';
import LinkComponent from '../../components/LinkComponent';
import {useNavigation} from '@react-navigation/native';
import LoadingModal from '../../modals/LoadingModal';

import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [helpEmail, setHelpEmail] = useState('');
  const [helpPass, setHelpPass] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isShowPass, setIsShowPass] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);

  const navigation: any = useNavigation();

  useEffect(() => {
    setHelpEmail('');
    setHelpPass('');
    setErrorText('');
  }, [email, pass]);

  const handleLoginWithEmailAndPass = async () => {
    console.log('fafaa');
    setIsLogin(true);

    if (email) {
      setHelpEmail('');

      const errorEmail = Validate.email(email);

      if (errorEmail) {
        setHelpEmail('');

        if (!pass) {
          setHelpPass('Vui lòng nhập mật khẩu');
        } else {
          setHelpPass('');
          if (pass.length < 6) {
            setHelpPass('Mật khẩu không đúng');
          } else {
            setHelpPass('');

            auth()
              .signInWithEmailAndPassword(email, pass)
              .then(userCredential => {
                const user = userCredential.user;
                handleAuthentication.UpdateUser(user).then(() => {
                  setIsLogin(false);
                });
              })
              .catch(error =>
                setErrorText(
                  'Đăng nhập thất bại, vui lòng kiểm tra lại Email/Mật khẩu và thử lại',
                ),
              );
          }
        }
      } else {
        setHelpEmail('Địa chỉ email không đúng');
      }
    } else {
      setHelpEmail('Vui lòng nhập địa chỉ email');
    }
    setIsLogin(false);
  };

  const forgetPass = async () => {
    if (email) {
      setHelpEmail('');

      const validate = Validate.email(email);
      if (validate) {
        setHelpEmail('');
        setIsChangePass(true);
        // const res = await handleAuthentication.FogetPass(email);

        // if (res === 'OK') {
        // 	// Đã gửi email
        // 	console.log('OK');
        // 	setIsChangePass(false);
        // } else {
        // 	// Lỗi
        // 	setErrorText(
        // 		'Địa chỉ email của bạn không tồn tại trong hệ thống, vui lòng kiểm tra lại'
        // 	);
        // }
      } else {
        setHelpEmail('Địa chỉ email không đúng');
      }
    } else {
      setHelpEmail('Vui lòng nhập địa chỉ email');
    }

    setIsChangePass(false);
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <Container isFlex title={i18n.t('login')} scroll>
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

            <RowComponent
              styles={{justifyContent: 'flex-end', marginBottom: 12}}>
              {isChangePass ? (
                <ActivityIndicator />
              ) : (
                <LinkComponent
                  text={i18n.t('forgetPass')}
                  onPress={forgetPass}
                />
              )}
            </RowComponent>
            {errorText && (
              <TextComponent
                text={errorText}
                color={appColors.danger}
                flex={1}
                line={2}
                styles={{marginBottom: 16}}
              />
            )}
            <ButtonComponent
              text={i18n.t('login')}
              textStyle={{textTransform: 'uppercase'}}
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
                text="Bạn chưa có tài khoản? "
                color={appColors.gray}
              />
              <LinkComponent
                text={i18n.t('register')}
                onPress={() => navigation.navigate('RegisterScreen')}
              />
            </RowComponent>
          </SectionComponent>

          <LoginComponent />
        </View>
        <LoadingModal visible={isLogin} />
      </Container>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
