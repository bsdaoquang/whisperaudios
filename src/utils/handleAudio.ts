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

    const ref = firestore().collection(appInfos.databaseNames.listenings);

    if (uid && audioId) {
      ref
        .where('uid', '==', uid)
        .where('audioId', '==', audioId)
        .get()
        .then(snap => {
          if (snap.empty) {
            const data = {
              uid,
              audioId,
              chaps: [chap ? chap + 1 : 1],
              position,
              chap: chap + 1,
              date: Date.now(),
            };

            ref.add(data).then(() => console.log('Listening added'));
          } else {
            snap.forEach(item => {
              const listening: any = item.data();

              listening.chap = chap + 1;
              (listening.position = position), (listening.date = Date.now());

              ref
                .doc(item.id)
                .update(listening)
                .then(() => console.log('Listening updated!!!'));
            });
          }
        });
    }
  };
  static UpdateTrackListened = async (index: number) => {
    const uid = await AsyncStorage.getItem(appInfos.localNames.uid);
    const audioId = await AsyncStorage.getItem(appInfos.localNames.audioId);

    const ref = firestore().collection(appInfos.databaseNames.listenings);

    if (uid && audioId) {
      ref
        .where('uid', '==', uid)
        .where('audioId', '==', audioId)
        .get()
        .then(snap => {
          if (snap.empty) {
            const data = {
              uid,
              audioId,
              chaps: [index ? index + 1 : 1],
            };

            ref.add(data).then(() => console.log('Listening added'));
          } else {
            snap.forEach(item => {
              const listening: any = item.data();

              const chaps = listening.chaps ?? [];

              !chaps.includes(index + 1) && chaps.push(index + 1);

              const data = {...listening, chaps};

              ref
                .doc(item.id)
                .update(data)
                .then(() => console.log('Listening updated!!!'));
            });
          }
        });
    }
  };
}
