import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import TitleComponent from '../../../components/TitleComponent';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../../constants/appInfos';
import {RatingModel} from '../../../models/RatingModel';
import RatingComponent from '../../../components/RatingComponent';

interface Props {
  audioId: string;
}

const RatingAudio = (props: Props) => {
  const {audioId} = props;

  const [ratings, setRatings] = useState<RatingModel[]>([]);

  useEffect(() => {
    getAllRating();
  }, [audioId]);

  const getAllRating = async () => {
    await firestore()
      .collection(appInfos.databaseNames.ratings)
      .where('bookId', '==', audioId)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Rating not yet');
        } else {
          const items: RatingModel[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });

          setRatings(items);
        }
      });
  };

  return (
    <View>
      <TitleComponent text="Đánh giá" />
    </View>
  );
};

export default RatingAudio;
