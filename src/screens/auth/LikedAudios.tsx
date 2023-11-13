import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {i18n} from '../../languages/i18n';
import {Book} from '../../models';
import {useSelector} from 'react-redux';
import {userSelector} from '../../redux/reducers/userReducer';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';
import {LoadingComponent} from '../../components/LoadingComponent';
import {FlatList, TouchableOpacity, View} from 'react-native';
import RenderBookItem from '../../components/RenderBookItem';
import {HandleAudio} from '../../utils/handleAudio';
import {globalStyles} from '../../styles/globalStyles';
import {appColors} from '../../constants/appColors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LikedAudios = ({navigation}: any) => {
  const [likedAudios, setLikedAudios] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(userSelector);

  useEffect(() => {
    setIsLoading(true);
    firestore()
      .collection(appInfos.databaseNames.audios)
      .where('liked', 'array-contains', user.uid)
      .limit(10)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log('Liked not found');
        } else {
          const items: Book[] = [];
          snap.forEach((item: any) => {
            items.push({key: item.id, ...item.data()});
          });

          setLikedAudios(items);
          setIsLoading(false);
        }
      });
  }, []);

  return (
    <Container back title={i18n.t('audioLiked')}>
      {likedAudios.length > 0 ? (
        <FlatList
          numColumns={2}
          data={likedAudios}
          renderItem={({item}) => (
            <View>
              <RenderBookItem item={item} key={item.key} />
              <TouchableOpacity
                onPress={() =>
                  HandleAudio.UpdateLiked(
                    item.liked,
                    item.key as string,
                    user.uid,
                  )
                }
                style={[
                  globalStyles.shadow,
                  {
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    padding: 4,
                    backgroundColor: appColors.white,
                    borderRadius: 100,
                  },
                ]}>
                <Ionicons
                  name="heart-dislike-sharp"
                  size={20}
                  color={appColors.error4}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <LoadingComponent isLoading={isLoading} value={likedAudios.length} />
      )}
    </Container>
  );
};

export default LikedAudios;
