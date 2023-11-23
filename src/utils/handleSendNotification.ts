import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import axios from 'axios';

export const handleSendNotification = (
  uid: string,
  title: string,
  body: string,
) => {
  firestore()
    .doc(`${appInfos.databaseNames.users}/${uid}`)
    .get()
    .then((snap: any) => {
      if (snap.exists) {
        const tokens = snap.data().tokens ?? [];

        if (tokens.length > 0) {
          pushNotification(tokens, title, body);
        }
      }
    });
};

const pushNotification = async (
  tokens: string[],
  title: string,
  body: string,
) => {
  let data = JSON.stringify({
    registration_ids: tokens,
    notification: {
      title,
      body,
    },
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${appInfos.serverKey}`,
    },
    data: data,
  };

  axios
    .request(config)
    .then(response => {
      console.log(JSON.stringify(response.data));
    })
    .catch(error => {
      console.log(error);
    });
};
