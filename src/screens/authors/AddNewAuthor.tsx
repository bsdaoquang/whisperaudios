import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Author} from '../../models';
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
const innitialData: Author = {
  name: '',
  slug: '',
  image: '',
  followers: [],
  star: 0,
  description: '',
  count: 0,
  listens: 0,
};

const AddNewAuthor = ({navigation}: any) => {
  const [author, setAuthor] = useState(innitialData);
  const [isShowModalUploadImage, setIsShowModalUploadImage] = useState(false);

  const handleAddNewAuthor = () => {
    const data = {
      ...author,
      slug: replaceName(author.name),
    };

    firestore()
      .collection(appInfos.databaseNames.authors)
      .add(data)
      .then(() => {
        showToast('Đã thêm tác giả');
        navigation.goBack();
      })
      .catch(error => {
        showToast('Không thể thêm tác giả' + error.message);
      });
  };

  const handleChangeFormData = (val: string, key: string) => {
    const data: any = {...author};
    data[`${key}`] = val;

    setAuthor(data);
  };

  return (
    <Container back title={i18n.t('addNewAuthor')}>
      <SectionComponent>
        <RowComponent>
          {author.image ? (
            <FastImage
              source={{uri: author.image}}
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
              value={author.image}
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
          value={author.name}
          onChange={val => handleChangeFormData(val, 'name')}
          clear
          placeholder={i18n.t('authorName')}
        />
        <InputCompoment
          title={i18n.t('description')}
          value={author.description}
          onChange={val => handleChangeFormData(val, 'description')}
          clear
          placeholder={i18n.t('content')}
          multiline
          numberOfLine={5}
        />
      </SectionComponent>
      <ButtonBottomComponent
        onCancel={() => navigation.goBack()}
        onOK={handleAddNewAuthor}
        disable={!author.name}
        oKText="Thêm tác giả"
      />
      <ModalUploadFile
        isVisible={isShowModalUploadImage}
        onClose={() => setIsShowModalUploadImage(false)}
        onUploadFinish={val => handleChangeFormData(val, 'image')}
      />
    </Container>
  );
};

export default AddNewAuthor;
