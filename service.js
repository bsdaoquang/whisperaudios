import TrackPlayer, {Event} from 'react-native-track-player';
import {handleAuthentication} from './src/utils/handleAuthentication';
import {HandleAudio} from './src/utils/handleAudio';

// const handleSaveListenBook = async event => {
//   const res = await AsyncStorage.getItem('bookData');
//   if (res) {
//     const data = JSON.parse(res);
//     if (data) {
//       handleBook.handleAddChapListening(data.uid, data.bookId, event.nextTrack);
//     } else {
//       console.log('Không có data');
//     }
//   } else {
//     console.log('Không có dữ liệu');
//   }
// };

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, async event => {
    const progress = await TrackPlayer.getProgress();
    const trackIndex = await TrackPlayer.getActiveTrackIndex();
    await HandleAudio.SaveListeningProgress(progress.position, trackIndex);
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => await TrackPlayer.skipToNext(),
  );

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, res => {
    console.log('fafs');
  });

  TrackPlayer.addEventListener('playback-track-changed', async event => {
    const trackIndex = await TrackPlayer.getActiveTrackIndex();

    await HandleAudio.UpdateTrackListened(trackIndex);
  });

  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    async () => await TrackPlayer.skipToPrevious(),
  );

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop().then(async () => {
      await TrackPlayer.removeUpcomingTracks();
    });
  });
};
