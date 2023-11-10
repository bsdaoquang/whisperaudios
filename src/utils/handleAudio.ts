import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {showToast} from './showToast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ref = firestore().collection(appInfos.databaseNames.audios);
export class HandleAudio {
  static UpdateLiked = async (liked: string[], key: string, uid: string) => {
    if (liked.includes(uid)) {
      const index = liked.findIndex(element => element === uid);

      liked.splice(index, 1);
      showToast('Đã xoá khỏi danh sách yêu thích');
    } else {
      liked.push(uid);
      showToast('Đã thêm vào danh sách yêu thích');
    }

    await ref
      .doc(key)
      .update({
        liked,
      })
      .then(() => {
        return 'OK';
      });
  };
  static SaveListeningProgress = async (position: number, chap: number) => {
    const uid = await AsyncStorage.getItem(appInfos.localNames.uid);
    const audioId = await AsyncStorage.getItem(appInfos.localNames.audioId);

    if (uid && audioId) {
      firestore()
        .collection(appInfos.databaseNames.users)
        .doc(uid)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            const data: any = snap.data().listening ?? {};

            const listening = {...data};
            const audio = listening[`${audioId}`];

            listening[`${audioId}`] = {
              ...audio,
              position,
              chap: chap + 1,
              date: Date.now(),
            };

            firestore()
              .collection(appInfos.databaseNames.users)
              .doc(uid)
              .update({
                listening: data,
              })
              .then(() => console.log('Chaps updated'));
          }
        });
    }
  };
  static UpdateTrackListened = async (index: number) => {
    const uid = await AsyncStorage.getItem(appInfos.localNames.uid);
    const audioId = await AsyncStorage.getItem(appInfos.localNames.audioId);

    if (uid && audioId) {
      firestore()
        .collection(appInfos.databaseNames.users)
        .doc(uid)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            const data: any = snap.data().listening ?? {};

            const listening = {...data};
            const audio = listening[`${audioId}`];
            const chaps =
              listening[`${audioId}`] && listening[`${audioId}`].chaps
                ? listening[`${audioId}`].chaps
                : [];

            !chaps.includes(index + 1) && chaps.push(index + 1);

            listening[`${audioId}`] = {
              ...audio,
              chaps,
            };

            firestore()
              .collection(appInfos.databaseNames.users)
              .doc(uid)
              .update({
                listening,
              })
              .then(() => console.log('Chaps updated'));
          }
        });
    }
  };
}
