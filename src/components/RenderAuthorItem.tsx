import {Rating} from '@kolking/react-native-rating';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Alert, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Octicons from 'react-native-vector-icons/Octicons';
import {useSelector} from 'react-redux';
import {appColors} from '../constants/appColors';
import {appInfos} from '../constants/appInfos';
import {i18n} from '../languages/i18n';
import {Author} from '../models';
import {userSelector} from '../redux/reducers/userReducer';
import {globalStyles} from '../styles/globalStyles';
import {RowComponent} from './RowComponent';
import TagComponent from './TagComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';

interface Props {
  item: Author;
}

const RenderAuthorItem = (props: Props) => {
  const {item} = props;
  const navigation: any = useNavigation();
  const user = useSelector(userSelector);

  const handleFollowAuthor = () => {
    if (user.uid) {
    } else {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập trước', [
        {
          text: 'Đăng nhập',
          onPress: () => navigation.navigate('ProfileTab'),
        },
      ]);
    }
    const followers = item?.followers ?? [];

    if (followers.includes(user.uid)) {
      const index = followers.indexOf(user.uid);

      followers.splice(index, 1);
    } else {
      followers.push(user.uid);
    }

    firestore().doc(`${appInfos.databaseNames.authors}/${item.key}`).update({
      followers,
    });
  };

  return (
    <RowComponent
      activeOpacity={0.8}
      // onPress={() => console.log(item)}
      onPress={() => navigation.navigate('AuthorDetail', {author: item})}
      key={item.key}
      styles={{
        paddingVertical: 12,
        marginHorizontal: 16,
      }}>
      {item.image ? (
        <FastImage
          source={{uri: item.image}}
          style={[
            globalStyles.shadow,
            {
              width: 50,
              height: 50,
              borderRadius: 100,
            },
          ]}
        />
      ) : (
        <View
          style={[
            globalStyles.shadow,
            {
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: appColors.gray3,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <TitleComponent
            color={appColors.white}
            size={22}
            text={item.name.substring(0, 1)}
            flex={0}
          />
        </View>
      )}

      <View style={{flex: 1, marginLeft: 12, alignItems: 'flex-start'}}>
        <TitleComponent text={item.name} />
        <Rating
          rating={item.star ?? 0}
          size={14}
          disabled
          style={{paddingVertical: 4}}
        />
        <TextComponent
          text={`${item.followers ? item.followers.length : 0} ${i18n.t(
            'followers',
          )}`}
          color={appColors.link}
        />
      </View>
      <TagComponent
        onPress={handleFollowAuthor}
        text={
          item.followers.includes(user.uid)
            ? i18n.t('unFollower')
            : i18n.t('follower')
        }
        icon={
          item.followers.includes(user.uid) && (
            <Octicons
              name="check"
              size={18}
              color={appColors.white}
              style={{marginRight: 4}}
            />
          )
        }
        styles={{
          paddingVertical: 4,
          paddingHorizontal: 12,
          borderColor: appColors.primary,
          backgroundColor: appColors.primary,
        }}
        textStyle={{
          fontSize: 12,
          color: appColors.white,
        }}
      />
    </RowComponent>
  );
};

export default RenderAuthorItem;
