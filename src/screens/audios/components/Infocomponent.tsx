import React, {ReactNode, useState} from 'react';
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

interface Props {
  item: Book;
}

const Infocomponent = (props: Props) => {
  const {item} = props;
  const [line, setLine] = useState(5);

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
        <RowComponent onPress={() => {}}>
          <Octicons name={'bell-fill'} size={20} color={appColors.white} />
          <SpaceComponent width={12} />
          <TextComponent text="Đã đăng ký nhận thông báo cập nhật" />
        </RowComponent>
      </SectionComponent>
      <SectionComponent>
        <TitleComponent
          text="Description"
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

        <TouchableOpacity onPress={() => setLine(line === 5 ? 25 : 5)}>
          <TextComponent text="See more" flex={1} color={appColors.link} />
        </TouchableOpacity>
      </SectionComponent>

      <SectionComponent>
        {renderInfoItem(
          'Tác giả',
          <AuthorComponent onPress authorId={item.authorId} />,
        )}
        {renderInfoItem('Giọng đọc', item.recordBy ?? <></>)}
        {renderInfoItem('Người đăng', item.uploadBy ?? <></>)}
        {renderInfoItem(
          'Ngày tạo',
          <TextComponent text={GetTime.getFullTimeString(item.createdAt)} />,
        )}
        {renderInfoItem(
          'Số chương',
          <TextComponent text={item.totalChaps?.toString() ?? ''} />,
        )}
        {renderInfoItem(
          'Cập nhật lần cuối',
          <TextComponent text={GetTime.getFullTimeString(item.updatedAt)} />,
        )}
        {renderInfoItem(
          'Lượt nghe',
          <TextComponent text={item.listens.toString() ?? ''} />,
        )}
        {renderInfoItem(
          'Yêu thích',
          <TextComponent
            text={item.liked ? item.liked.length.toString() : '0'}
          />,
        )}
      </SectionComponent>
    </View>
  );
};

export default Infocomponent;
