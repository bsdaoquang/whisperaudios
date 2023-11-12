import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import {
  ArrowLeft2,
  SearchNormal1,
  VolumeHigh,
  VolumeLow,
} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  NativeEventEmitter,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import FastImage from 'react-native-fast-image';
import TrackPlayer, {
  Event,
  PlaybackActiveTrackChangedEvent,
  State,
  Track,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import AuthorComponent from '../../components/AuthorComponent';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import LoadingModal from '../../modals/LoadingModal';
import ModalChoiceChap from '../../modals/ModalChoiceChap';
import ModalSchedulerTimer from '../../modals/ModalSchedulerTimer';
import {Book} from '../../models';
import {Chap} from '../../models/Chapter';
import {userSelector} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles/globalStyles';
import {GetTime} from '../../utils/getTime';
import {HandleAudio} from '../../utils/handleAudio';
import {showToast} from '../../utils/showToast';
import AudioItem from './components/AudioItem';
const eventEmitter = new NativeEventEmitter();

const PlayingScreen = ({route, navigation}: any) => {
  const {
    key,
    audio,
    chaps,
    chapIndex,
    position,
  }: {
    key: string;
    audio: Book;
    chaps: Chap[];
    chapIndex: number;
    position: number;
  } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [activiTrack, setActiviTrack] =
    useState<PlaybackActiveTrackChangedEvent>();
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isVisibleModalChoiceChap, setIsVisibleModalChoiceChap] =
    useState(false);
  const [isVisibleModalSleepTimer, setIsVisibleModalSleepTimer] =
    useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [schedulerTime, setSchedulerTime] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const progress = useProgress();
  const playBackState = usePlaybackState();
  const theme = useColorScheme();
  const textColor = theme === 'light' ? appColors.dark : appColors.white;
  const iconSize = 20;
  const isFocused = useIsFocused();
  const auth = useSelector(userSelector);

  useEffect(() => {}, [audio]);

  useEffect(() => {
    TrackPlayer.addEventListener(
      Event.PlaybackActiveTrackChanged,
      async res => {
        if (res.track) {
          setActiviTrack(res);
        }
      },
    );

    TrackPlayer.addEventListener(Event.PlaybackError, error =>
      showToast(error.message),
    );

    return () => {
      TrackPlayer.stop(); // Causes a crash
      TrackPlayer.reset(); // Also causes a crash :(
    };
  }, []);

  useEffect(() => {
    if (activiTrack) {
      // console.log(activiTrack);
      // HandleAudio.HandleUpdateListening(
      //   activiTrack.lastIndex as number,
      //   activiTrack.lastPosition,
      // );
    }
  }, [activiTrack?.index]);

  useEffect(() => {
    handleAddTrack();
  }, [key, chaps, audio]);

  useEffect(() => {
    if (
      playBackState.state === State.Buffering ||
      playBackState.state === State.Loading
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }

    if (playBackState.state === State.Ready) {
      TrackPlayer.play();
    }
  }, [playBackState]);

  useEffect(() => {
    if (chapIndex > 0) {
      handleSkipTo(chapIndex);
    }
  }, [chapIndex]);

  useEffect(() => {
    async function changeSpeed() {
      await TrackPlayer.setRate(speed);
    }

    changeSpeed();
  }, [speed]);

  useEffect(() => {
    async function changeVolume() {
      await TrackPlayer.setVolume(volume);
    }
    changeVolume();
  }, [volume]);

  useEffect(() => {
    async function changePosition() {
      await TrackPlayer.seekTo(position);
    }

    changePosition();
  }, [position]);

  const backAction = () => {
    Alert.alert(
      'Khoan đã!',
      'Quá trình nghe sẽ bị dừng lại, bạn muốn nghe audio khác?',
      [
        {
          text: 'Tiếp tục nghe',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Thoát',
          onPress: async () => {
            await TrackPlayer.pause().then(() => navigation.goBack());
          },
        },
      ],
    );
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleStopPlaylist = async () => {
    setIsUpdating(true);
    await HandleAudio.HandleUpdateListening(
      activiTrack?.index ?? 0,
      progress.position,
    );
    await TrackPlayer.stop();
    await TrackPlayer.removeUpcomingTracks();
    await AsyncStorage.removeItem(appInfos.localNames.audioId);
    setIsUpdating(false);
    navigation.goBack();
  };

  const handleSkipTo = async (index: number) => {
    await TrackPlayer.skip(index);
  };

  const handleAddTrack = async () => {
    await AsyncStorage.setItem(
      appInfos.localNames.audioId,
      audio.key as string,
    );
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
      await HandleAudio.HandleUpdateListening(
        activiTrack?.index as number,
        (
          await TrackPlayer.getProgress()
        ).position,
      );
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const handleScheduler = async (time: number) => {
    // Start a timer that runs once after X milliseconds

    let timeoutId;

    if (schedulerTime === 0) {
      BackgroundTimer.stop();
    } else {
      timeoutId = BackgroundTimer.setTimeout(async () => {
        await TrackPlayer.pause();
      }, time * 60 * 1000);
    }

    showToast(
      schedulerTime === 0
        ? `Đã hẹn giờ tắt sau ${time} phút nữa`
        : 'Đã tắt hẹn giờ',
    );
    setIsVisibleModalSleepTimer(false);
  };

  const handleGetCurrent = async () => {
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();

    currentTrackIndex &&
      currentTrackIndex >= 0 &&
      HandleAudio.HandleUpdateListening(currentTrackIndex, progress.position);
  };

  return audio && chaps.length > 0 ? (
    <Container>
      <RowComponent styles={{padding: 16, justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={backAction}>
          <ArrowLeft2
            size={26}
            color={theme === 'dark' ? appColors.white : appColors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.rowCenter]}
          onPress={handleStopPlaylist}>
          <TextComponent text="Xoá danh sách phát" />
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
            onPress={async () => {
              await handleGetCurrent();
              await TrackPlayer.skip(0);
            }}>
            <Ionicons
              name="play-skip-back"
              size={iconSize - 2}
              color={activiTrack?.index === 0 ? appColors.gray : textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={activiTrack?.index === 0}
            onPress={async () => {
              await handleGetCurrent();
              await TrackPlayer.skipToPrevious();
            }}>
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
            onPress={async () => {
              await handleGetCurrent();
              await TrackPlayer.skipToNext();
            }}>
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
            onPress={async () => {
              await handleGetCurrent();
              await TrackPlayer.skip(chaps.length - 1);
            }}>
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
            <ButtonIcon
              onPress={
                schedulerTime > 0
                  ? () => {
                      setSchedulerTime(0);
                      handleScheduler(0);
                    }
                  : () => setIsVisibleModalSleepTimer(true)
              }
              icon={
                <MaterialCommunityIcons
                  name={schedulerTime > 0 ? 'sleep-off' : `power-sleep`}
                  size={iconSize + 2}
                  color={textColor}
                />
              }
            />
            <ButtonIcon
              onPress={() =>
                HandleAudio.UpdateLiked(
                  audio.liked,
                  audio.key as string,
                  auth.uid,
                )
              }
              styles={{
                paddingHorizontal: 12,
              }}
              icon={
                <Ionicons
                  name={liked.includes(auth.uid) ? `heart` : 'heart-outline'}
                  size={iconSize}
                  color={textColor}
                />
              }
            />

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
            <AudioItem
              item={item}
              index={index}
              onSelectChap={async index => await TrackPlayer.skip(index)}
              activeChap={activiTrack?.index ? activiTrack.index : 0}
            />
          )}
        />
      </View>
      <ModalSchedulerTimer
        visible={isVisibleModalSleepTimer}
        onClose={() => setIsVisibleModalSleepTimer(false)}
        onSelected={time => {
          setSchedulerTime(time);
          handleScheduler(time);
        }}
      />
      <ModalChoiceChap
        visible={isVisibleModalChoiceChap}
        onClose={() => setIsVisibleModalChoiceChap(false)}
        index={activiTrack?.index ? activiTrack.index : 0}
        onSelected={async index => {
          await TrackPlayer.skip(index);
          setIsVisibleModalChoiceChap(false);
        }}
      />

      <LoadingModal visible={isUpdating} />
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
