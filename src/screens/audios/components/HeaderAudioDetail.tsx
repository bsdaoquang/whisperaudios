/** @format */

import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2, More} from 'iconsax-react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {RowComponent} from '../../../components/RowComponent';
import {appColors} from '../../../constants/appColors';

interface Props {
  title?: string;
}
const HeaderAudioDetail = (props: Props) => {
  const navigation: any = useNavigation();

  return (
    <RowComponent
      styles={{
        paddingVertical: 20,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft2 size={22} color={appColors.white} />
      </TouchableOpacity>
      <RowComponent styles={{flex: 1, justifyContent: 'flex-end'}}>
        <TouchableOpacity>
          <More size={20} color={appColors.white} />
        </TouchableOpacity>
      </RowComponent>
    </RowComponent>
  );
};

export default HeaderAudioDetail;
