import {Camera} from 'iconsax-react-native';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import {appColors} from '../../constants/appColors';
import {i18n} from '../../languages/i18n';
import {userSelector} from '../../redux/reducers/userReducer';
import ModalChoiceCamera from '../../modals/ModalChoiceCamera';

const EditProfile = ({navigation}: any) => {
  const user = useSelector(userSelector);
  const [isVisibleModalCamera, setIsVisibleModalCamera] = useState(false);

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
                  user && user.photoURL
                    ? {uri: user.photoURL}
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
      <ModalChoiceCamera
        isVisible={isVisibleModalCamera}
        onClose={() => setIsVisibleModalCamera(false)}
        onSelectedFile={file => console.log(file)}
      />
    </Container>
  );
};

export default EditProfile;
