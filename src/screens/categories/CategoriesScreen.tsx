/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import Container from '../../components/Container';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import {Category} from '../../models';
import CatItemComponent from './components/CatItemComponent';
import {replaceName} from '../../utils/replaceName';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {InputCompoment} from '../../components/InputComponent';
import {SearchNormal1} from 'iconsax-react-native';
import {appColors} from '../../constants/appColors';

const CategoriesScreen = ({navigation}: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const {setItem, getItem} = useAsyncStorage(appInfos.localNames.categories);
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<Category[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const items = categories.filter(element =>
        replaceName(element.title).includes(replaceName(searchKey)),
      );

      setResults(items);
    }
  }, [searchKey]);

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
        <>
          <View style={{paddingHorizontal: 16}}>
            <InputCompoment
              clear
              value={searchKey}
              onChange={val => setSearchKey(val)}
              prefix={<SearchNormal1 size={20} color={appColors.gray} />}
              placeholder={i18n.t('search')}
            />
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={searchKey ? results : categories}
            ListEmptyComponent={
              searchKey ? (
                <SectionComponent>
                  <TextComponent text="Không tìm thấy nội dung phù hợp" />
                </SectionComponent>
              ) : null
            }
            renderItem={({item}) => <CatItemComponent item={item} />}
          />
        </>
      )}
    </Container>
  );
};

export default CategoriesScreen;
