import React from 'react';
import {ImageBackground, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonIcon from '../../components/ButtonIcon';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TitleComponent from '../../components/TitleComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {fontFamilies} from '../../constants/fontFamilies';

const Recording = ({navigation}: any) => {
  return (
    <ImageBackground
      source={require('../../assets/images/bg-recording.jpg')}
      style={{flex: 1}}
      imageStyle={{
        width: appInfos.sizes.width,
        height: appInfos.sizes.height,
        resizeMode: 'cover',
      }}>
      <SectionComponent styles={{paddingTop: 32}}>
        <RowComponent styles={{justifyContent: 'space-between'}}>
          <ButtonIcon
            onPress={() => navigation.goBack()}
            icon={<AntDesign name="close" size={22} color={appColors.white} />}
          />
          <ButtonIcon
            onPress={() => navigation.goBack()}
            icon={
              <Ionicons
                name="checkmark-outline"
                size={26}
                color={appColors.white}
              />
            }
          />
        </RowComponent>
      </SectionComponent>
      <RowComponent>
        <TitleComponent
          text={'00:00:00'}
          color={appColors.white}
          font={fontFamilies.regular}
          size={52}
          flex={0}
        />
      </RowComponent>
      <View style={{flex: 1}} />

      <RowComponent styles={{paddingBottom: 80}}>
        <ButtonIcon
          styles={{
            width: 62,
            height: 62,
            borderRadius: 100,
            backgroundColor: appColors.red4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          icon={<Ionicons name={'play'} color={appColors.white} size={32} />}
          onPress={() => {}}
        />
      </RowComponent>
    </ImageBackground>
  );
};

export default Recording;
