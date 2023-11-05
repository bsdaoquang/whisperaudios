import TrackPlayer, {Event} from 'react-native-track-player';

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
    // await handleSaveListenBook(event);
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
