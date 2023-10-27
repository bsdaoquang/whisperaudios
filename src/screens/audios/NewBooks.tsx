/** @format */

import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Container from '../../components/Container';
import ListBookItem from '../../components/ListBookItem';
import {LoadingComponent} from '../../components/LoadingComponent';
import TextComponent from '../../components/TextComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {Book} from '../../models';
import firestore from '@react-native-firebase/firestore';

const NewBooks = ({route, navigation}: any) => {
  const {keyTab} = route.params;
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState(keyTab);

  const tabs = [
    {
      id: 'updatedAt',
      title: 'Mới cập nhật',
    },
    {
      id: 'listens',
      title: 'Nghe nhiều',
    },
    {
      id: 'totalChaps',
      title: 'Số chương',
    },
  ];

  useEffect(() => {
    getBooksByTab();
  }, [tab]);

  const getBooksByTab = async () => {
    await firestore()
      .collection(appInfos.databaseNames.audios)
      .orderBy(tab)
      .get()
      .then((snap: any) => {
        if (snap.empty) {
          setBooks([]);
          setIsLoading(false);
        } else {
          const items: Book[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });
          setIsLoading(false);
          setBooks(items.sort((a: any, b: any) => b[`${tab}`] - a[`${tab}`]));
        }
      });
  };

  return (
    <Container
      back
      title={tabs.find(element => element.id === tab)?.title}
      right={
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SearchTab', {screen: 'SearchScreen'})
          }>
          <AntDesign name="search1" size={20} color={appColors.gray7} />
        </TouchableOpacity>
      }>
      {books.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={books}
          removeClippedSubviews
          maxToRenderPerBatch={20}
          ListHeaderComponent={
            <FlatList
              style={{paddingHorizontal: 16, marginBottom: 12}}
              data={tabs}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setBooks([]);

                    setTab(item.id);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 100,
                    borderWidth: tab === item.id ? 1 : 0,
                    borderColor: appColors.gray,
                  }}>
                  <TextComponent text={item.title} />
                </TouchableOpacity>
              )}
              horizontal
            />
          }
          renderItem={({item}) => (
            <ListBookItem
              book={item}
              showRating={false}
              color={keyTab.tab === 'story' ? appColors.book1 : appColors.white}
            />
          )}
        />
      ) : (
        <LoadingComponent isLoading={isLoading} value={books.length} />
      )}
    </Container>
  );
};

export default NewBooks;
