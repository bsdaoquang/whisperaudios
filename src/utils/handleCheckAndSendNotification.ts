import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {handleSendNotification} from './handleSendNotification';

export const handleCheckAndSendNotification = ({
  cats,
  authorId,
  bookId,
}: {
  cats?: string[];
  authorId?: string;
  bookId?: string;
}) => {
  if (cats) {
    cats.forEach(catId => {
      firestore()
        .doc(`${appInfos.databaseNames.categories}/${catId}`)
        .get()
        .then((snap: any) => {
          if (snap.exists) {
            const followers: string[] = snap.data().followers ?? [];
            if (followers.length > 0) {
              followers.forEach(uid =>
                handleSendNotification(
                  uid,
                  'Audio mới',
                  `Một audio mới đã được tải lên chuyên mục ${
                    snap.data().title
                  }, đừng bỏ lỡ`,
                ),
              );
            }
          }
        });
    });
  }

  if (authorId) {
    firestore()
      .doc(`${appInfos.databaseNames.authors}/${authorId}`)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          const followers: string[] = snap.data().followers ?? [];
          if (followers.length > 0) {
            followers.forEach(uid =>
              handleSendNotification(
                uid,
                'Audio mới',
                `Một audio mới của tác giả ${
                  snap.data().name
                } đã được tải lên, đừng bỏ lỡ`,
              ),
            );
          }
        }
      });
  }
  if (bookId) {
    firestore()
      .doc(`${appInfos.databaseNames.audios}/${bookId}`)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          const followers: string[] = snap.data().followers ?? [];
          if (followers.length > 0) {
            followers.forEach(uid =>
              handleSendNotification(
                uid,
                'Cập nhật chương mới',
                `Audio ${
                  snap.data().title
                } đã được cập nhật chương mới, hãy vào nghe ngay nào!!!`,
              ),
            );
          }
        }
      });
  }
};
