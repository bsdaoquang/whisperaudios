import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import ListeningCardItem from '../../components/ListeningCardItem';
import {LoadingComponent} from '../../components/LoadingComponent';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import {Listening} from '../../models/Book';
import {userSelector} from '../../redux/reducers/userReducer';
import {InputCompoment} from '../../components/InputComponent';
import {SearchNormal, SearchNormal1} from 'iconsax-react-native';
import {appColors} from '../../constants/appColors';
import {replaceName} from '../../utils/replaceName';
import TextComponent from '../../components/TextComponent';

const ListeningsScreen = () => {
  const [listenings, setListenings] = useState<Listening[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<Listening[]>([]);

  const user = useSelector(userSelector);
  useEffect(() => {
    user.uid && getNewListenings();
  }, [user.uid]);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const items = listenings.filter(element =>
        element.slug.includes(replaceName(searchKey)),
      );
      setResults(items);
    }
  }, [searchKey]);

  const getNewListenings = () => {
    setIsLoading(true);
    firestore()
      .collection(appInfos.databaseNames.listenings)
      .where('uid', '==', user.uid)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('listening not found!!');
          setIsLoading(false);
        } else {
          const items: Listening[] = [];
          snap.forEach((item: any) => {
            firestore()
              .doc(`${appInfos.databaseNames.audios}/${item.data().audioId}`)
              .get()
              .then((snap: any) => {
                items.push({
                  key: item.id,
                  slug: snap.data().slug,
                  ...item.data(),
                });

                setListenings(items.sort((a, b) => b.date - a.date));
              });
          });

          setIsLoading(false);
        }
      });
  };

  const renderListData = (data: Listening[]) => (
    <FlatList
      style={{paddingHorizontal: 16}}
      data={data}
      renderItem={({item}) => (
        <ListeningCardItem item={item} type="horizontal" />
      )}
    />
  );

  return (
    <Container back title={i18n.t('history')}>
      <View style={{paddingHorizontal: 16}}>
        <InputCompoment
          prefix={<SearchNormal1 size={20} color={appColors.gray} />}
          value={searchKey}
          clear
          onChange={val => setSearchKey(val)}
          placeholder={i18n.t('searchOnHistory')}
        />
      </View>
      {searchKey ? (
        results.length > 0 ? (
          renderListData(results)
        ) : (
          <TextComponent text={i18n.t('dataNotFound')} />
        )
      ) : listenings.length > 0 ? (
        renderListData(listenings)
      ) : (
        <LoadingComponent isLoading={isLoading} value={listenings.length} />
      )}
    </Container>
  );
};

export default ListeningsScreen;
