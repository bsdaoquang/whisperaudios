import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';

//request permision for message
export const requestUserPermission = async () => {
  messaging().setBackgroundMessageHandler(async () => {});
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFCMToken();
  }
};

export const getFCMToken = async () => {
  // Chỉ những user đã đăng nhập mới lấy fcm token
  // Sau khi lấy thì lưu vào user database

  const user = auth().currentUser;

  if (user) {
    const fcmtoken = await messaging().getToken();

    if (fcmtoken) {
      firestore()
        .doc(`${appInfos.databaseNames.users}/${user.uid}`)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            const tokens = snap.data().tokens ?? [];

            if (!tokens.includes(fcmtoken)) {
              tokens.push(fcmtoken);
              // console.log(tokens, fcmtoken);
              firestore()
                .doc(`${appInfos.databaseNames.users}/${user.uid}`)
                .update({tokens})
                .then(() => console.log('Tokens updated'));
            }
          }
        });
    } else {
      console.log('Can not get FCMToken');
    }
  }
};
