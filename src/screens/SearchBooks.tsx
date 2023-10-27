/** @format */

import React, {useEffect, useState} from 'react';

import {RowComponent} from '../components/RowComponent';
import SectionComponent from '../components/SectionComponent';
import TextComponent from '../components/TextComponent';
import {appColors} from '../constants/appColors';
import {Author, Book, Category, Search} from '../models';
import {userSelector} from '../redux/reducers/userReducer';
import {replaceName} from '../utils/replaceName';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {saveSearchKeyToDatabase} from '../utils/saveSearchKeyToDB';
import Container from '../components/Container';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {InputCompoment} from '../components/InputComponent';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import TitleComponent from '../components/TitleComponent';
import SpaceComponent from '../components/SpaceComponent';
import ListBookItem from '../components/ListBookItem';
import {i18n} from '../languages/i18n';
import AuthorComponent from '../components/AuthorComponent';

import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchBooks = ({navigation}: any) => {
  const [topSearch, setTopSearch] = useState<Search[]>([]);
  const [searchKey, setSearchKey] = useState('');
  const [filter, setFilter] = useState<string>('audios');
  const [books, setBooks] = useState<Book[]>([]);
  const [author, setAuthor] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {getItem, setItem} = useAsyncStorage(appInfos.localNames.topSearchs);
  const theme = useColorScheme();

  const auth = useSelector(userSelector);

  const menuFilter = [
    {
      id: 'audios',
      title: i18n.t('audios'),
    },
    {
      id: 'authors',
      title: i18n.t('authors'),
    },
    {
      id: 'categories',
      title: i18n.t('categories'),
    },
  ];

  useEffect(() => {
    getTopSearchKeys();
  }, []);

  useEffect(() => {
    if (!searchKey) {
      setBooks([]);
      setAuthor([]);
      setCategories([]);
    } else {
      onSearch('audios');
      onSearch('authors');
      onSearch('categories');
    }
  }, [searchKey]);

  const getTopSearchKeys = async () => {
    const items: any = await getItem();
    setTopSearch(JSON.parse(items));
    // const filter = query(
    //   collection(fs, appInfos.databaseNames.searchs),
    //   orderBy('count'),
    //   limitToLast(10),
    // );

    await firestore()
      .collection(appInfos.databaseNames.searchs)
      .orderBy('count')
      .limitToLast(10)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Search key not found');
        } else {
          const items: Search[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });
          setItem(JSON.stringify(items.sort((a, b) => b.count - a.count)));
          setTopSearch(items.sort((a, b) => b.count - a.count));
        }
      });
  };

  const onSearch = async (target: 'audios' | 'authors' | 'categories') => {
    const q = replaceName(searchKey);
    setIsSearching(true);

    await firestore()
      .collection(target)
      .where('searchTemrs', 'array-contains-any', q.split('-'))
      .get()
      .then(snap => {
        if (snap.empty) {
          target === 'audios'
            ? setBooks([])
            : target === 'authors'
            ? setAuthor([])
            : setCategories([]);
          console.log('data not found');
          setIsSearching(false);
        } else {
          const items: any[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });

          target === 'audios'
            ? setBooks(items)
            : target === 'authors'
            ? setAuthor(items)
            : setCategories(items);
          setIsSearching(false);
        }
      });
  };

  const dataNotFound = () => (
    <SectionComponent
      styles={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextComponent text="Không tìm thấy nội dung bạn cần" flex={0} />
      <RowComponent
        onPress={() => console.log('fasfasfs')}
        styles={{marginTop: 12}}>
        <TextComponent text="Gửi yêu cầu" color={appColors.link} />
      </RowComponent>
    </SectionComponent>
  );

  const handleSaveSearchKey = async (key: string) => {
    key && (await saveSearchKeyToDatabase(key, auth.uid));
  };

  return (
    <Container>
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 12,
        }}>
        <InputCompoment
          styles={{marginBottom: 0}}
          value={searchKey}
          onChange={val => setSearchKey(val)}
          clear
          max={50}
          onEnd={() => handleSaveSearchKey(searchKey)}
          prefix={
            <AntDesign name="search1" size={20} color={appColors.light} />
          }
          placeholder={i18n.t('searchPlaceholder')}
          autoFocus={false}
        />
      </View>

      <View style={{flex: 1}}>
        {searchKey ? (
          isSearching ? (
            <SectionComponent
              styles={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator />
              <TextComponent text="Đang tìm kiếm..." />
            </SectionComponent>
          ) : (
            <>
              <View>
                <FlatList
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                  horizontal
                  data={menuFilter}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        {
                          borderWidth: filter === item.id ? 1 : 0,
                          borderColor: appColors.gray,
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 100,
                        },
                      ]}
                      key={item.id}
                      onPress={() => setFilter(item.id)}>
                      <TextComponent text={item.title} flex={0} />
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View style={{flex: 1}}>
                {filter === 'audios' ? (
                  <>
                    {books.length > 0 ? (
                      <FlatList
                        onScroll={() => Keyboard.dismiss()}
                        showsVerticalScrollIndicator={false}
                        maxToRenderPerBatch={20}
                        style={{paddingTop: 12, paddingBottom: 12}}
                        data={books}
                        renderItem={({item}) => (
                          <ListBookItem book={item} key={item.key} />
                        )}
                      />
                    ) : (
                      dataNotFound()
                    )}
                  </>
                ) : filter === 'authors' ? (
                  <>
                    {author.length > 0 ? (
                      <FlatList
                        onScroll={() => Keyboard.dismiss()}
                        showsVerticalScrollIndicator={false}
                        maxToRenderPerBatch={20}
                        style={{paddingVertical: 12}}
                        data={author}
                        renderItem={({item}) => (
                          <AuthorComponent
                            onPress={() =>
                              navigation.navigate('AuthorDetail', {
                                author: item,
                              })
                            }
                            author={item}
                            key={item.key as string}
                          />
                        )}
                      />
                    ) : (
                      dataNotFound()
                    )}
                  </>
                ) : (
                  <>
                    {categories.length > 0 ? (
                      <FlatList
                        onScroll={() => Keyboard.dismiss()}
                        showsVerticalScrollIndicator={false}
                        maxToRenderPerBatch={20}
                        style={{paddingTop: 12}}
                        data={categories}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            key={item.key}
                            onPress={() =>
                              navigation.navigate('CategoryBooks', {
                                id: item.key,
                                title: item.title,
                              })
                            }
                            style={{
                              marginHorizontal: 16,
                              paddingVertical: 12,
                              borderBottomColor:
                                theme === 'dark'
                                  ? appColors.gray7
                                  : appColors.gray1,
                              borderBottomWidth: 1,
                            }}>
                            <TitleComponent text={item.title} />
                          </TouchableOpacity>
                        )}
                      />
                    ) : (
                      dataNotFound()
                    )}
                  </>
                )}
              </View>
            </>
          )
        ) : (
          <SectionComponent flex={1} styles={{marginTop: 20}}>
            <TitleComponent text={i18n.t('hotSearchKey')} flex={0} />
            {topSearch &&
              topSearch.length > 0 &&
              topSearch.map(item => (
                <RowComponent
                  onPress={() => {
                    setSearchKey(item.value);
                    handleSaveSearchKey(item.value);
                  }}
                  key={item.key}
                  styles={{
                    paddingVertical: 12,
                  }}>
                  <AntDesign name="search1" size={16} color={appColors.gray} />
                  <SpaceComponent width={12} />
                  <TextComponent text={`${item.value} (${item.count})`} />
                </RowComponent>
              ))}
          </SectionComponent>
        )}
      </View>
    </Container>
  );
};

export default SearchBooks;
