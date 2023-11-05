import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {showToast} from './showToast';

const ref = firestore().collection(appInfos.databaseNames.audios);
export class HandleAudio {
  static UpdateListening = async (listen: number, key: string) => {
    await ref
      .doc(key)
      .update({
        listens: listen + 1,
      })
      .then(() => {
        console.log('Listens updated');
      });
  };

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
}
