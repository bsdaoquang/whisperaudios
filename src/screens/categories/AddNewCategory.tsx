import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Category} from '../../models';
import Container from '../../components/Container';
import {i18n} from '../../languages/i18n';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {InputCompoment} from '../../components/InputComponent';
import FastImage from 'react-native-fast-image';
import {RowComponent} from '../../components/RowComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {appColors} from '../../constants/appColors';
import ModalUploadFile from '../../modals/ModalUploadFile';
import {globalStyles} from '../../styles/globalStyles';
import ButtonBottomComponent from '../../components/ButtonBottomComponent';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';
import {showToast} from '../../utils/showToast';
import {replaceName} from '../../utils/replaceName';
const innitialData: Category = {
  description: '',
  title: '',
  titleEnglish: '',
  slug: '',
  type: '',
  bookIds: [],
  followers: [],
  image: '',
};

const AddNewCategory = ({navigation}: any) => {
  const [Categories, setCategories] = useState(innitialData);
  const [isShowModalUploadImage, setIsShowModalUploadImage] = useState(false);

  const handleAddNewCategories = () => {
    const data = {
      ...Categories,
      slug: replaceName(Categories.title),
    };

    firestore()
      .collection(appInfos.databaseNames.categories)
      .add(data)
      .then(() => {
        showToast('Đã thêm chuyên mục');
        navigation.goBack();
      })
      .catch(error => {
        showToast('Không thể thêm chuyên mục' + error.message);
      });
  };

  const handleChangeFormData = (val: string, key: string) => {
    const data: any = {...Categories};
    data[`${key}`] = val;

    setCategories(data);
  };

  return (
    <Container back title={i18n.t('addNewCategories')}>
      <SectionComponent>
        <RowComponent>
          {Categories.image ? (
            <FastImage
              source={{uri: Categories.image}}
              style={{
                width: 120,
                height: 120,
                borderRadius: 100,
                marginBottom: 12,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setIsShowModalUploadImage(true)}
              style={[
                globalStyles.center,
                {
                  width: 120,
                  height: 120,
                  borderRadius: 100,
                  marginBottom: 12,
                  backgroundColor: appColors.gray2,
                },
              ]}>
              <Ionicons name="cloud-upload" size={32} color={appColors.gray} />
              <TextComponent text="Upload" flex={0} color={appColors.gray} />
            </TouchableOpacity>
          )}
        </RowComponent>
        <RowComponent>
          <View style={{flex: 1, marginRight: 10}}>
            <InputCompoment
              title="Hình ảnh"
              value={Categories.image}
              onChange={val => handleChangeFormData(val, 'image')}
              placeholder="Url image"
              clear
            />
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
          title={i18n.t('name')}
          value={Categories.title}
          onChange={val => handleChangeFormData(val, 'title')}
          clear
          placeholder={i18n.t('CategoriesName')}
        />
        <InputCompoment
          title={i18n.t('description')}
          value={Categories.description}
          onChange={val => handleChangeFormData(val, 'description')}
          clear
          placeholder={i18n.t('content')}
          multiline
          numberOfLine={5}
        />
      </SectionComponent>
      <ButtonBottomComponent
        onCancel={() => navigation.goBack()}
        onOK={handleAddNewCategories}
        disable={!Categories.title}
        oKText="Tạo chuyên mục"
      />
      <ModalUploadFile
        isVisible={isShowModalUploadImage}
        onClose={() => setIsShowModalUploadImage(false)}
        onUploadFinish={val => handleChangeFormData(val, 'image')}
      />
    </Container>
  );
};

export default AddNewCategory;
