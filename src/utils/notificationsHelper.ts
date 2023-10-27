import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {apis} from '../api/apis';
import getData from '../api/getDataAPI';
import {database} from '../firebase/firebaseConfig';

//request permision for message
export const requestUserPermission = async () => {
  await messaging().setBackgroundMessageHandler(async () => {});
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
    const apiUser = `${apis.users}/${user.uid}.json`;

    try {
      const res: any = await getData.getData(apiUser, user.uid);

      if (res) {
        if (!res.fcmtoken) {
          const fcmtoken = await messaging().getToken();

          if (fcmtoken) {
            database.ref(`users/${user.uid}`).update({
              fcmtoken,
            });
          }
        } else {
          // Đa có token
          // console.log(res.fcmtoken);
        }
      } else {
        console.log('Không tìm thấy dữ liệu user');
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // console.log('Notification caused app to open from background state: ', remoteMessage.notification);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // console.log('Notification caused app to open quit state: ', remoteMessage.notification);
      }
    });

  messaging().onMessage(async remoteMessage => {
    // console.log('Notification froground state....', remoteMessage);
  });
};
