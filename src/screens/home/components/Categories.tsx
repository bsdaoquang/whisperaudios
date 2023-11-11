/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';
import {FlatList, useColorScheme} from 'react-native';
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
  const theme = useColorScheme();

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
        setCategories(items);
        setItem(JSON.stringify(items));
      }
    });
  };
  return categories && categories.length > 0 ? (
    <FlatList
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={
        <TagComponent
          borderWidth={0}
          onPress={() => navigation.navigate('CategoriesScreen', {id: ''})}
          text={i18n.t('all')}
          styles={{
            backgroundColor:
              theme === 'dark' ? appColors.light : appColors.primary,
          }}
          textStyle={{
            color: theme === 'dark' ? appColors.dark : appColors.light,
          }}
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
