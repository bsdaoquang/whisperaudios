import {View, Text, FlatList} from 'react-native';
import React from 'react';
import Container from '../../../components/Container';
import TextComponent from '../../../components/TextComponent';
import RatingItemComponent from '../../../components/RatingItemComponent';

const RatingsScreen = ({route, navigation}: any) => {
  const {ratings} = route.params;

  return (
    <Container back title={'Đánh giá'}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 16}}
        data={ratings}
        renderItem={({item}) => (
          <RatingItemComponent item={item} key={item.key} />
        )}
      />
    </Container>
  );
};

export default RatingsScreen;
