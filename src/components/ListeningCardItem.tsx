import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../constants/appColors';
import {appInfos} from '../constants/appInfos';
import {fontFamilies} from '../constants/fontFamilies';
import {Book, Chapter, Listening} from '../models/Book';
import {GetTime} from '../utils/getTime';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';
import {RowComponent} from './RowComponent';
import FastImage from 'react-native-fast-image';
import LinkComponent from './LinkComponent';
import {globalStyles} from '../styles/globalStyles';

const ListeningCardItem = ({
  item,
  styles,
  type,
}: {
  item: Listening;
  styles?: StyleProp<ViewStyle>;
  type?: 'horizontal' | 'vertical';
}) => {
  const [audio, setaudio] = useState<Book>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const size = (appInfos.sizes.width - 52) / 3;
  const navigation: any = useNavigation();

  useEffect(() => {
    getBook();
  }, [item]);

  useEffect(() => {
    getChapterInfo();
  }, [audio]);

  const getBook = async () => {
    await firestore()
      .doc(`${appInfos.databaseNames.audios}/${item.audioId}`)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setaudio({
            key: item.audioId,
            ...snap.data(),
          });
        }
      });
  };

  const getChapterInfo = async () => {
    audio &&
      (await firestore()
        .collection(appInfos.databaseNames.chapters)
        .doc(audio.chapsId)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            setChapters(snap.data().chaps);
          }
        })
        .catch(error => {
          console.log(error);
        }));
  };

  const renderListening = () => {
    const chapter = chapters[item.chap - 1];

    return chapter ? (
      <RowComponent
        onPress={handleAddPlaylist}
        key={item.key}
        styles={[globalStyles.shadow, {marginBottom: 18}]}>
        <FastImage
          source={{uri: chapter.cover ? chapter.cover : audio?.image}}
          style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            marginRight: 12,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{flex: 1}}>
          <TitleComponent text={audio?.title ?? ''} />
          <TextComponent
            flex={1}
            text={`${chapter.title} - ${GetTime.getTimeProgress(
              item.position,
            )}`}
          />
          <TextComponent
            text={GetTime.getFullTimeString(item.date, true)}
            flex={1}
          />
          <LinkComponent text="Nghe tiếp" onPress={handleAddPlaylist} />
        </View>
      </RowComponent>
    ) : (
      <></>
    );
  };

  const handleAddPlaylist = () => {
    if (audio) {
      const data = {
        key: audio.chapsId,
        audio,
        chaps: chapters,
        chapIndex: item.chap - 1,
        position: item.position,
      };

      chapters.length > 0 && navigation.navigate('PlayingScreen', data);
    }
  };

  return audio ? (
    !type || type === 'vertical' ? (
      <TouchableOpacity onPress={handleAddPlaylist} style={[styles]}>
        <ImageBackground
          source={{uri: audio.image}}
          style={{
            width: size,
            height: size * 1.4,
            marginBottom: 16,
          }}
          imageStyle={{
            borderRadius: 12,
          }}
          resizeMode="cover">
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
            }}>
            <Ionicons name="play" size={32} color={appColors.white} />
            <SpaceComponent height={12} />
            <TitleComponent
              color={appColors.white}
              font={fontFamilies.medium}
              flex={0}
              text={
                chapters[item.chap - 1] ? chapters[item.chap - 1].title : ''
              }
              size={16}
            />
            <TextComponent
              color={appColors.white}
              flex={0}
              size={12}
              text={GetTime.getTimeProgress(item.position)}
            />
            <SpaceComponent height={8} />
            <TextComponent
              color={appColors.white}
              size={12}
              flex={0}
              text={GetTime.getFullTimeString(item.date, true)}
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    ) : (
      renderListening()
    )
  ) : (
    <></>
  );
};

export default ListeningCardItem;
