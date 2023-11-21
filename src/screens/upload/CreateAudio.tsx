import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {InputCompoment} from '../../components/InputComponent';
import SectionComponent from '../../components/SectionComponent';
import {RowComponent} from '../../components/RowComponent';
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../../constants/appColors';
import ModalUploadFile from '../../modals/ModalUploadFile';
import FastImage from 'react-native-fast-image';
import DropdownPicker from '../../components/DropdownPicker';
import {i18n} from '../../languages/i18n';
import {DropdownItem} from '../../models/DropdownItem';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';
import ButtonComponent from '../../components/ButtonComponent';
import LinkComponent from '../../components/LinkComponent';

const innitialData: {
  title: string;
  description: string;
  image: any;
  categories: string[];
  slug: string;
  authorId: string;
} = {
  title: '',
  description: '',
  image: undefined,
  categories: [],
  slug: '',
  authorId: '',
};

const CreateAudio = ({navigation}: any) => {
  const [audio, setAudio] = useState(innitialData);
  const [isShowModalUploadImage, setIsShowModalUploadImage] = useState(false);
  const [authors, setAuthors] = useState<DropdownItem[]>([]);
  const [categories, setCategories] = useState<DropdownItem[]>([]);

  useEffect(() => {
    firestore()
      .collection(appInfos.databaseNames.authors)
      .onSnapshot(snap => {
        if (!snap.empty) {
          const items: DropdownItem[] = [];

          snap.forEach(item => {
            items.push({
              value: item.id,
              label: item.data().name,
            });
          });

          setAuthors(items);
        }
      });

    firestore()
      .collection(appInfos.databaseNames.categories)
      .onSnapshot(snap => {
        if (!snap.empty) {
          const items: DropdownItem[] = [];

          snap.forEach(item => {
            items.push({
              label: item.data().title,
              value: item.id,
            });
          });
          setCategories(items);
        }
      });
  }, []);

  useEffect(() => {
    const backAction = () => {
      handleCancel();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleFormData = (val: string | string[], key: string) => {
    const data: any = {...audio};

    data[`${key}`] = val;

    setAudio(data);
  };

  const handleUploadBook = () => {
    console.log(audio);
  };

  const handleCancel = () => {
    if (
      audio.title ||
      audio.authorId ||
      audio.categories.length > 0 ||
      audio.image
    ) {
      Alert.alert(
        'Thông báo',
        'Dữ liệu của bạn sẽ không được lưu trữ, bạn vẫn muốn tiếp tục thoát?',
        [
          {
            text: i18n.t('cancel'),
          },
          {
            text: 'Thoát',
            onPress: () => {
              setAudio(innitialData);
              navigation.goBack();
            },
          },
        ],
      );
    } else {
      setAudio(innitialData);
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <Container back title={'Tạo audio mới'} onBack={handleCancel} scroll>
        <SectionComponent>
          {audio.image && (
            <FastImage
              source={{uri: audio.image.path}}
              style={{
                width: 120,
                height: 150,
                borderRadius: 10,
                marginBottom: 12,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
          <RowComponent>
            <View style={{flex: 1, marginRight: 10}}>
              {/* <InputCompoment
                title="Hình ảnh"
                value={audio.image.path}
                onChange={val => handleFormData(val, 'image')}
                placeholder="Url image"
              /> */}
            </View>
            <TouchableOpacity onPress={() => setIsShowModalUploadImage(true)}>
              <Ionicons
                name="cloud-upload"
                size={32}
                color={appColors.primary}
                style={{marginBottom: -12}}
              />
            </TouchableOpacity>
          </RowComponent>
          <InputCompoment
            title="Tên audio"
            value={audio.title}
            onChange={val => handleFormData(val, 'title')}
            clear
            placeholder="Tên Audio"
          />
          <DropdownPicker
            items={authors}
            selected={audio.authorId}
            title={i18n.t('author')}
            onSeleted={val => handleFormData(val, 'authorId')}
            placeholder={i18n.t('choiceAuthor')}
            onAddNew={() => console.log('fasfas')}
          />
          <DropdownPicker
            items={categories}
            selected={audio.categories}
            title={i18n.t('categories')}
            onSeleted={val => handleFormData(val, 'categories')}
            multible
            placeholder={i18n.t('choiceCategories')}
          />
          <InputCompoment
            title="Mô tả"
            value={audio.title}
            onChange={val => handleFormData(val, 'title')}
            clear
            placeholder="Giới thiệu về audio này"
            multiline
            styles={{textAlignVertical: 'top'}}
            numberOfLine={6}
          />
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <LinkComponent
              styles={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              size={16}
              text={i18n.t('cancel')}
              onPress={handleCancel}
            />
            <ButtonComponent
              disable={
                !audio.title ||
                !audio.authorId ||
                !audio.categories ||
                !audio.image
              }
              styles={{flex: 1}}
              text={i18n.t('Upload')}
              onPress={handleUploadBook}
              textStyle={{color: appColors.white}}
            />
          </RowComponent>
        </SectionComponent>

        <ModalUploadFile
          isVisible={isShowModalUploadImage}
          onClose={() => setIsShowModalUploadImage(false)}
          onUploadFinish={val => handleFormData(val, 'image')}
        />
      </Container>
    </KeyboardAvoidingView>
  );
};

export default CreateAudio;
