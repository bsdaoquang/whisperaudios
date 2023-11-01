/** @format */

import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2, More} from 'iconsax-react-native';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RowComponent} from '../../../components/RowComponent';
import {appColors} from '../../../constants/appColors';
import TitleComponent from '../../../components/TitleComponent';
import {fontFamilies} from '../../../constants/fontFamilies';

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
      }}
    >
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          backgroundColor: 'rgba(255, 255, 255,0.9)',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft2 size={20} color={appColors.text} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
        }}
      >
        <TitleComponent
          text="Audio Detail"
          size={18}
          flex={1}
          styles={{textAlign: 'center', fontFamily: fontFamilies.bold}}
        />
      </View>

      <RowComponent styles={{justifyContent: 'flex-end'}}>
        <TouchableOpacity>
          <More size={20} color={appColors.white} />
        </TouchableOpacity>
      </RowComponent>
    </RowComponent>
  );
};

export default HeaderAudioDetail;
