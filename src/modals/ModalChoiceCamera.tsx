import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {
  ActionSheetIOS,
  ImageProps,
  Platform,
  View,
  useColorScheme,
} from 'react-native';
import ImageCropPicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {RowComponent} from '../components/RowComponent';
import TextComponent from '../components/TextComponent';
import {i18n} from '../languages/i18n';
import {appColors} from '../constants/appColors';
import TitleComponent from '../components/TitleComponent';
import ButtonIcon from '../components/ButtonIcon';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSelectedFile: (selectedFile: any) => void;
  title?: string;
}

interface AvatarProps extends ImageProps {
  onChange?: (image: ImageOrVideo) => void;
}

const menuUpdateProfile = ['Đóng', 'Chụp ảnh', 'Chọn ảnh từ album'];

const ModalChoiceCamera = (props: Props, avatarProps: AvatarProps) => {
  const {isVisible, onClose, onSelectedFile, title} = props;

  const modalizeRef = useRef<Modalize>();
  const navigation: any = useNavigation();
  const theme = useColorScheme();

  useEffect(() => {
    if (isVisible) {
      Platform.OS === 'android'
        ? modalizeRef.current?.open()
        : ActionSheetIOS.showActionSheetWithOptions(
            {
              options: menuUpdateProfile,
              cancelButtonIndex: 0,
              userInterfaceStyle: 'light',
              title: 'Cập nhật ảnh đại diện',
            },

            buttonIndex => handleChoiceUpdateImage(buttonIndex),
          );
    } else {
      Platform.OS === 'android' && modalizeRef.current?.close();
    }
  }, [isVisible]);

  const handleChoiceUpdateImage = (index: number) => {
    // switch (index) {
    //   case 0:
    //     Platform.OS === 'android' ? modalize.current?.close() : onClose();
    //     break;
    //   case 1:
    //     photoId
    //       ? navigation.navigate('ImageViewDetail', {
    //           fileId: photoId,
    //           title: '',
    //         })
    //       : showToast('');
    //     break;
    //   case 2:
    //     handlePickerImage('camera');
    //     break;
    //   case 3:
    //     handlePickerImage('library');
    //     break;
    // }
  };

  const handlePickerImage = async (target: 'camera' | 'library') => {
    onClose();
    if (target === 'camera') {
      //request permision
      ImageCropPicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
      })
        .then((image: ImageOrVideo) => {
          const file = {
            uri: image.path,
            name: 'image',
            type: image.mime,
            size: image.size,
          };

          // handleUploadFile(file);
          handleChangeImage(file);
          avatarProps.onChange?.(image);
        })
        .catch(error => console.log('Lỗi', error.toString()));
    } else {
      await launchImageLibrary({mediaType: 'photo'}, result => {
        if (result && result.assets) {
          const file = result.assets[0];
          if (file && file.uri) {
            const newFile = {
              uri: file.uri,
              name: file.fileName ?? '',
              type: file.type as string,
              size: file.fileSize ?? 0,
            };

            handleChangeImage(newFile);
          }
        }
      });
    }
  };

  const handleChangeImage = async (file: any) => {
    ImageCropPicker.openCropper({
      width: 300,
      height: 300,
      cropping: true,
      mediaType: 'photo',
      path: file.uri,
    })
      .then((image: ImageOrVideo) => {
        const file = {
          uri: image.path,
          name: `image-${image.modificationDate}.${image.mime.split('/')[1]}`,
          type: image.mime,
          size: image.size,
        };

        // handleUploadFile(file);
        onSelectedFile(file);
        avatarProps.onChange?.(image);
      })
      .catch(error => console.log('Lỗi', error.toString()));
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
          {menuUpdateProfile.map(
            (item, index) =>
              index > 0 && (
                <RowComponent
                  styles={{marginVertical: 12}}
                  key={`item${index}`}>
                  <TextComponent text={item} flex={1} />
                </RowComponent>
              ),
          )}
        </View>
      </Modalize>
      {/* <Modalize
        ref={modalize}
        adjustToContentHeight
        avoidKeyboardLikeIOS
        handlePosition="inside">
        <View
          style={{
            padding: 16,
            marginBottom: 20,
          }}>
          <View>
            {menuUpdateProfile.map(
              (item, index) =>
                index > 0 && (
                  <RowComponent key={`item${index}`}>
                    <TextComponent text={item} flex={1} />
                  </RowComponent>
                  // <ListMenuItem
                  //   key={`item${index}`}
                  //   title={item}
                  //   onPress={() => handleChoiceUpdateImage(index)}
                  // />
                ),
            )}
          </View>
        </View>
      </Modalize> */}
    </Portal>
  );
};

export default ModalChoiceCamera;
