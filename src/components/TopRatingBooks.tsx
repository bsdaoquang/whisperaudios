/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {appInfos} from '../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {RatingModel} from '../models/RatingModel';
import {GetTime} from '../utils/getTime';
import BookComponent from './BookComponent';
import RatingComponent from './RatingComponent';
import {RowComponent} from './RowComponent';
import TabbarComponent from './TabbarComponent';
import TextComponent from './TextComponent';
import UserComponent from './UserComponent';

const TopRatingBooks = () => {
  const [ratings, setRatings] = useState<RatingModel[]>([]);
  const {setItem, getItem} = useAsyncStorage(appInfos.localNames.topRatings);

  useEffect(() => {
    getRatingBooks();
  }, []);

  const getRatingBooks = async () => {
    const items: any = await getItem();
    setRatings(JSON.parse(items));
    const filter = firestore()
      .collection(appInfos.databaseNames.ratings)
      .orderBy('time')
      .limitToLast(5);

    await filter.get().then(async snap => {
      if (!snap.empty) {
        const items: RatingModel[] = [];
        snap.forEach((item: any) => {
          const ratingItem = items.find(element => element.key === item.id);
          if (!ratingItem) {
            items.push({
              key: item.id,
              ...item.data(),
            });
          }
        });
        await setItem(JSON.stringify(items));
        setRatings(items);
      }
    });
  };

  return (
    <View style={{marginTop: 12}}>
      <TabbarComponent title="Ratings new" />
      {ratings &&
        ratings.length > 0 &&
        ratings.map(item => (
          <RowComponent
            key={item.key}
            styles={{
              paddingHorizontal: 16,
              alignItems: 'flex-start',
              marginBottom: 16,
            }}>
            <UserComponent uid={item.by} />
            <View
              style={{
                paddingHorizontal: 12,
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <BookComponent id={item.bookId} type="title" />
              <RatingComponent count={item.star} readOnly />
              <TextComponent
                text={GetTime.getFullTimeString(item.time)}
                flex={0}
                size={12}
              />
              <TextComponent text={item.review} line={2} />
            </View>
          </RowComponent>
        ))}
    </View>
  );
};

export default TopRatingBooks;
