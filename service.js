import TrackPlayer, {Event} from 'react-native-track-player';
import {HandleAudio} from './src/utils/handleAudio';

const handleGetAndUpdateProgress = async () => {
  const progress = await TrackPlayer.getProgress();
  const trackIndex = await TrackPlayer.getActiveTrackIndex();
  await HandleAudio.HandleUpdateListening(trackIndex, progress.position);
};

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, async event => {
    await handleGetAndUpdateProgress();
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await handleGetAndUpdateProgress();
    await TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, res => {
    console.log('fafs');
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async event => {
    await TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await handleGetAndUpdateProgress();
    await TrackPlayer.skipToPrevious();
  });
};
