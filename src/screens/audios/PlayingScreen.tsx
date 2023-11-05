import Slider from '@react-native-community/slider';
import {
  Heart,
  SearchNormal1,
  VolumeHigh,
  VolumeLow,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import TrackPlayer, {
  Event,
  PlaybackActiveTrackChangedEvent,
  State,
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthorComponent from '../../components/AuthorComponent';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {appColors} from '../../constants/appColors';
import {Book} from '../../models';
import {Chap} from '../../models/Chapter';
import {globalStyles} from '../../styles/globalStyles';
import {GetTime} from '../../utils/getTime';
import {fontFamilies} from '../../constants/fontFamilies';
import TabbarComponent from '../../components/TabbarComponent';
import {InputCompoment} from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import ButtonIcon from '../../components/ButtonIcon';
import ModalChoiceChap from '../../modals/ModalChoiceChap';
import {useIsFocused} from '@react-navigation/native';
import {HandleAudio} from '../../utils/handleAudio';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';
import {useSelector} from 'react-redux';
import {userSelector} from '../../redux/reducers/userReducer';

const PlayingScreen = ({route, navigation}: any) => {
  const {
    key,
    audio,
    chaps,
    chapIndex,
  }: {
    key: string;
    audio: Book;
    chaps: Chap[];
    chapIndex: number;
  } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [activiTrack, setActiviTrack] =
    useState<PlaybackActiveTrackChangedEvent>();
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isVisibleModalChoiceChap, setIsVisibleModalChoiceChap] =
    useState(false);
  const [liked, setLiked] = useState<string[]>([]);

  const progress = useProgress();
  const playBackState = usePlaybackState();
  const theme = useColorScheme();
  const textColor = theme === 'light' ? appColors.dark : appColors.white;
  const iconSize = 20;
  const isFocused = useIsFocused();
  const auth = useSelector(userSelector);

  useEffect(() => {
    if (isFocused) {
      // HandleAudio.UpdateListening(audio.listens, audio.key as string);
    }
  }, [isFocused]);

  useEffect(() => {
    handleCheckLiked();
  }, [audio]);

  // useEffect(() => {
  //   TrackPlayer.addEventListener(
  //     Event.PlaybackActiveTrackChanged,
  //     async res => {
  //       res.track && setActiviTrack(res);
  //       // await TrackPlayer.pause();
  //     },
  //   );

  //   TrackPlayer.addEventListener(Event.PlaybackError, error =>
  //     console.log(error),
  //   );

  //   return () => {
  //     TrackPlayer.stop(); // Causes a crash
  //     TrackPlayer.reset(); // Also causes a crash :(
  //   };
  // }, []);

  // useEffect(() => {
  //   handleAddTrack();
  // }, [key, chaps, audio]);

  // useEffect(() => {
  //   if (
  //     playBackState.state === State.Buffering ||
  //     playBackState.state === State.Loading
  //   ) {
  //     setIsLoading(true);
  //   } else {
  //     setIsLoading(false);
  //   }

  //   if (playBackState.state === State.Ready) {
  //     TrackPlayer.play();
  //   }
  // }, [playBackState]);

  // useEffect(() => {
  //   if (chapIndex > 0) {
  //     handleSkipTo(chapIndex);
  //   }
  // }, [chapIndex]);

  // useEffect(() => {
  //   async function changeSpeed() {
  //     await TrackPlayer.setRate(speed);
  //   }

  //   changeSpeed();
  // }, [speed]);
  // useEffect(() => {
  //   async function changeVolume() {
  //     await TrackPlayer.setVolume(volume);
  //   }
  //   changeVolume();
  // }, [volume]);

  const handleCheckLiked = async () => {
    await firestore()
      .collection(appInfos.databaseNames.audios)
      .doc(audio.key)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setLiked(snap.data().liked ?? []);
        }
      });
  };

  const handleAddTrack = async () => {
    await TrackPlayer.reset().then(async () => {
      if (audio && chaps.length > 0) {
        // TrackPlayer.reset();
        const items: Track[] = [];
        chaps.forEach(item => {
          item.audio &&
            items.push({
              url: item.audio,
              ...item,
            });
        });
        await TrackPlayer.add(items);
      }
    });
  };

  const togglePlayer = async () => {
    if (playBackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleSkipTo = async (index: number) => {
    await TrackPlayer.skip(index);
  };

  return audio && chaps.length > 0 ? (
    <Container>
      <RowComponent styles={{padding: 16, justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="close"
            size={24}
            color={theme === 'dark' ? appColors.white : appColors.text}
          />
        </TouchableOpacity>
      </RowComponent>

      <SectionComponent
        styles={{justifyContent: 'center', alignItems: 'center'}}>
        <FastImage
          source={{uri: audio.image}}
          style={{width: 150, height: 150, borderRadius: 100}}
          resizeMode={FastImage.resizeMode.cover}
        />
        <SpaceComponent height={18} />
        <TitleComponent text={audio.title} size={22} flex={0} />
        <AuthorComponent authorId={audio.authorId} />
      </SectionComponent>

      <SectionComponent>
        <TextComponent
          text={
            activiTrack && activiTrack.track?.title
              ? activiTrack.track.title
              : ''
          }
          size={16}
          flex={1}
        />
        {activiTrack && activiTrack.track?.description && (
          <TextComponent text={activiTrack.track.description} />
        )}
        <SpaceComponent height={8} />
        <RowComponent>
          <TextComponent
            text={GetTime.getTimeProgress(progress.position)}
            flex={0}
            size={12}
            color={appColors.description}
            styles={{width: 40}}
          />
          <View style={{flex: 1}}>
            <Slider
              minimumTrackTintColor={appColors.primary}
              thumbTintColor={appColors.primary}
              maximumTrackTintColor="#e0e0e0"
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              onSlidingComplete={async val => {
                await TrackPlayer.seekTo(val);
              }}
            />
          </View>
          <TextComponent
            text={GetTime.getTimeProgress(progress.duration)}
            flex={0}
            size={12}
            styles={{width: 40}}
            color={appColors.description}
          />
        </RowComponent>
      </SectionComponent>

      <SectionComponent>
        <RowComponent styles={{justifyContent: 'space-around'}}>
          <TouchableOpacity
            disabled={activiTrack?.index === 0}
            onPress={async () => await TrackPlayer.skip(0)}>
            <Ionicons
              name="play-skip-back"
              size={iconSize - 2}
              color={activiTrack?.index === 0 ? appColors.gray : textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={activiTrack?.index === 0}
            onPress={async () => await TrackPlayer.skipToPrevious()}>
            <Ionicons
              name="play-back"
              size={iconSize}
              color={activiTrack?.index === 0 ? appColors.gray : textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={progress.position < 30}
            onPress={async () =>
              await TrackPlayer.seekTo(progress.position - 30)
            }>
            <MaterialIcons
              name="replay-30"
              size={iconSize + 2}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            onPress={togglePlayer}
            style={[
              styles.button,
              {
                padding: 12,
                backgroundColor:
                  theme === 'dark' ? appColors.white : appColors.dark,
                borderRadius: 100,
              },
            ]}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Ionicons
                name={playBackState.state === State.Playing ? 'pause' : 'play'}
                size={22}
                color={appColors.dark}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={progress.duration - progress.position < 30}
            onPress={async () =>
              await TrackPlayer.seekTo(progress.position + 30)
            }>
            <MaterialIcons
              name="forward-30"
              size={iconSize + 2}
              color={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={activiTrack?.index === chaps.length}
            onPress={async () => await TrackPlayer.skipToNext()}>
            <Ionicons
              name="play-forward"
              size={iconSize}
              color={
                activiTrack?.index === chaps.length - 1
                  ? appColors.gray
                  : textColor
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={activiTrack?.index === chaps.length - 1}
            onPress={async () => await TrackPlayer.skip(chaps.length - 1)}>
            <Ionicons
              name="play-skip-forward"
              size={iconSize - 2}
              color={
                activiTrack?.index === chaps.length - 1
                  ? appColors.gray
                  : textColor
              }
            />
          </TouchableOpacity>
        </RowComponent>
        <RowComponent
          styles={{
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <RowComponent styles={{flex: 1}}>
            <VolumeLow size={iconSize - 4} color={textColor} />
            <View style={{flex: 1}}>
              <Slider
                minimumTrackTintColor={appColors.primary}
                thumbTintColor={appColors.primary}
                maximumTrackTintColor="#e0e0e0"
                value={volume}
                minimumValue={0}
                maximumValue={1}
                onSlidingComplete={async val => setVolume(val)}
              />
            </View>
            <VolumeHigh size={iconSize - 4} color={textColor} />
          </RowComponent>
          <RowComponent styles={{flex: 1, justifyContent: 'flex-end'}}>
            <TouchableOpacity>
              <Ionicons
                name={`cloud-download-outline`}
                size={iconSize}
                color={textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                HandleAudio.UpdateLiked(
                  audio.liked,
                  audio.key as string,
                  auth.uid,
                ).then(res => handleCheckLiked())
              }
              style={{
                paddingHorizontal: 12,
              }}>
              <Ionicons
                name={liked.includes(auth.uid) ? `heart` : 'heart-outline'}
                size={iconSize}
                color={textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.rowCenter]}
              onPress={() =>
                setSpeed(
                  speed === 0.5
                    ? 1
                    : speed === 1
                    ? 1.5
                    : speed === 1.5
                    ? 2
                    : 0.5,
                )
              }>
              <TitleComponent
                text={`x${speed.toFixed(1)}`}
                flex={0}
                size={16}
              />
            </TouchableOpacity>
          </RowComponent>
        </RowComponent>
      </SectionComponent>

      <View style={{flex: 1, paddingHorizontal: 16}}>
        <RowComponent>
          <TitleComponent text="Playlist" flex={1} />
          <ButtonIcon
            icon={<SearchNormal1 size={iconSize} color={textColor} />}
            onPress={() => setIsVisibleModalChoiceChap(true)}
          />
        </RowComponent>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={chaps}
          style={{paddingTop: 8}}
          renderItem={({item, index}) => (
            <RowComponent
              key={`item${index}`}
              onPress={
                activiTrack?.index !== index
                  ? () => handleSkipTo(index)
                  : undefined
              }
              styles={{
                marginBottom: 16,
                justifyContent: 'space-between',
              }}>
              <TextComponent
                text={item.title}
                flex={0}
                color={
                  activiTrack?.index === index
                    ? appColors.primary
                    : theme === 'dark'
                    ? appColors.white
                    : appColors.text
                }
                font={fontFamilies.medium}
              />
              {activiTrack?.index === index && (
                <TextComponent
                  size={12}
                  color={appColors.gray}
                  text={`Playing`}
                  flex={0}
                />
              )}
            </RowComponent>
          )}
        />
      </View>
      <ModalChoiceChap
        visible={isVisibleModalChoiceChap}
        onClose={() => setIsVisibleModalChoiceChap(false)}
        index={activiTrack?.index ? activiTrack.index : 0}
        onSelected={async index => {
          await TrackPlayer.skip(index);
          setIsVisibleModalChoiceChap(false);
        }}
      />
    </Container>
  ) : (
    <></>
  );
};
export default PlayingScreen;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
