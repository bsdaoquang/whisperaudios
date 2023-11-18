/** @format */

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {
  Notification,
  SearchNormal1,
  Setting2,
  UserEdit,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import ListeningCardItem from '../../components/ListeningCardItem';
import RenderBookItem from '../../components/RenderBookItem';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TabbarComponent from '../../components/TabbarComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import UserComponent from '../../components/UserComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {fontFamilies} from '../../constants/fontFamilies';
import {i18n} from '../../languages/i18n';
import {Book, Listening} from '../../models/Book';
import {MenuModel} from '../../models/MenuModel';
import {removeUser, userSelector} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles/globalStyles';
import {HandleAudio} from '../../utils/handleAudio';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SpaceComponent from '../../components/SpaceComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const textColor = theme === 'light' ? appColors.text : appColors.light;
  const iconColor = theme === 'light' ? appColors.gray : appColors.white1;
  const navigation: any = useNavigation();
  const user = useSelector(userSelector);
  const iconSize = 22;

  const [listenings, setListenings] = useState<Listening[]>([]);
  const [likedAudios, setLikedAudios] = useState<Book[]>([]);

  useEffect(() => {
    if (user.uid) {
      getNewListenings();
      getLikedByUid();
    }
  }, [user.uid]);

  const menuUsers: MenuModel[] = [
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

  const getNewListenings = () => {
    firestore()
      .collection(appInfos.databaseNames.listenings)
      .where('uid', '==', user.uid)
      .orderBy('date')
      .limit(10)
      .onSnapshot(snap => {
        if (snap) {
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

  const getLikedByUid = () => {
    firestore()
      .collection(appInfos.databaseNames.audios)
      .where('liked', 'array-contains', user.uid)
      .limit(10)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Liked not found');
        } else {
          const items: Book[] = [];
          snap.forEach((item: any) => {
            items.push({key: item.id, ...item.data()});
          });

          setLikedAudios(items);
        }
      });
  };

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
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <SectionComponent styles={{marginTop: 12}}>
          <RowComponent>
            <UserComponent uid={user.uid} size={48} />
            <View style={{flex: 1, marginLeft: 12}}>
              <TitleComponent text={user.displayName} size={20} line={1} />
              <TextComponent text={user.email} flex={1} line={1} />
            </View>
            <ButtonIcon
              icon={
                <UserEdit
                  size={26}
                  color={theme === 'light' ? appColors.primary : appColors.gray}
                />
              }
              onPress={() => navigation.navigate('EditProfile')}
            />
          </RowComponent>
        </SectionComponent>
        <View style={{marginBottom: 18}}>
          <TabbarComponent
            title={i18n.t('yourListenings')}
            seemore
            onPress={() => navigation.navigate('ListeningsScreen')}
          />
          {listenings.length > 0 ? (
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
          ) : (
            <View style={{paddingHorizontal: 16}}>
              <TextComponent text={i18n.t('dataNotFound')} />
            </View>
          )}
        </View>
        {likedAudios.length > 0 && (
          <View>
            <TabbarComponent
              title={i18n.t('audioLiked')}
              seemore
              onPress={() => navigation.navigate('LikedAudios')}
            />
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={{paddingRight: 16}}
              horizontal
              data={likedAudios}
              renderItem={({item}) => (
                <View>
                  <RenderBookItem item={item} key={item.key} />
                  <TouchableOpacity
                    onPress={() =>
                      HandleAudio.UpdateLiked(
                        item.liked,
                        item.key as string,
                        user.uid,
                      )
                    }
                    style={[
                      globalStyles.shadow,
                      {
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        padding: 4,
                        backgroundColor: appColors.white,
                        borderRadius: 100,
                      },
                    ]}>
                    <Ionicons name="heart" size={20} color={appColors.error4} />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        <SectionComponent styles={{marginTop: 12}}>
          {menuUsers.map(item => (
            <RowComponent
              onPress={item.onPress ? () => item.onPress : undefined}
              styles={{
                paddingVertical: 12,
              }}
              key={item.key}>
              {item.icon && item.icon}
              <SpaceComponent width={12} />
              <TextComponent
                text={item.title}
                flex={1}
                // font={fontFamilies.medium}
                size={16}
              />
            </RowComponent>
          ))}
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
