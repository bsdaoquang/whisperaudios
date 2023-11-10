/** @format */

import React from 'react';
import Container from '../../components/Container';
import LatestBooks from '../../components/LatestBooks';
import {RowComponent} from '../../components/RowComponent';
import TitleComponent from '../../components/TitleComponent';
import TopAuthorBooks from '../../components/TopAuthorBooks';
import TopRatingBooks from '../../components/TopRatingBooks';
import Categories from './components/Categories';
import TopLikedSwiper from './components/TopLikedSwiper';
import {useSelector} from 'react-redux';
import {userSelector} from '../../redux/reducers/userReducer';
import {Image, TouchableOpacity} from 'react-native';
import ListeningComponent from '../../components/ListeningComponent';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';
import ButtonComponent from '../../components/ButtonComponent';

const HomeScreen = ({navigation}: any) => {
  const user = useSelector(userSelector);

  // const handleFixDatabase = async () => {
  //   await firestore()
  //     .collection(appInfos.databaseNames.users)
  //     .get()
  //     .then(snap => {
  //       if (snap.empty) {
  //         console.log('user not found');
  //       } else {
  //         snap.forEach(async (item: any) => {
  //           const user = item.data();

  //           firestore()
  //             .doc(`users/${item.id}`)
  //             .update({
  //               readings: firestore.FieldValue.delete(),
  //             })
  //             .then(() => console.log('Deleted reading'));
  //         });
  //       }
  //     });
  // };

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
