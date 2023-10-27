/** @format */

import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';

export const saveSearchKeyToDatabase = async (
  keysearch: string,
  uid: string | undefined,
) => {
  const filter = firestore().collection(appInfos.databaseNames.searchs);
  await filter.get().then(async snap => {
    if (snap.empty) {
      const data = {
        by: uid ?? '',
        value: keysearch,
        count: 1,
      };

      filter.add(data);
    } else {
      snap.forEach(async (item: any) => {
        const data = {
          ...item.data(),
          count: item.data().count + 1,
        };
        filter.doc(item.id).update(data);
      });
    }
  });
};
