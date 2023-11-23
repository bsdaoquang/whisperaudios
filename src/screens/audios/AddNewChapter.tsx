import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import {i18n} from '../../languages/i18n';
import {Book, Chapter} from '../../models/Book';
import {Chap} from '../../models/Chapter';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../../constants/appInfos';
import {useSelector} from 'react-redux';
import {userSelector} from '../../redux/reducers/userReducer';
import SectionComponent from '../../components/SectionComponent';
import {LoadingComponent} from '../../components/LoadingComponent';
import {InputCompoment} from '../../components/InputComponent';

const innitialData: Chap = {
  audio: '',
  buyUrl: '',
  cover: '',
  downloadFilename: '',
  downloadUrl: '',
  lyrics: '',
  subtitle: '',
  title: '',
};

const AddNewChapter = ({navigation}: any) => {
  const [chapDetail, setChapDetail] = useState<Chapter>();
  const [chap, setChap] = useState(innitialData);
  const [audioByUser, setAudioByUser] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(userSelector);

  useEffect(() => {
    !user.uid ? navigation.navigate('ProfileTab') : getAudiosByUser();
  }, [user]);

  const handleUpdateForm = (val: string, key: string) => {
    const data: any = {...chap};

    data[`${key}`] = val;

    setChap(data);
  };

  const getAudiosByUser = () => {
    setIsLoading(true);
    firestore()
      .collection(appInfos.databaseNames.audios)
      .where('uploadBy', '==', user.uid)
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log('Audios not found');
          setIsLoading(false);
        } else {
          const items: Book[] = [];
          snap.forEach((item: any) => {
            items.push({
              key: item.id,
              ...item.data(),
            });
          });

          setAudioByUser(items);
          setIsLoading(false);
        }
      });
  };
  const getChapDetailByAudioId = (id: string) => {
    firestore()
      .doc(`${appInfos.databaseNames.chapters}/${id}`)
      .get()
      .then(snap => {
        if (snap.exists) {
          console.log(snap.data());
        } else {
          console.log('Chapter not found');
        }
      });
  };

  return (
    <Container back title={i18n.t('uploadChapter')}>
      {audioByUser.length > 0 ? (
        <SectionComponent>
          <InputCompoment
            value={chap.title}
            onChange={val => handleUpdateForm(val, 'title')}
            title={i18n.t('title')}
            placeholder={i18n.t('title')}
          />
        </SectionComponent>
      ) : (
        <LoadingComponent
          isLoading={false}
          value={audioByUser.length}
          message="Bạn chưa tạo audio nào, hãy tạo audio trước nhé"
        />
      )}
      {/* <SectionComponent>
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
      /> */}
    </Container>
  );
};

export default AddNewChapter;
