/** @format */

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowRight,
  ArrowRight2,
  Notification,
  SearchNormal1,
  Setting2,
  User,
} from 'iconsax-react-native';
import React from 'react';
import {Alert, ScrollView, View, useColorScheme} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import UserComponent from '../../components/UserComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {fontFamilies} from '../../constants/fontFamilies';
import {i18n} from '../../languages/i18n';
import {MenuModel} from '../../models/MenuModel';
import {removeUser, userSelector} from '../../redux/reducers/userReducer';

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const textColor = theme === 'light' ? appColors.text : appColors.light;
  const iconColor = theme === 'light' ? appColors.gray : appColors.white1;
  const navigation: any = useNavigation();
  const user = useSelector(userSelector);
  const iconSize = 18;

  const menuUsers: MenuModel[] = [
    {
      key: 'ProfileData',
      title: 'Thông tin tài khoản',
      icon: <User variant="Bold" color={iconColor} size={iconSize} />,
    },
    {
      key: 'yourAudio',
      title: i18n.t('yourAudios'),
      onPress: () => {},
      icon: (
        <MaterialIcons name="audio-file" color={iconColor} size={iconSize} />
      ),
    },
    {
      key: 'supportAndHelp',
      title: i18n.t('supportAndHelp'),
      onPress: () => {},
      icon: (
        <AntDesign
          name="questioncircleo"
          color={iconColor}
          size={iconSize - 3}
        />
      ),
    },
  ];

  const handleSignOut = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn muốn đăng xuất khỏi ứng dụng, lịch sử nghe của bạn sẽ không được lưu trữ, bạn vẫn muốn tiếp tục?',
      [
        {
          text: i18n.t('cancel'),
        },
        {
          text: i18n.t('logout'),
          style: 'destructive',
          onPress: async () => {
            await GoogleSignin.signOut();
            await auth()
              .signOut()
              .then(async () => {
                await AsyncStorage.removeItem(appInfos.localNames.uid);
                dispatch(removeUser({}));
              });
          },
        },
      ],
    );
  };

  const renderMenuItem = (item: MenuModel) => (
    <RowComponent
      styles={{marginVertical: 12, justifyContent: 'center'}}
      onPress={
        item.onPress ? () => item.onPress : () => navigation.navigate(item.key)
      }>
      <View
        style={{
          padding: 6,
          borderRadius: 8,
          backgroundColor: appColors.gray2,
        }}>
        {item.icon}
      </View>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <TextComponent text={item.title} flex={0} font={fontFamilies.medium} />
      </View>
      <ArrowRight2 size={18} color={appColors.gray} />
    </RowComponent>
  );

  return (
    <Container>
      <SectionComponent styles={{top: 20}}>
        <RowComponent styles={{justifyContent: 'flex-end'}}>
          <ButtonIcon
            styles={{paddingHorizontal: 8}}
            icon={<Notification size={22} color={textColor} />}
            onPress={() => navigation.navigate('NotificationsScreen')}
          />
          <ButtonIcon
            styles={{paddingHorizontal: 8}}
            icon={<SearchNormal1 size={22} color={textColor} />}
            onPress={() => navigation.navigate('Search')}
          />
          <ButtonIcon
            styles={{paddingHorizontal: 8}}
            icon={<Setting2 size={22} color={textColor} />}
            onPress={() => navigation.navigate('SettingScreen')}
          />
        </RowComponent>
      </SectionComponent>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <SectionComponent styles={{marginTop: 12}}>
          <RowComponent onPress={() => navigation.navigate('EditProfile')}>
            <UserComponent uid={user.uid} size={48} />
            <View style={{flex: 1, marginLeft: 12}}>
              <TitleComponent text={user.displayName} size={20} line={1} />
              <TextComponent text={`Level 3`} flex={1} line={1} />
            </View>
          </RowComponent>
        </SectionComponent>

        <SectionComponent>
          {menuUsers.map(item => renderMenuItem(item))}
        </SectionComponent>

        <SectionComponent>
          <RowComponent onPress={handleSignOut} justifyContent="center">
            <AntDesign name="poweroff" color={appColors.error4} size={18} />
            <SpaceComponent width={8} />
            <TextComponent
              size={16}
              color={appColors.error4}
              font={fontFamilies.medium}
              text={i18n.t('logout')}
              flex={0}
            />
          </RowComponent>
        </SectionComponent>
      </ScrollView>
    </Container>
  );
};

export default Profile;
