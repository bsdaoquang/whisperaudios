import {View, Text} from 'react-native';
import React from 'react';
import {RatingModel} from '../models/RatingModel';
import {RowComponent} from './RowComponent';
import UserComponent from './UserComponent';
import ButtonIcon from './ButtonIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RatingComponent from './RatingComponent';
import TextComponent from './TextComponent';
import {GetTime} from '../utils/getTime';
import SpaceComponent from './SpaceComponent';
import {appColors} from '../constants/appColors';

interface Props {
  item: RatingModel;
}

const RatingItemComponent = (props: Props) => {
  const {item} = props;

  return (
    <View style={{paddingVertical: 16}}>
      <RowComponent>
        <View style={{flex: 1}}>
          <UserComponent isTitle size={30} uid={item.by} />
        </View>
        <ButtonIcon
          onPress={() => {}}
          icon={<MaterialIcons name="more-vert" size={20} />}
        />
      </RowComponent>
      <RowComponent styles={{justifyContent: 'flex-start', paddingVertical: 8}}>
        <RatingComponent count={item.star} />
        <SpaceComponent width={12} />
        <TextComponent
          text={GetTime.getFullTimeString(item.time)}
          color={appColors.white}
        />
      </RowComponent>
      <TextComponent
        text={item.review}
        color={appColors.white}
        flex={1}
        styles={{textAlign: 'justify'}}
      />
    </View>
  );
};

export default RatingItemComponent;
