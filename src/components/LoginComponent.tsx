/** @format */

import {useNavigation} from '@react-navigation/native';
import {Google} from 'iconsax-react-native';
import React, {useState} from 'react';
import {Text, View, useColorScheme} from 'react-native';
import {useDispatch} from 'react-redux';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import {i18n} from '../languages/i18n';
import LoadingModal from '../modals/LoadingModal';
import {addUser} from '../redux/reducers/userReducer';
import {darkStyles} from '../styles/darkStyles';
import {globalStyles} from '../styles/globalStyles';
import {lightStyles} from '../styles/lightStyles';
import {handleAuthentication} from '../utils/handleAuthentication';
import {showToast} from '../utils/showToast';
import {RowComponent} from './RowComponent';
import TextComponent from './TextComponent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const LoginComponent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigation: any = useNavigation();
  const dispatch = useDispatch();
  const theme = useColorScheme();

  return (
    <View style={{marginTop: 20}}>
      <RowComponent styles={{justifyContent: 'center', marginBottom: 12}}>
        <TextComponent text="Hoặc đăng nhập với" color={appColors.gray} />
      </RowComponent>
      <RowComponent
        onPress={async () => {
          setIsLoading(true);
          await handleAuthentication
            .GoogleSignin(dispatch)
            .then((res: any) => {
              console.log(res);
              if (res.uid) {
                setIsLoading(false);
                dispatch(
                  addUser({
                    uid: res.uid,
                    fcmToken: '',
                  }),
                );
              } else {
                setIsLoading(false);
                showToast('Đăng nhập thất bại');
              }
            })
            .catch(error => {
              console.log(error);
              setIsLoading(false);
              showToast('Đăng nhập thất bại');
            });
        }}
        styles={[
          globalStyles.card,
          {
            marginHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: appColors.red4,
          },
        ]}>
        <Google size={22} color={appColors.white} variant="Bold" />
        <TextComponent
          styles={{textAlign: 'center', marginLeft: -32}}
          size={16}
          flex={1}
          text="Google"
          font={fontFamilies.semiBole}
          color={appColors.white}
        />
      </RowComponent>
      <RowComponent
        onPress={
          async () => console.log('Comming soon')
          // handleAuthentication.FacebookSignin().then(res => {
          //   console.log(res);
          // })
        }
        styles={[
          globalStyles.card,
          {
            marginHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: appColors.info4,
          },
        ]}>
        <FontAwesome name="facebook" size={22} color={appColors.white} />
        <TextComponent
          styles={{textAlign: 'center', marginLeft: -32}}
          size={16}
          flex={1}
          text="Facebook"
          font={fontFamilies.semiBole}
          color={appColors.white}
        />
      </RowComponent>
      {/* <RowComponent
        onPress={async () => navigation.navigate('LoginWithPhone')}
        styles={[
          globalStyles.card,
          {
            marginHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: appColors.gray4,
          },
        ]}
      >
        <Call size={22} color={appColors.text} />
        <TextComponent
          styles={{ textAlign: 'center', marginLeft: -32 }}
          size={16}
          flex={1}
          text={i18n.t('phone')}
          font={fontFamilies.semiBole}
          color={appColors.text}
        />
      </RowComponent> */}

      <RowComponent
        styles={{
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          paddingHorizontal: 16,
        }}>
        <Text
          style={[
            theme === 'dark' ? darkStyles.text : lightStyles.text,
            {fontSize: 12, color: appColors.gray6, textAlign: 'center'},
          ]}>
          {i18n.t('messTerm')}
          <Text onPress={() => {}} style={{color: appColors.link}}>
            {' '}
            {i18n.t('terms')}{' '}
          </Text>
          {i18n.t('and')}
          <Text onPress={() => {}} style={{color: appColors.link}}>
            {' '}
            {i18n.t('privacy')}{' '}
          </Text>
          {i18n.t('our')}
        </Text>
      </RowComponent>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default LoginComponent;
