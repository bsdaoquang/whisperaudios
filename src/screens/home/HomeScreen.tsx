/** @format */

import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import LatestBooks from '../../components/LatestBooks';
import ListeningComponent from '../../components/ListeningComponent';
import {RowComponent} from '../../components/RowComponent';
import TitleComponent from '../../components/TitleComponent';
import TopAuthorBooks from '../../components/TopAuthorBooks';
import TopRatingBooks from '../../components/TopRatingBooks';
import {userSelector} from '../../redux/reducers/userReducer';
import Categories from './components/Categories';
import TopLikedSwiper from './components/TopLikedSwiper';
import ButtonComponent from '../../components/ButtonComponent';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';
import Clipboard from '@react-native-clipboard/clipboard';
import {audios} from '../../datas/audios';
import {categories} from '../../datas/categories';
import {chaptes} from '../../datas/chapters';
import {authors} from '../../datas/authors';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

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
        <TitleComponent text="Whisper Audios" size={22} />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProfileTab', {screen: 'HomeAuth'})
          }>
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
