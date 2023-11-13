/** @format */

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {
  ArrowRight2,
  Notification,
  SearchNormal1,
  Setting2,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, View, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import UserComponent from '../../components/UserComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {Listening} from '../../models/Book';
import {removeUser, userSelector} from '../../redux/reducers/userReducer';
import {darkStyles} from '../../styles/darkStyles';
import {lightStyles} from '../../styles/lightStyles';
import TabbarComponent from '../../components/TabbarComponent';
import {i18n} from '../../languages/i18n';
import ListeningCardItem from '../../components/ListeningCardItem';

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const textStyle = theme === 'light' ? lightStyles.text : darkStyles.text;
  const textColor = theme === 'light' ? appColors.text : appColors.light;
  const navigation: any = useNavigation();
  const user = useSelector(userSelector);

  const [listenings, setListenings] = useState<Listening[]>([]);

  useEffect(() => {
    user.uid && getNewListenings();
  }, [user.uid]);

  const getNewListenings = () => {
    firestore()
      .collection(appInfos.databaseNames.listenings)
      .where('uid', '==', user.uid)
      .orderBy('date')
      .limitToLast(10)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('listening not found!!');
        } else {
          const items: Listening[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });
          setListenings(items);
        }
      });
  };

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
            onPress={() => navigation.navigate('NotificationsScreen')}
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
            onPress={() => navigation.navigate('SettingScreen')}
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{marginTop: 12}}>
        <RowComponent>
          <UserComponent uid={user.uid} size={48} />
          <View style={{flex: 1, marginLeft: 12}}>
            <TitleComponent text={user.displayName} size={20} line={1} />
            <TextComponent text={user.email} flex={1} line={1} />
          </View>
          <ArrowRight2 size={22} color={textColor} />
        </RowComponent>
      </SectionComponent>
      <View>
        <TabbarComponent
          title={i18n.t('yourListenings')}
          seemore
          onPress={() => navigation.navigate('ListeningsScreen')}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={listenings}
          renderItem={({item, index}) => (
            <ListeningCardItem
              item={item}
              styles={{
                marginLeft: 12,
                marginRight: index === listenings.length - 1 ? 12 : 0,
              }}
            />
          )}
        />
      </View>
    </Container>
  );
};

export default Profile;
