import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import ListeningCardItem from '../../components/ListeningCardItem';
import {LoadingComponent} from '../../components/LoadingComponent';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import {Listening} from '../../models/Book';
import {userSelector} from '../../redux/reducers/userReducer';

const ListeningsScreen = () => {
  const [listenings, setListenings] = useState<Listening[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(userSelector);
  useEffect(() => {
    user.uid && getNewListenings();
  }, [user.uid]);

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
            items.push({
              key: item.id,
              ...item.data(),
            });
          });
          setListenings(items);
          setIsLoading(false);
        }
      });
  };
  return (
    <Container back title={i18n.t('history')}>
      {listenings.length > 0 ? (
        <FlatList
          data={listenings}
          renderItem={({item}) => (
            <ListeningCardItem item={item} type="horizontal" />
          )}
        />
      ) : (
        <LoadingComponent isLoading={isLoading} value={listenings.length} />
      )}
    </Container>
  );
};

export default ListeningsScreen;
