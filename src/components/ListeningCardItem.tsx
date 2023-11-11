import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {ImageBackground, TouchableOpacity, View} from 'react-native';
import {appInfos} from '../constants/appInfos';
import {Book, Chapter, Listening} from '../models/Book';
import TitleComponent from './TitleComponent';
import {GetTime} from '../utils/getTime';
import {PlayCircle} from 'iconsax-react-native';
import {appColors} from '../constants/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const ListeningCardItem = ({item}: {item: Listening}) => {
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

  const handleAddPlaylist = () => {
    if (audio) {
      const data = {
        key: audio.chapsId,
        audio,
        chaps: chapters,
        chapIndex: item.chap,
        position: item.position,
      };

      chapters.length > 0 && navigation.navigate('PlayingScreen', data);
    }
  };

  return audio ? (
    <TouchableOpacity onPress={handleAddPlaylist}>
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
          }}>
          <Ionicons name="play" size={32} color={appColors.white} />
          <TitleComponent
            flex={0}
            text={GetTime.getTimeProgress(item.position)}
            size={16}
          />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  ) : (
    <></>
  );
};

export default ListeningCardItem;
