/** @format */

import {Rating} from '@kolking/react-native-rating';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import ListBookItem from '../../components/ListBookItem';
import {LoadingComponent} from '../../components/LoadingComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TabbarComponent from '../../components/TabbarComponent';
import TagComponent from '../../components/TagComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import {Author, Book} from '../../models';
import {userSelector} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles/globalStyles';

const AuthorDetail = ({navigation, route}: any) => {
  const {author}: {author: Author} = route.params;
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [authorDetail, setAuthorDetail] = useState<Author>();

  const auth = useSelector(userSelector);

  useEffect(() => {
    getBooksByAuthorId();

    firestore()
      .doc(`${appInfos.databaseNames.authors}/${author.key}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setAuthorDetail({
            key: author.key,
            ...snap.data(),
          });
        }
      });
  }, [author]);

  const getBooksByAuthorId = async () => {
    const filter = firestore()
      .collection(appInfos.databaseNames.audios)
      .where('authorId', '==', author.key)
      .orderBy('createdAt')
      .limitToLast(10);

    setIsLoading(true);
    await filter.get().then(snap => {
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

  const handleFollowAuthor = () => {
    if (auth.uid) {
    } else {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập trước', [
        {
          text: 'Đăng nhập',
          onPress: () => navigation.navigate('ProfileTab'),
        },
      ]);
    }
    const followers = authorDetail?.followers ?? [];

    if (followers.includes(auth.uid)) {
      const index = followers.indexOf(auth.uid);

      followers.splice(index, 1);
    } else {
      followers.push(auth.uid);
    }

    firestore().doc(`${appInfos.databaseNames.authors}/${author.key}`).update({
      followers,
    });
  };

  return (
    <Container back title={i18n.t('author')} scroll>
      <SectionComponent>
        <RowComponent styles={{alignItems: 'flex-start'}}>
          {author.image && (
            <FastImage
              source={{uri: author.image}}
              style={[
                globalStyles.shadow,
                {
                  width: 100,
                  height: 120,
                  borderRadius: 8,
                },
              ]}
            />
          )}
          <View
            style={{
              marginLeft: author.image ? 12 : 0,
              flex: 1,
              justifyContent: 'space-between',
              height: 120,
            }}>
            <TitleComponent text={author.name} size={18} line={1} />
            <TextComponent
              text={`${books && books.length} audio ⋅ ${
                (authorDetail &&
                  authorDetail.followers &&
                  authorDetail?.followers.length) ??
                0
              } theo dõi`}
              color={appColors.text3}
              line={1}
            />

            <Rating rating={authorDetail?.star ?? 0} size={18} disabled />

            <RowComponent styles={{justifyContent: 'flex-start'}}>
              <TagComponent
                onPress={handleFollowAuthor}
                styles={{
                  borderRadius: 8,
                  backgroundColor:
                    authorDetail &&
                    authorDetail?.followers &&
                    authorDetail.followers.includes(auth.uid)
                      ? undefined
                      : appColors.primary,
                  borderWidth:
                    authorDetail &&
                    authorDetail?.followers &&
                    authorDetail.followers.includes(auth.uid)
                      ? 1
                      : 0,
                  marginHorizontal: 0,
                }}
                textStyle={{
                  color:
                    authorDetail &&
                    authorDetail?.followers &&
                    authorDetail.followers.includes(auth.uid)
                      ? appColors.text
                      : appColors.white,
                }}
                text={
                  authorDetail &&
                  authorDetail?.followers &&
                  authorDetail.followers.includes(auth.uid)
                    ? 'Huỷ theo dõi'
                    : 'Theo dõi'
                }
              />
            </RowComponent>
          </View>
        </RowComponent>
      </SectionComponent>
      <TabbarComponent title={i18n.t('about')} />
      <SectionComponent>
        <TextComponent text={author.description ?? 'Đang cập nhật'} />
      </SectionComponent>
      <View>
        <TabbarComponent
          title="Audio nổi bật"
          seemore
          onPress={() =>
            navigation.navigate('BooksByAuthor', {
              authorId: author.key,
              title: author.name,
            })
          }
        />
        {books.length > 0 ? (
          books.map(item => <ListBookItem book={item} key={item.key} />)
        ) : (
          <LoadingComponent isLoading={isLoading} value={books.length} />
        )}
      </View>
    </Container>
  );
};

export default AuthorDetail;
