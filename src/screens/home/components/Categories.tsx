/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import TagComponent from '../../../components/TagComponent';
import {appColors} from '../../../constants/appColors';
import {appInfos} from '../../../constants/appInfos';
import firestore from '@react-native-firebase/firestore';
import {i18n} from '../../../languages/i18n';
import {Category} from '../../../models';
import {useNavigation} from '@react-navigation/native';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const {getItem, setItem} = useAsyncStorage(appInfos.localNames.topCategories);
  const navigation: any = useNavigation();

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const items: any = await getItem();
    setCategories(JSON.parse(items));

    const filter = firestore()
      .collection(appInfos.databaseNames.categories)
      .limit(10);

    await filter.get().then(snap => {
      if (snap.empty) {
        console.log('Categories not found');
      } else {
        const items: Category[] = [];
        snap.forEach((item: any) => {
          items.push({
            key: item.id,
            ...item.data(),
          });
        });
        console.log(items);
        setItem(JSON.stringify(items));
        setCategories(items);
      }
    });
  };
  return categories && categories.length > 0 ? (
    <FlatList
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={
        <TagComponent
          onPress={() => navigation.navigate('CategoriesScreen', {id: ''})}
          text={i18n.t('all')}
          styles={{backgroundColor: appColors.light}}
          textStyle={{color: appColors.dark1}}
        />
      }
      horizontal
      data={categories}
      renderItem={({item}) => (
        <TagComponent
          onPress={() =>
            navigation.navigate('CategoryBooks', {
              id: item.key,
              title: item.title,
            })
          }
          text={item.title}
        />
      )}
    />
  ) : (
    <></>
  );
};

export default Categories;
