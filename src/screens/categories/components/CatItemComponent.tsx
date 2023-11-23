import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Category} from '../../../models';
import {RowComponent} from '../../../components/RowComponent';
import {useNavigation} from '@react-navigation/native';
import {appColors} from '../../../constants/appColors';
import TitleComponent from '../../../components/TitleComponent';
import {fontFamilies} from '../../../constants/fontFamilies';
import TextComponent from '../../../components/TextComponent';
import {ArrowRight2} from 'iconsax-react-native';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../../constants/appInfos';

interface Props {
  item: Category;
}

const CatItemComponent = (props: Props) => {
  const [countAudios, setCountAudios] = useState(0);

  const {item} = props;
  const navigation: any = useNavigation();

  useEffect(() => {
    firestore()
      .collection(appInfos.databaseNames.audios)
      .where('categories', 'array-contains', item.key)
      .get()
      .then(snap => {
        setCountAudios(snap.size);
      });
  }, [item]);

  return (
    <RowComponent
      onPress={() =>
        navigation.navigate('CategoryBooks', {
          id: item.key,
          title: item.title,
        })
      }
      styles={{
        marginHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: appColors.gray2,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View style={{paddingRight: 12, flex: 1}}>
        <TitleComponent text={item.title} font={fontFamilies.medium} />
        <TextComponent
          text={`${
            item.followers ? item.followers.length : 0
          } followers • ${countAudios} auidos`}
          color={appColors.text2}
        />
      </View>

      <ArrowRight2 size={16} color={appColors.gray7} />
    </RowComponent>
  );
};

export default CatItemComponent;
