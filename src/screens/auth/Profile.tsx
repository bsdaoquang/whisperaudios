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
import {FlatList, TouchableOpacity, View, useColorScheme} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import ListBookItem from '../../components/ListBookItem';
import ListeningCardItem from '../../components/ListeningCardItem';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TabbarComponent from '../../components/TabbarComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import UserComponent from '../../components/UserComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import {Book, Listening} from '../../models/Book';
import {removeUser, userSelector} from '../../redux/reducers/userReducer';
import FastImage from 'react-native-fast-image';
import RenderBookItem from '../../components/RenderBookItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {globalStyles} from '../../styles/globalStyles';
import {HandleAudio} from '../../utils/handleAudio';

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const textColor = theme === 'light' ? appColors.text : appColors.light;
  const navigation: any = useNavigation();
  const user = useSelector(userSelector);

  const [listenings, setListenings] = useState<Listening[]>([]);
  const [likedAudios, setLikedAudios] = useState<Book[]>([]);

  useEffect(() => {
    if (user.uid) {
      getNewListenings();
      getLikedByUid();
    }
  }, [user.uid]);

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
    await GoogleSignin.signOut();
    await auth()
      .signOut()
      .then(async () => {
        await AsyncStorage.removeItem(appInfos.localNames.uid);
        dispatch(removeUser({}));
      });
  };

  return (
    <Container scroll>
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
          <TextComponent text={i18n.t('dataNotFound')} />
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
    </Container>
  );
};

export default Profile;
