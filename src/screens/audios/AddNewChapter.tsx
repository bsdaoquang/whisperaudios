import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import DocumentPicker, {
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import ButtonBottomComponent from '../../components/ButtonBottomComponent';
import ButtonIcon from '../../components/ButtonIcon';
import Container from '../../components/Container';
import DropdownPicker from '../../components/DropdownPicker';
import {InputCompoment} from '../../components/InputComponent';
import {LoadingComponent} from '../../components/LoadingComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {i18n} from '../../languages/i18n';
import LoadingModal from '../../modals/LoadingModal';
import ModalUploadFile from '../../modals/ModalUploadFile';
import {Book} from '../../models';
import {Chap, Chapter} from '../../models/Chapter';
import {DropdownItem} from '../../models/DropdownItem';
import {userSelector} from '../../redux/reducers/userReducer';
import {calcFileSize} from '../../utils/calcFileSize';
import {showToast} from '../../utils/showToast';
import storage from '@react-native-firebase/storage';
import {handleCheckAndSendNotification} from '../../utils/handleCheckAndSendNotification';

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
  const [bookId, setBookId] = useState('');
  const [chapDetail, setChapDetail] = useState<Chapter>();
  const [chap, setChap] = useState(innitialData);
  const [audioByUser, setAudioByUser] = useState<DropdownItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModalUploadImage, setIsShowModalUploadImage] = useState(false);
  const [soundFile, setSoundFile] = useState<any>();
  const [soundUrl, setSoundUrl] = useState('');
  const [isUpload, setIsUpload] = useState(false);
  const [progressUpload, setProgressUpload] = useState('');

  const user = useSelector(userSelector);

  useEffect(() => {
    !user.uid ? navigation.navigate('ProfileTab') : getAudiosByUser();
  }, [user]);

  useEffect(() => {
    bookId && getChapsDetail();
  }, [bookId]);

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
          const items: DropdownItem[] = [];
          snap.forEach((item: any) => {
            items.push({
              value: item.id,
              label: item.data().title,
            });
          });

          setAudioByUser(items);
          setIsLoading(false);
        }
      });
  };

  const getChapsDetail = () => {
    firestore()
      .doc(`${appInfos.databaseNames.audios}/${bookId}`)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          const audioDetail: Book = snap.data();
          if (audioDetail.chapsId) {
            firestore()
              .doc(`${appInfos.databaseNames.chapters}/${audioDetail.chapsId}`)
              .get()
              .then((snapChap: any) => {
                if (snapChap.exists) {
                  setChapDetail({
                    key: audioDetail.chapsId,
                    ...snapChap.data(),
                  });
                }
              });
          } else {
            console.log('Chưa có chap nào');
          }
        } else {
          showToast('Không tìm thấy audio này');
        }
      });
  };

  const handleUploadChap = async () => {
    const data: Chap = {...chap};

    if (soundFile) {
      // console.log(soundFile);
      setIsUpload(true);
      const filePath = `audios/${soundFile.name}`;
      const res = await storage().ref(filePath).putFile(soundFile.fileCopyUri);
      setProgressUpload(
        `${((res.bytesTransferred / res.totalBytes) * 100).toFixed(2)}%`,
      );
      storage()
        .ref(filePath)
        .getDownloadURL()
        .then(async url => {
          data.audio = url;

          handleUploadChapter(data);

          setIsUpload(false);
        })
        .catch(error => {
          showToast('Không thể tải file lên');
          setIsUpload(false);
        });
    } else {
      handleUploadChapter(data);
    }
  };

  const handleUploadChapter = (data: Chap) => {
    let chaps = [];
    let chapData: any = {};
    if (chapDetail) {
      chaps = chapDetail.chaps;
      chaps.push(data);

      firestore()
        .doc(`${appInfos.databaseNames.chapters}/${chapDetail.key}`)
        .update({
          updateAt: Date.now(),
          chaps,
        })
        .then(() => {
          firestore().doc(`${appInfos.databaseNames.audios}/${bookId}`).update({
            totalChaps: chaps.length,
          });
        })
        .then(() => {
          handleCheckAndSendNotification({bookId});
          showToast('Đã tải lên chương mới, cám ơn sự đóng góp của bạn');
          navigation.goBack();
        });
    } else {
      chaps = [data];
      chapData = {
        bookId,
        chaps,
        updateAt: Date.now(),
      };

      firestore()
        .collection(appInfos.databaseNames.chapters)
        .add(chapData)
        .then(snap => {
          firestore()
            .doc(`${appInfos.databaseNames.audios}/${bookId}`)
            .update({
              chapsId: snap.id,
              totalChaps: chaps.length,
            })
            .then(() => {
              handleCheckAndSendNotification({bookId});
              showToast('Đã tải lên chương mới, cám ơn sự đóng góp của bạn');
              navigation.goBack();
            });
        });
    }
  };

  const handleError = (err: unknown) => {
    if (isCancel(err)) {
      console.warn('cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn(
        'multiple pickers were opened, only the last will be considered',
      );
    } else {
      throw err;
    }
  };

  return (
    <Container back title={i18n.t('uploadChapter')} scroll>
      {audioByUser.length > 0 ? (
        <>
          <SectionComponent>
            <DropdownPicker
              items={audioByUser}
              selected={bookId}
              title={'Audio'}
              onSeleted={val => setBookId(val as string)}
              placeholder={'Chọn audio'}
              // onAddNew={() => navigation.navigate('AddNewCategory')}
            />
            <InputCompoment
              value={chap.title}
              onChange={val => handleUpdateForm(val, 'title')}
              title={i18n.t('title')}
              placeholder={i18n.t('title')}
            />
            <InputCompoment
              value={chap.subtitle}
              onChange={val => handleUpdateForm(val, 'subtitle')}
              title={i18n.t('description')}
              placeholder={i18n.t('description')}
              multiline
              numberOfLine={4}
            />

            {chap.cover && (
              <FastImage
                source={{uri: chap.cover}}
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
                <InputCompoment
                  title="Hình ảnh"
                  value={chap.cover}
                  onChange={val => handleUpdateForm(val, 'cover')}
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

            <RowComponent>
              <View style={{flex: 1, marginRight: 10}}>
                <InputCompoment
                  title="File âm thanh"
                  value={chap.audio}
                  onChange={val => {
                    setSoundUrl(val);
                    handleUpdateForm(val, 'audio');
                  }}
                  placeholder="Url hoặc tải lên"
                  clear
                />
              </View>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await DocumentPicker.pickSingle({
                      type: types.audio,
                      copyTo: 'cachesDirectory',
                    }).then(res => {
                      setSoundFile(res);
                    });
                  } catch (error: any) {
                    handleError(error);
                  }
                }}>
                <Ionicons
                  name="cloud-upload"
                  size={32}
                  color={appColors.primary}
                  style={{marginBottom: -12}}
                />
              </TouchableOpacity>
            </RowComponent>
            {soundFile && (
              <RowComponent styles={{alignItems: 'flex-start'}}>
                <View style={{flex: 1, paddingRight: 12}}>
                  <TextComponent text={`${soundFile.name}`} flex={0} />
                  <TextComponent
                    text={`${calcFileSize(soundFile.size)}`}
                    flex={0}
                  />
                </View>
                <ButtonIcon
                  onPress={() => setSoundFile(undefined)}
                  icon={
                    <AntDesign name="close" size={22} color={appColors.red4} />
                  }
                />
              </RowComponent>
            )}
          </SectionComponent>
          <ButtonBottomComponent
            onCancel={() => navigation.goBack()}
            oKText="Tải lên"
            onOK={handleUploadChap}
            disable={!chap.title || !bookId || (!chap.audio && !soundFile)}
          />
        </>
      ) : (
        <LoadingComponent
          isLoading={isLoading}
          value={audioByUser.length}
          message="Bạn chưa tạo audio nào, hãy tạo audio trước nhé"
        />
      )}

      <LoadingModal
        visible={isUpload}
        mess={`Đang tải lên ${progressUpload}`}
      />
      <ModalUploadFile
        isVisible={isShowModalUploadImage}
        onClose={() => setIsShowModalUploadImage(false)}
        onUploadFinish={val => handleUpdateForm(val, 'cover')}
      />
    </Container>
  );
};

export default AddNewChapter;
