/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {fontFamilies} from '../../constants/fontFamilies';
import firestore from '@react-native-firebase/firestore';
import {i18n} from '../../languages/i18n';
import {Category} from '../../models';
import {ArrowRight2, Heart} from 'iconsax-react-native';
import ButtonIcon from '../../components/ButtonIcon';

const CategoriesScreen = ({navigation}: any) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const {setItem, getItem} = useAsyncStorage(appInfos.localNames.categories);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const items: any = await getItem();
    items && setCategories(JSON.parse(items));

    await firestore()
      .collection(appInfos.databaseNames.categories)
      .get()
      .then(async snap => {
        if (snap.empty) {
          console.log('categories not found');
        } else {
          const items: Category[] = [];

          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });

          await setItem(
            JSON.stringify(
              items.sort((a, b) => a.title.localeCompare(b.title)),
            ),
          );
          setCategories(items.sort((a, b) => a.title.localeCompare(b.title)));
        }
      });
  };

  return (
    <Container back title={i18n.t('categories')}>
      {categories && categories.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={categories}
          renderItem={({item}) => (
            <RowComponent
              onPress={() =>
                navigation.navigate('CategoryBooks', {
                  id: item.key,
                  title: item.title,
                })
              }
              styles={{
                marginHorizontal: 16,
                paddingVertical: 16,
                borderBottomWidth: 0.5,
                borderBottomColor: appColors.gray2,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextComponent
                text={item.title}
                // flex={1}
                font={fontFamilies.medium}
              />

              <ArrowRight2 size={16} color={appColors.gray7} />
            </RowComponent>
          )}
        />
      )}
    </Container>
  );
};

export default CategoriesScreen;
