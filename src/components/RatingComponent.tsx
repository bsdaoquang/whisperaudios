/** @format */

import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appColors} from '../constants/appColors';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {RowComponent} from './RowComponent';

interface Props {
  count?: number;
  readOnly?: boolean;
  bookId?: string;
  size?: number;
}

const RatingComponent = (props: Props) => {
  const {count, readOnly, bookId, size} = props;

  const [countStart, setCountStart] = useState<number>(count ? count : 0);

  useEffect(() => {
    bookId && getBookRatings();
  }, [bookId]);

  const getBookRatings = async () => {
    const filter = firestore()
      .collection(appInfos.databaseNames.ratings)
      .where('bookId', '==', bookId);

    await filter.get().then(snap => {
      if (snap.empty) {
        // console.log('Rating not found');
        setCountStart(0);
      } else {
        snap.forEach((item: any) => {
          setCountStart(item.data().start);
        });
      }
    });
  };

  return (
    <RowComponent styles={{marginBottom: 8}}>
      {Array.from({length: countStart}).map((_item, index) => (
        <AntDesign
          key={`iconStart${index}`}
          name={'star'}
          size={size ?? 16}
          color={appColors.yellow}
        />
      ))}
      {Array.from({length: 5 - countStart}).map((_item, index) => (
        <AntDesign
          key={`icon${index}`}
          name={'staro'}
          size={size ?? 16}
          color={appColors.yellow4}
        />
      ))}
    </RowComponent>
  );
};

export default RatingComponent;
