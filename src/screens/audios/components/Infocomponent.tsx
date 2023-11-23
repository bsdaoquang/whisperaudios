import React, {ReactNode, useEffect, useState} from 'react';
import {TouchableOpacity, View, useColorScheme} from 'react-native';
import AuthorComponent from '../../../components/AuthorComponent';
import {RowComponent} from '../../../components/RowComponent';
import SectionComponent from '../../../components/SectionComponent';
import TextComponent from '../../../components/TextComponent';
import TitleComponent from '../../../components/TitleComponent';
import {appColors} from '../../../constants/appColors';
import {Book} from '../../../models';
import {GetTime} from '../../../utils/getTime';
import Octicons from 'react-native-vector-icons/Octicons';
import SpaceComponent from '../../../components/SpaceComponent';
import {HandleAudio} from '../../../utils/handleAudio';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/reducers/userReducer';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../../constants/appInfos';
import {i18n} from '../../../languages/i18n';
import {audios} from '../../../datas/audios';
import UserComponent from '../../../components/UserComponent';

interface Props {
  item: Book;
}

const Infocomponent = (props: Props) => {
  const {item} = props;
  const [line, setLine] = useState(5);
  const user = useSelector(userSelector);
  const [followers, setFollowers] = useState<string[]>([]);

  useEffect(() => {
    handleCheckFollowers();
  }, [item.key]);

  const handleCheckFollowers = () => {
    firestore()
      .doc(`${appInfos.databaseNames.audios}/${item.key}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setFollowers(snap.data().followers);
        }
      });
  };

  const renderInfoItem = (title: string, value: ReactNode) => {
    return (
      <RowComponent
        styles={{
          justifyContent: 'flex-start',
          paddingVertical: 10,
          borderBottomColor: appColors.gray7,
          // borderBottomWidth: 0.2,
        }}>
        <TextComponent text={`${title}: `} flex={0} color={appColors.light} />
        {value}
      </RowComponent>
    );
  };

  return (
    <View>
      <SectionComponent>
        <RowComponent
          onPress={() => HandleAudio.UpdateFollowers(item.key as string)}>
          <Octicons
            name={
              followers && followers.includes(user.uid)
                ? 'bell-slash'
                : 'bell-fill'
            }
            size={20}
            color={appColors.white}
          />
          <SpaceComponent width={12} />
          <TextComponent
            color={appColors.white}
            text={
              followers && followers.includes(user.uid)
                ? 'Huỷ theo dõi'
                : 'Nhận thông báo khi có chap mới'
            }
          />
        </RowComponent>
      </SectionComponent>

      <SectionComponent>
        <TitleComponent
          text={i18n.t('description')}
          color={appColors.light}
          styles={{marginBottom: 8}}
        />
        <TouchableOpacity onPress={() => setLine(line === 5 ? 25 : 5)}>
          <TextComponent
            text={item.description}
            line={line}
            flex={1}
            color={appColors.light}
            styles={{textAlign: 'justify', lineHeight: 20}}
          />
        </TouchableOpacity>
      </SectionComponent>
      {item.uploadBy && (
        <SectionComponent>
          <TitleComponent
            text={'Tải lên bởi'}
            color={appColors.light}
            styles={{marginBottom: 8}}
          />

          <UserComponent uid={item.uploadBy} isTitle />
        </SectionComponent>
      )}

      <SectionComponent>
        {renderInfoItem(
          'Tác giả',
          <AuthorComponent authorId={item.authorId} onPress={() => {}} />,
        )}

        {renderInfoItem(
          'Ngày tạo',
          <TextComponent
            text={GetTime.getFullTimeString(item.createdAt)}
            color={appColors.white}
          />,
        )}
        {renderInfoItem(
          'Số chương',
          <TextComponent
            text={item.totalChaps?.toString() ?? ''}
            color={appColors.white}
          />,
        )}
        {renderInfoItem(
          'Cập nhật lần cuối',
          <TextComponent
            text={GetTime.getFullTimeString(item.updatedAt)}
            color={appColors.white}
          />,
        )}
        {renderInfoItem(
          'Lượt nghe',
          <TextComponent
            text={item.listens.toString() ?? ''}
            color={appColors.white}
          />,
        )}
        {renderInfoItem(
          'Yêu thích',
          <TextComponent
            text={item.liked ? item.liked.length.toString() : '0'}
            color={appColors.white}
          />,
        )}
      </SectionComponent>
    </View>
  );
};

export default Infocomponent;
