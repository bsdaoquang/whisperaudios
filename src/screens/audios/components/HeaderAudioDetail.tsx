/** @format */

import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RowComponent} from '../../../components/RowComponent';
import {appColors} from '../../../constants/appColors';
import ButtonIcon from '../../../components/ButtonIcon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {userSelector} from '../../../redux/reducers/userReducer';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../../constants/appInfos';
import {HandleAudio} from '../../../utils/handleAudio';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SpaceComponent from '../../../components/SpaceComponent';
import {onShare} from '../../../utils/onShare';

interface Props {
  title?: string;
  audioId: string;
  liked: string[];
}
const HeaderAudioDetail = (props: Props) => {
  const navigation: any = useNavigation();
  const {title, audioId, liked} = props;

  const [likedData, setLikedData] = useState<string[]>(liked ?? ['']);

  const auth = useSelector(userSelector);

  useEffect(() => {
    handleCheckLiked();
  }, [audioId]);

  const handleCheckLiked = () => {
    firestore()
      .doc(`${appInfos.databaseNames.audios}/${audioId}`)
      .onSnapshot((snap: any) => {
        setLikedData(snap.data().liked ? snap.data().liked : []);
      });
  };

  return (
    <LinearGradient colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0)']}>
      <RowComponent
        styles={{
          paddingVertical: 20,
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            backgroundColor: 'rgba(255, 255, 255,0.9)',
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={20} color={appColors.text} />
        </TouchableOpacity>

        <RowComponent styles={{justifyContent: 'flex-end'}}>
          <ButtonIcon
            onPress={onShare}
            icon={<MaterialIcons name={'share'} size={24} />}
          />
          <SpaceComponent width={12} />
          <ButtonIcon
            onPress={() =>
              HandleAudio.UpdateLiked(likedData, audioId, auth.uid)
            }
            icon={
              <Ionicons
                name={likedData.includes(auth.uid) ? 'heart' : 'heart-outline'}
                size={24}
              />
            }
          />
        </RowComponent>
      </RowComponent>
    </LinearGradient>
  );
};

export default HeaderAudioDetail;
