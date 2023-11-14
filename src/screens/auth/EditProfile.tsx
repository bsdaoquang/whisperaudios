import auth from '@react-native-firebase/auth';
import {Camera} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Container from '../../components/Container';
import InputEditComponent from '../../components/InputEditComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import {appColors} from '../../constants/appColors';
import {i18n} from '../../languages/i18n';
import ModalChoiceCamera from '../../modals/ModalChoiceCamera';
import {useDispatch} from 'react-redux';
import {handleAuthentication} from '../../utils/handleAuthentication';
import {showToast} from '../../utils/showToast';
import LoadingModal from '../../modals/LoadingModal';

const EditProfile = ({navigation}: any) => {
  const [isVisibleModalCamera, setIsVisibleModalCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = auth().currentUser;
  const dispatch = useDispatch();

  const handleUpdateProfile = async (
    type: 'displayName' | 'phoneNumber',
    val: string,
  ) => {
    const data: any = {};
    setIsLoading(true);
    data[`${type}`] = val;

    currentUser?.updateProfile(data);
    const user = auth().currentUser;

    await handleAuthentication.UpdateUser(user, dispatch).then(() => {
      showToast('Đã cập nhật thông tin tài khoản');
      setIsLoading(false);
    });
  };

  return (
    <Container back title={i18n.t('updateProfile')}>
      <SectionComponent>
        <RowComponent>
          <View
            style={{
              borderWidth: 1,
              borderColor: appColors.white,
              padding: 4,
              borderRadius: 100,
            }}>
            <View>
              <FastImage
                source={
                  currentUser && currentUser.photoURL
                    ? {uri: currentUser.photoURL}
                    : require('../../../assets/images/default-avatar.webp')
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                }}
              />
              <TouchableOpacity
                onPress={() => setIsVisibleModalCamera(true)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: 100,
                }}>
                <Camera size={28} color={appColors.gray2} />
              </TouchableOpacity>
            </View>
          </View>
        </RowComponent>
      </SectionComponent>
      {currentUser && (
        <SectionComponent>
          <InputEditComponent
            val={currentUser.displayName ?? ''}
            onFinish={newVal => handleUpdateProfile('displayName', newVal)}
            placeHolder="Display name"
          />
        </SectionComponent>
      )}
      <ModalChoiceCamera
        isVisible={isVisibleModalCamera}
        onClose={() => setIsVisibleModalCamera(false)}
      />
      <LoadingModal visible={isLoading} />
    </Container>
  );
};

export default EditProfile;
