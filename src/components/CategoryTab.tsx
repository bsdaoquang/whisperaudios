import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Category} from '../models';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import TagComponent from './TagComponent';
import {useNavigation} from '@react-navigation/native';
import {appColors} from '../constants/appColors';

interface Props {
  catId: string;
  textColor?: string;
}

const CategoryTab = (props: Props) => {
  const {catId, textColor} = props;

  const [category, setCategory] = useState<Category>();
  const navigation: any = useNavigation();

  useEffect(() => {
    getCategoryDetail();
  }, [catId]);

  const getCategoryDetail = async () => {
    await firestore()
      .doc(`${appInfos.databaseNames.categories}/${catId}`)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setCategory({
            key: catId,
            ...snap.data(),
          });
        }
      });
  };

  return category ? (
    <TagComponent
      onPress={() =>
        navigation.navigate('CategoryBooks', {
          id: catId,
          title: category.title,
        })
      }
      styles={{borderColor: appColors.white}}
      textStyle={{
        color: textColor ?? appColors.text,
      }}
      text={category.title}
    />
  ) : (
    <></>
  );
};

export default CategoryTab;
