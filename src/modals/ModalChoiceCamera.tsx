import {useNavigation} from '@react-navigation/native';
import {Camera} from 'iconsax-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ImageProps,
  PermissionsAndroid,
  View,
  useColorScheme,
} from 'react-native';
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonIcon from '../components/ButtonIcon';
import {RowComponent} from '../components/RowComponent';
import SpaceComponent from '../components/SpaceComponent';
import TextComponent from '../components/TextComponent';
import TitleComponent from '../components/TitleComponent';
import {appColors} from '../constants/appColors';
import storage from '@react-native-firebase/storage';
import {useDispatch, useSelector} from 'react-redux';
import {userSelector} from '../redux/reducers/userReducer';
import {showToast} from '../utils/showToast';
import LoadingModal from './LoadingModal';
import auth from '@react-native-firebase/auth';
import {handleAuthentication} from '../utils/handleAuthentication';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
}

interface AvatarProps extends ImageProps {
  onChange?: (image: ImageOrVideo) => void;
}

const ModalChoiceCamera = (props: Props, avatarProps: AvatarProps) => {
  const {isVisible, onClose, title} = props;

  const [isUploadFile, setIsUploadFile] = useState(false);

  const modalizeRef = useRef<Modalize>();
  const navigation: any = useNavigation();
  const theme = useColorScheme();
  const dispatch = useDispatch();

  const user = useSelector(userSelector);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (isVisible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [isVisible]);

  const optionPicker = {
    width: 300,
    height: 300,
    cropping: true,
  };

  const handlePickerImage = async (target: 'camera' | 'library') => {
    const cameraGranded = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    onClose();
    if (target === 'camera') {
      if (cameraGranded) {
        ImageCropPicker.openCamera({...optionPicker, mediaType: 'photo'})
          .then((image: ImageOrVideo) => {
            handleUploadImage(image);
          })
          .catch(error => console.log('Lỗi', error.toString()));
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      }
      //request permision
    } else {
      await ImageCropPicker.openPicker({
        ...optionPicker,
        mediaType: 'photo',
      }).then((image: ImageOrVideo) => {
        handleUploadImage(image);
      });
    }
  };

  const handleUploadImage = async (file: ImageOrVideo) => {
    setIsUploadFile(true);
    const filePath = `avatars/uid-${user.uid}-${Date.now()}.${
      file.path.split('.')[file.path.split('.').length - 1]
    }`;
    const res = await storage().ref(filePath).putFile(file.path);
    storage()
      .ref(filePath)
      .getDownloadURL()
      .then(async url => {
        await currentUser
          ?.updateProfile({
            photoURL: url,
          })
          .then(() => {
            handleAuthentication.UpdateUser(auth().currentUser, dispatch);

            setIsUploadFile(false);
            modalizeRef.current?.close();
          });
      })
      .catch(error => {
        showToast('Không thể tải file lên');
        setIsUploadFile(false);
        modalizeRef.current?.close();
      });
  };

  return (
    <Portal>
      <Modalize
        panGestureEnabled={true}
        adjustToContentHeight
        closeOnOverlayTap
        onClosed={onClose}
        ref={modalizeRef}
        handlePosition="inside"
        handleStyle={{
          backgroundColor: theme === 'dark' ? appColors.light : appColors.gray,
        }}
        modalStyle={{
          backgroundColor: theme === 'dark' ? appColors.dark1 : appColors.light,
        }}>
        <View style={{paddingBottom: 20, paddingHorizontal: 20}}>
          <RowComponent styles={{marginTop: 20}}>
            <View
              style={{
                flex: 1,
                marginRight: -22,
              }}>
              {title && (
                <TitleComponent
                  text={title}
                  flex={1}
                  styles={{textAlign: 'center'}}
                  line={1}
                />
              )}
            </View>
            <ButtonIcon
              icon={
                <AntDesign
                  name="close"
                  size={22}
                  color={theme === 'dark' ? appColors.light : appColors.dark}
                />
              }
              onPress={() => modalizeRef.current?.close()}
            />
          </RowComponent>
          <RowComponent
            onPress={() => handlePickerImage('camera')}
            styles={{marginVertical: 12}}>
            <Camera size={22} color={appColors.gray} />
            <SpaceComponent width={12} />
            <TextComponent text={'Chụp ảnh'} flex={1} size={16} />
          </RowComponent>
          <RowComponent
            onPress={() => handlePickerImage('library')}
            styles={{marginVertical: 12}}>
            <MaterialCommunityIcons
              name="folder-multiple-image"
              size={22}
              color={appColors.gray}
            />
            <SpaceComponent width={12} />
            <TextComponent text={'Chọn ảnh từ thư viện'} flex={1} size={16} />
          </RowComponent>
        </View>
      </Modalize>
      <LoadingModal visible={isUploadFile} />
    </Portal>
  );
};

export default ModalChoiceCamera;
