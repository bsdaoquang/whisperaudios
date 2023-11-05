import Slider from '@react-native-community/slider';
import React, {ReactNode, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
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
import {GetTime} from '../../utils/getTime';

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

  const [index, setIndex] = useState(chapIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [activiTrack, setActiviTrack] =
    useState<PlaybackActiveTrackChangedEvent>();

  const progress = useProgress();
  const playBackState = usePlaybackState();
  const theme = useColorScheme();
  const textColor = theme === 'light' ? appColors.dark : appColors.white;
  const iconSize = 20;

  useEffect(() => {
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, res => {
      res.track && setActiviTrack(res);
    });

    TrackPlayer.addEventListener(Event.PlaybackError, error =>
      console.log(error),
    );

    return () => {
      TrackPlayer.stop(); // Causes a crash
      TrackPlayer.reset(); // Also causes a crash :(
    };
  }, []);

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
      </SectionComponent>
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
