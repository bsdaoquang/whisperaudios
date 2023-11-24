import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {appColors} from '../../constants/appColors';
import {UserEdit} from 'iconsax-react-native';
import ButtonIcon from '../../components/ButtonIcon';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';

const ProfileData = ({navigation}: any) => {
  const user = auth().currentUser;

  const [profile, setProfile] = useState();

  useEffect(() => {
    user &&
      firestore()
        .doc(`${appInfos.databaseNames.users}/${user.uid}`)
        .onSnapshot((snap: any) => {
          if (snap.exists) {
            setProfile(snap.data());
          }
        });
  }, [user]);

  console.log(profile);

  return (
    <Container
      title={'Thông tin tài khoản'}
      right={
        <ButtonIcon
          icon={<UserEdit size={22} color={appColors.text} />}
          onPress={() => {}}
        />
      }
      back
      scroll>
      <TextComponent text="fsfs" />
    </Container>
  );
};

export default ProfileData;
