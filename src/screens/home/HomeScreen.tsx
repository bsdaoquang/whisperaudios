/** @format */

import React from 'react';
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

const HomeScreen = ({navigation}: any) => {
  const user = useSelector(userSelector);

  const handleFixData = () => {
    // firestore().collection(appInfos.databaseNames.audios).get().then(snap => {
    //   snap.forEach(item => {
    //     firestore().collection(appInfos.databaseNames.audios).doc(item.id).update({followers: []})
    //   })
    // })
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
      {/* <ButtonComponent text="Update" onPress={handleFixData} /> */}
      <LatestBooks />
      <TopAuthorBooks />
      <TopRatingBooks />
    </Container>
  );
};

export default HomeScreen;
