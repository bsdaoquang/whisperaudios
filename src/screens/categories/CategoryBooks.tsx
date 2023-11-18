/** @format */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Heart, SearchNormal1} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, View} from 'react-native';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import {InputCompoment} from '../../components/InputComponent';
import {LoadingComponent} from '../../components/LoadingComponent';
import RenderBookItem from '../../components/RenderBookItem';
import {RowComponent} from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import {Book, Category} from '../../models';
import {replaceName} from '../../utils/replaceName';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showToast} from '../../utils/showToast';

const CategoryBooks = ({navigation, route}: any) => {
  const {id, title}: {id: string; title: string} = route.params;

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [categoryDetail, setCategoryDetail] = useState<Category>();

  const user = auth().currentUser;

  useEffect(() => {
    if (id) {
      getBooksByCategoryId();
      getCategoryDetail();
    }
  }, [id]);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const items = books.filter(element =>
        element.slug.includes(replaceName(searchKey)),
      );

      setResults(items);
    }
  }, [searchKey]);

  const getCategoryDetail = () => {
    firestore()
      .doc(`${appInfos.databaseNames.categories}/${id}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setCategoryDetail({
            key: id,
            ...snap.data(),
          });
        }
      });
  };

  const getBooksByCategoryId = async () => {
    const filter = firestore()
      .collection(appInfos.databaseNames.audios)
      .where('categories', 'array-contains', id);

    setIsLoading(true);
    filter.onSnapshot(snap => {
      if (snap.empty) {
        console.log('Books not found');
        setIsLoading(false);
      } else {
        const items: Book[] = [];
        snap.forEach((item: any) => {
          items.push({
            key: item.id,
            ...item.data(),
          });
        });

        setBooks(items);
        setIsLoading(false);
      }
    });
  };

  const handleFollowCategory = () => {
    if (categoryDetail && user) {
      const followers = categoryDetail.followers ?? [];

      if (followers.includes(user.uid)) {
        const index = followers.indexOf(user.uid);

        followers.splice(index, 1);
      } else {
        followers.push(user.uid);
      }

      firestore()
        .doc(`${appInfos.databaseNames.categories}/${id}`)
        .update({
          followers,
        })
        .then(() => {
          showToast(
            followers.includes(user.uid)
              ? 'Đã thêm vào danh sách theo dõi'
              : 'Đã xoá khỏi danh sách yêu thích',
          );
        });
    } else {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập trước');
    }
  };

  return (
    <Container
      title={title}
      back
      right={
        user && (
          <RowComponent>
            <ButtonIcon
              icon={
                <Ionicons
                  name={
                    categoryDetail &&
                    categoryDetail.followers &&
                    categoryDetail?.followers.includes(user.uid)
                      ? `heart`
                      : 'heart-outline'
                  }
                  size={24}
                  color={appColors.red4}
                />
              }
              onPress={handleFollowCategory}
            />
          </RowComponent>
        )
      }>
      <View style={{paddingHorizontal: 16}}>
        <InputCompoment
          styles={{marginBottom: 0}}
          placeholder={i18n.t('search')}
          clear
          prefix={<SearchNormal1 size={18} color={appColors.gray} />}
          value={searchKey}
          onChange={val => setSearchKey(val)}
        />
      </View>
      <View style={{flex: 1}}>
        {books.length > 0 ? (
          searchKey ? (
            results.length > 0 ? (
              <FlatList
                style={{paddingTop: 16, flex: 1}}
                showsVerticalScrollIndicator={false}
                data={results}
                numColumns={2}
                renderItem={({item}) => (
                  <RenderBookItem item={item} key={item.key} />
                )}
              />
            ) : (
              <RowComponent styles={{paddingHorizontal: 16}}>
                <TextComponent
                  text="Không tìm thấy nội dung phù hợp"
                  flex={0}
                />
              </RowComponent>
            )
          ) : (
            <FlatList
              style={{paddingTop: 8, flex: 1}}
              showsVerticalScrollIndicator={false}
              data={books}
              numColumns={2}
              renderItem={({item}) => (
                <RenderBookItem item={item} key={item.key} />
              )}
            />
          )
        ) : (
          <LoadingComponent isLoading={isLoading} value={books.length} />
        )}
      </View>
    </Container>
  );
};

export default CategoryBooks;
