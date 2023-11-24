/** @format */

import messaging from '@react-native-firebase/messaging';
import {Notification, SearchNormal1} from 'iconsax-react-native';
import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import LatestBooks from '../../components/LatestBooks';
import ListeningComponent from '../../components/ListeningComponent';
import {RowComponent} from '../../components/RowComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TopAuthorBooks from '../../components/TopAuthorBooks';
import TopRatingBooks from '../../components/TopRatingBooks';
import {appColors} from '../../constants/appColors';
import {userSelector} from '../../redux/reducers/userReducer';
import Categories from './components/Categories';
import TopLikedSwiper from './components/TopLikedSwiper';

const HomeScreen = ({navigation}: any) => {
  const user = useSelector(userSelector);

  useEffect(() => {
    // cập nhật lại số lượng thông báo
    messaging().onMessage(async message => {
      console.log(message);
      Toast.show({
        text1: message.notification?.title ?? '',
        text2: message.notification?.body ?? '',
        type: 'success',
        onPress: () => console.log(''),
      });
    });

    messaging()
      .getInitialNotification()
      .then(mess => {
        if (mess) {
          const data: any = mess.data;
          console.log(data);
        }
      });
  }, []);

  const handleFixData = () => {
    // authors.forEach((item, index) => {
    //   // firestore()
    //   //   .doc(`${appInfos.databaseNames.authors}/${item.key}`)
    //   //   .set(item)
    //   //   .then(() => {
    //   //     console.log('author added!');
    //   //   });
    //   firestore()
    //     .doc(`${appInfos.databaseNames.authors}/${item.key}`)
    //     .update({
    //       key: firestore.FieldValue.delete(),
    //     })
    //     .then(() => {
    //       console.log('key removed!');
    //     });
    // });
  };

  return (
    <Container scroll>
      <RowComponent
        styles={{
          padding: 16,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeAuth')}>
          <FastImage
            source={
              user.photoURL
                ? {uri: user.photoURL}
                : require('../../../assets/images/default-avatar.webp')
            }
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <RowComponent>
          <ButtonIcon
            icon={<Notification size={22} color={appColors.text} />}
            onPress={() => navigation.navigate('NotificationsScreen')}
          />
          <SpaceComponent width={12} />
          <ButtonIcon
            icon={<SearchNormal1 size={22} color={appColors.text} />}
            onPress={() => navigation.navigate('Search')}
          />
        </RowComponent>
      </RowComponent>

      <Categories />
      <TopLikedSwiper />
      <ListeningComponent />
      <LatestBooks />
      <TopAuthorBooks />
      <TopRatingBooks />
    </Container>
  );
};

export default HomeScreen;
