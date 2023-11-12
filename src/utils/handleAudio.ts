import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {showToast} from './showToast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

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

  static UpdateFollowers = async (audioId: string) => {
    const uid = await AsyncStorage.getItem(appInfos.localNames.uid);

    if (uid) {
      firestore()
        .doc(`${appInfos.databaseNames.audios}/${audioId}`)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            firestore()
              .doc(`${appInfos.databaseNames.audios}/${audioId}`)
              .update({
                followers:
                  snap.data().followers && snap.data().followers.includes(uid)
                    ? firestore.FieldValue.arrayRemove(uid)
                    : firestore.FieldValue.arrayUnion(uid),
              })
              .then(() => {
                console.log('Done');
              });
          }
        });
    } else {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để thực hiện chức năng này');
    }
  };

  static HandleUpdateListening = async (track: number, position: number) => {
    const uid = await AsyncStorage.getItem(appInfos.localNames.uid);
    const audioId = await AsyncStorage.getItem(appInfos.localNames.audioId);

    if (audioId && uid && track + 1 > 0 && position >= 0) {
      const ref = firestore()
        .collection(`${appInfos.databaseNames.listenings}`)
        .where('uid', '==', uid)
        .where('audioId', '==', audioId)
        .where('chap', '==', track + 1);

      ref.get().then(snap => {
        const data = {
          chap: track + 1,
          audioId,
          uid,
          date: Date.now(),
          position,
        };

        if (snap.empty) {
          firestore()
            .collection(appInfos.databaseNames.listenings)
            .add(data)
            .then(() => {
              console.log('Listening added!!!');
            });
        } else {
          snap.forEach(async (item: any) => {
            await firestore()
              .collection(appInfos.databaseNames.listenings)
              .doc(item.id)
              .update(data)
              .then(() => {
                console.log('Listening updated!!!');
              });
          });
        }
      });

      // await ref.get().then((snap: any) => {
      //   if (snap.exists) {
      //     const data: {
      //       date: number;
      //       chaps: {chap: number; position: number; date: number}[];
      //     } = snap.data();

      //     const chaps = data.chaps;

      //     const item = {
      //       chap: track + 1,
      //       position,
      //       date: Date.now(),
      //     };

      //     const index = chaps.findIndex(element => element.chap === track + 1);

      //     if (index !== -1) {
      //       chaps[index] = item;
      //       ref.update({
      //         date: Date.now(),
      //         chaps,
      //       });
      //     } else {
      //       ref.update({
      //         date: Date.now(),
      //         chaps: firestore.FieldValue.arrayUnion(item),
      //       });
      //     }
      //   } else {
      //     const data = {
      //       date: Date.now(),
      //       chaps: [
      //         {
      //           chap: track + 1,
      //           position,
      //           date: Date.now(),
      //         },
      //       ],
      //     };

      //     ref.set(data).then(() => console.log('Listening updated!!!'));
      //   }
      // });
    }
  };
}
