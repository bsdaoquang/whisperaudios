/** @format */

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {Notification, SearchNormal1, Setting2} from 'iconsax-react-native';
import React from 'react';
import {useColorScheme} from 'react-native';
import {useDispatch} from 'react-redux';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {removeUser} from '../../redux/reducers/userReducer';
import {darkStyles} from '../../styles/darkStyles';
import {lightStyles} from '../../styles/lightStyles';

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const textStyle = theme === 'light' ? lightStyles.text : darkStyles.text;
  const textColor = theme === 'light' ? appColors.text : appColors.light;
  const navigation: any = useNavigation();

  const handleSignOut = async () => {
    await GoogleSignin.signOut();
    await auth()
      .signOut()
      .then(async () => {
        await AsyncStorage.removeItem(appInfos.localNames.uid);
        dispatch(removeUser({}));
      });
  };
  return (
    <Container>
      <SectionComponent styles={{top: 20}}>
        <RowComponent styles={{justifyContent: 'flex-end'}}>
          <ButtonIcon
            styles={{paddingHorizontal: 8}}
            icon={<Notification size={22} color={textColor} />}
            onPress={() => {}}
          />
          <ButtonIcon
            styles={{paddingHorizontal: 8}}
            icon={<SearchNormal1 size={22} color={textColor} />}
            onPress={() =>
              navigation.navigate('SearchTab', {
                screen: 'Search',
              })
            }
          />
          <ButtonIcon
            styles={{paddingHorizontal: 8}}
            icon={<Setting2 size={22} color={textColor} />}
            onPress={() => {}}
          />
        </RowComponent>
      </SectionComponent>
    </Container>
  );
};

export default Profile;
