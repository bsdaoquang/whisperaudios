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
  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => await TrackPlayer.play(),
  );
  TrackPlayer.addEventListener(Event.RemotePause, async event => {
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => await TrackPlayer.skipToNext(),
  );

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

  // TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
  //   await TrackPlayer.stop();
  // });

  // TrackPlayer.addEventListener(
  //   Event.RemoteJumpBackward,
  //   async () => await TrackPlayer.skip(0),
  // );
  // TrackPlayer.addEventListener('remote-jump-forward', async () =>
  //   TrackPlayer.seekTo((await TrackPlayer.getProgress().position) + 15),
  // );
};
