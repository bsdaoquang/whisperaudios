/** @format */

import {appColors} from '../constants/appColors';
import {RowComponent} from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import {useColorScheme} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  liked: string[];
  listen: number;
  type: string;
  chaps?: number;
}

const HeartListenCount = (props: Props) => {
  const {liked, chaps, listen, type} = props;

  const theme = useColorScheme();
  const color = theme === 'dark' ? appColors.light : appColors.dark1;

  return (
    <RowComponent>
      <TextComponent
        text={`${liked ? liked.length : 0}`}
        size={12}
        line={1}
        icon={<AntDesign name="like1" size={14} color={color} />}
      />
      <SpaceComponent width={8} />
      <TextComponent
        text={`${listen}`}
        size={12}
        line={1}
        icon={
          <MaterialCommunityIcons
            name="headphones-settings"
            size={14}
            color={color}
          />
        }
      />
      <SpaceComponent width={8} />
      {chaps ? (
        <TextComponent
          text={`${chaps}`}
          size={12}
          line={1}
          icon={
            <MaterialCommunityIcons
              name="playlist-music"
              size={16}
              color={color}
            />
          }
        />
      ) : null}
    </RowComponent>
  );
};

export default HeartListenCount;
