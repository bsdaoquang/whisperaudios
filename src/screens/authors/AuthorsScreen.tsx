/** @format */

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import firestore from '@react-native-firebase/firestore';
import {SearchNormal1} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import Container from '../../components/Container';
import {InputCompoment} from '../../components/InputComponent';
import {LoadingComponent} from '../../components/LoadingComponent';
import RenderAuthorItem from '../../components/RenderAuthorItem';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import {Author} from '../../models';
import {replaceName} from '../../utils/replaceName';

const AuthorsScreen = ({navigation}: any) => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {getItem, setItem} = useAsyncStorage(appInfos.localNames.authors);
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<Author[]>([]);

  useEffect(() => {
    getAuthors();
  }, []);

  useEffect(() => {
    if (searchKey) {
      const items = authors.filter(element =>
        element.slug.includes(replaceName(searchKey)),
      );
      setResults(items);
    } else {
      setResults([]);
    }
  }, [searchKey]);

  const getAuthors = async () => {
    setIsLoading(true);
    firestore()
      .collection(appInfos.databaseNames.authors)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Authors not found');
          setIsLoading(false);
        } else {
          const items: Author[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });

          setAuthors(items);
          setIsLoading(false);
        }
      });
  };

  const renderData = (data: Author[]) =>
    data.length > 0 ? (
      <FlatList
        maxToRenderPerBatch={20}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        data={data}
        renderItem={({item}) => <RenderAuthorItem item={item} />}
      />
    ) : (
      <SectionComponent>
        <TextComponent text="Không tìm thấy dữ liệu" flex={0} />
      </SectionComponent>
    );

  return (
    <Container back title={i18n.t('author')}>
      <View style={{paddingHorizontal: 16}}>
        <InputCompoment
          placeholder={i18n.t('search')}
          clear
          prefix={<SearchNormal1 size={20} color={appColors.gray} />}
          value={searchKey}
          onChange={val => setSearchKey(val)}
        />
      </View>
      {authors.length > 0 ? (
        searchKey ? (
          renderData(results)
        ) : (
          renderData(authors)
        )
      ) : (
        <LoadingComponent isLoading={isLoading} value={authors.length} />
      )}
    </Container>
  );
};

export default AuthorsScreen;
