/** @format */

import {Rating} from '@kolking/react-native-rating';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import AuthorComponent from '../../components/AuthorComponent';
import Container from '../../components/Container';
import {LoadingComponent} from '../../components/LoadingComponent';
import RatingItemComponent from '../../components/RatingItemComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TagComponent from '../../components/TagComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {fontFamilies} from '../../constants/fontFamilies';
import ModalRating from '../../modals/ModalRating';
import {Book} from '../../models';
import {Chapter, Listening} from '../../models/Book';
import {RatingModel} from '../../models/RatingModel';
import {userSelector} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles/globalStyles';
import HeaderAudioDetail from './components/HeaderAudioDetail';
import Infocomponent from './components/Infocomponent';
import LinkComponent from '../../components/LinkComponent';
import {GetTime} from '../../utils/getTime';

const AudioDetail = ({route, navigation}: any) => {
  const {audio}: {audio: Book} = route.params;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [tabSelected, setTabSelected] = useState<'info' | 'chaps'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [ratings, setRatings] = useState<RatingModel[]>([]);
  const [totalRating, setTotalRating] = useState(0);
  const [star, setStar] = useState(0);
  const [isVisibleModalRating, setIsVisibleModalRating] = useState(false);
  const [listening, setListening] = useState<Listening>();

  const auth = useSelector(userSelector);

  useEffect(() => {
    getChapterInfo();
    getListening();
    getRatings();
  }, [audio]);

  useEffect(() => {
    if (ratings.length > 0) {
      const total = ratings.reduce((a, b) => a + b.star, 0);
      setTotalRating(total / ratings.length);
    }
  }, [ratings]);

  const getListening = async () => {
    if (auth) {
      firestore()
        .collection(appInfos.databaseNames.listenings)
        .where('audioId', '==', audio.key)
        .where('uid', '==', auth.uid)
        .onSnapshot(snap => {
          if (!snap.empty) {
            snap.forEach((item: any) => {
              setListening({
                key: item.id,
                ...item.data(),
              });
            });
          }
        });
    }
  };

  const getChapterInfo = async () => {
    setIsLoading(true);
    await firestore()
      .collection(appInfos.databaseNames.chapters)
      .doc(audio.chapsId)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setChapters(snap.data().chaps);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const handleAddPlaylist = (index: number, position?: number) => {
    const data = {
      key: audio.chapsId,
      audio,
      chaps: chapters,
      chapIndex: index,
      position: position ?? 0,
    };

    chapters.length > 0 && navigation.navigate('PlayingScreen', data);
  };

  const getRatings = () => {
    firestore()
      .collection(appInfos.databaseNames.ratings)
      .where('bookId', '==', audio.key)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log(`Rating not yet`);
        } else {
          const items: RatingModel[] = [];

          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });

          setRatings(items);
        }
      });
  };

  const handleRating = (num: number) => {
    if (auth) {
      setStar(num);
      setIsVisibleModalRating(true);
    } else {
      setStar(0);
      Alert.alert(
        'Đăng nhập',
        'Vui lòng đăng nhập và để lại đánh giá của bạn!',
        [
          {
            style: 'default',
            text: 'Đồng ý',
            onPress: () => navigation.navigate('ProfileTab'),
          },
        ],
      );
    }
  };

  return (
    <Container>
      <ImageBackground
        source={{uri: audio.image}}
        style={{
          width: appInfos.sizes.width,
          height: appInfos.sizes.height,
        }}
        imageStyle={{resizeMode: 'cover'}}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.75]}
          style={{flex: 1}}>
          <HeaderAudioDetail />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{paddingTop: '50%'}} />
            <SectionComponent>
              <RowComponent styles={{marginBottom: 8}}>
                <TagComponent
                  icon={
                    <AntDesign
                      name="star"
                      size={14}
                      color={appColors.primary}
                      style={{marginRight: 4}}
                    />
                  }
                  text={totalRating.toFixed(1)}
                  styles={styles.tag}
                  textStyle={{color: appColors.primary, fontSize: 12}}
                />
                <TagComponent
                  icon={
                    <MaterialCommunityIcons
                      name="playlist-music"
                      size={17}
                      color={appColors.primary}
                      style={{marginRight: 4}}
                    />
                  }
                  text={audio.totalChaps?.toString() ?? ''}
                  styles={styles.tag}
                  textStyle={{color: appColors.primary, fontSize: 12}}
                />
                <TagComponent
                  icon={
                    <MaterialCommunityIcons
                      name="motion-play"
                      size={14}
                      color={appColors.primary}
                      style={{marginRight: 4}}
                    />
                  }
                  text={audio.listens.toString() ?? '0'}
                  styles={styles.tag}
                  textStyle={{color: appColors.primary, fontSize: 12}}
                />
              </RowComponent>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TitleComponent
                  text={audio.title}
                  flex={0}
                  font={fontFamilies.bold}
                  color={appColors.light}
                  size={22}
                  line={2}
                  styles={{textAlign: 'center'}}
                />
                <RowComponent>
                  <TextComponent text="By: " flex={0} color={appColors.light} />
                  <AuthorComponent
                    authorId={audio.authorId}
                    textStyle={{color: appColors.white}}
                  />
                </RowComponent>
              </View>
            </SectionComponent>
            <SectionComponent>
              <RowComponent
                styles={{
                  backgroundColor: `rgba(245, 245, 246, 0.1)`,
                  // opacity: 0.5,
                  borderRadius: 100,
                  padding: 4,
                }}>
                <TouchableOpacity
                  onPress={() => setTabSelected('info')}
                  style={[
                    styles.tab,
                    {
                      borderRadius: 100,
                      backgroundColor:
                        tabSelected === 'info'
                          ? `rgba(245, 245, 246, 0.8)`
                          : undefined,
                    },
                  ]}>
                  <TextComponent
                    text="Infomations"
                    color={
                      tabSelected === 'info' ? appColors.text : appColors.white
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTabSelected('chaps')}
                  style={[
                    styles.tab,
                    {
                      borderRadius: 100,
                      backgroundColor:
                        tabSelected === 'chaps'
                          ? `rgba(245, 245, 246, 0.8)`
                          : undefined,
                    },
                  ]}>
                  <TextComponent
                    text="Chapters"
                    color={
                      tabSelected === 'chaps' ? appColors.text : appColors.white
                    }
                  />
                </TouchableOpacity>
              </RowComponent>
            </SectionComponent>

            {tabSelected === 'info' ? (
              <>
                <Infocomponent item={audio} />
                <SectionComponent>
                  <TitleComponent text="Đánh giá" />
                  <TextComponent text="Bạn thấy audio này thế nào" flex={1} />
                  <RowComponent styles={{paddingVertical: 16}}>
                    <Rating
                      rating={star}
                      size={38}
                      variant="stars-outline"
                      fillColor={appColors.yellow4}
                      touchColor={appColors.yellow4}
                      onChange={val => handleRating(val)}
                    />
                  </RowComponent>
                  <SpaceComponent height={18} />
                  <TextComponent
                    text="Điểm đánh giá bởi những người dùng khác đã nghe audio này"
                    line={2}
                  />
                  <View style={{alignItems: 'center'}}>
                    <TitleComponent
                      text={totalRating.toFixed(1)}
                      size={42}
                      flex={0}
                    />
                    <Rating
                      disabled
                      rating={totalRating}
                      size={14}
                      fillColor={appColors.yellow4}
                    />
                    <TextComponent
                      text={`${ratings.length} lượt đánh giá`}
                      size={12}
                      flex={0}
                      styles={{paddingVertical: 8}}
                    />
                  </View>

                  {ratings.map(
                    (item, index) =>
                      index < 6 && (
                        <RatingItemComponent item={item} key={item.key} />
                      ),
                  )}

                  <LinkComponent
                    text="Xem tất cả đánh giá"
                    onPress={() =>
                      navigation.navigate('RatingsScreen', {ratings})
                    }
                  />
                </SectionComponent>
              </>
            ) : chapters.length > 0 ? (
              chapters.map((item, index) => (
                <RowComponent
                  key={`item${index}`}
                  onPress={() => handleAddPlaylist(index)}
                  styles={{
                    paddingHorizontal: 16,
                    marginBottom: 16,
                  }}>
                  <TextComponent
                    text={item.title}
                    flex={1}
                    font={fontFamilies.medium}
                    color={
                      listening
                        ? listening.chaps && listening.chaps.includes(index - 1)
                          ? appColors.gray
                          : appColors.white
                        : appColors.white
                    }
                  />
                </RowComponent>
              ))
            ) : (
              <LoadingComponent isLoading={isLoading} value={chapters.length} />
            )}
          </ScrollView>
          {chapters.length > 0 && listening ? (
            <RowComponent styles={{paddingVertical: 12}}>
              <TouchableOpacity
                style={{flex: 2, alignItems: 'center'}}
                onPress={() =>
                  handleAddPlaylist(listening.chap - 1, listening.position)
                }>
                <TextComponent
                  color={appColors.link}
                  text={`Nghe tiếp ${
                    chapters[listening.chap - 1].title
                  } - ${GetTime.getTimeProgress(listening.position)}`}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAddPlaylist(0)}
                style={[
                  styles.tab,
                  globalStyles.rowCenter,
                  {
                    flex: 1,
                    backgroundColor: `rgba(245, 245, 246, 1)`,
                    paddingHorizontal: 16,
                  },
                ]}>
                <MaterialCommunityIcons
                  name="motion-play"
                  size={14}
                  color={appColors.primary}
                  style={{marginRight: 4}}
                />
                <TextComponent text="Nghe từ đầu" color={appColors.primary} />
              </TouchableOpacity>
            </RowComponent>
          ) : (
            <View
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
              }}>
              <TouchableOpacity
                onPress={() => handleAddPlaylist(0)}
                style={[
                  styles.tab,
                  globalStyles.rowCenter,
                  {
                    backgroundColor: `rgba(245, 245, 246, 1)`,
                    paddingHorizontal: 16,
                  },
                ]}>
                <MaterialCommunityIcons
                  name="motion-play"
                  size={14}
                  color={appColors.primary}
                  style={{marginRight: 4}}
                />
                <TextComponent text="Nghe từ đầu" color={appColors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
      <ModalRating
        visible={isVisibleModalRating}
        onClose={() => {
          setStar(0);
          setIsVisibleModalRating(false);
        }}
        audioId={audio.key as string}
        star={star}
      />
    </Container>
  );
};

export default AudioDetail;
const styles = StyleSheet.create({
  tag: {
    backgroundColor: appColors.white,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tab: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: appColors.white,
    borderRadius: 100,
  },
});
