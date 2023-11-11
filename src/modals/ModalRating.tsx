import React, {useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  View,
  useColorScheme,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ButtonIcon from '../components/ButtonIcon';
import {RowComponent} from '../components/RowComponent';
import TitleComponent from '../components/TitleComponent';
import {appColors} from '../constants/appColors';
import {useSelector} from 'react-redux';
import {userSelector} from '../redux/reducers/userReducer';
import TextComponent from '../components/TextComponent';
import {Rating} from '@kolking/react-native-rating';
import {InputCompoment} from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import LoadingModal from './LoadingModal';
import firestore from '@react-native-firebase/firestore';
import {appInfos} from '../constants/appInfos';
import {showToast} from '../utils/showToast';

interface Props {
  visible: boolean;
  onClose: () => void;
  audioId: string;
  star: number;
}

const ModalRating = (props: Props) => {
  const {visible, onClose, audioId, star} = props;

  const [rate, setRate] = useState(star);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const auth = useSelector(userSelector);
  const theme = useColorScheme();

  const handleRatingAudio = async () => {
    const data = {
      by: auth.uid,
      bookId: audioId,
      review: content,
      time: Date.now(),
      star: rate,
    };

    setLoading(true);
    await firestore()
      .collection(appInfos.databaseNames.ratings)
      .add(data)
      .then(() => {
        setLoading(false);
        showToast('Cám ơn đánh giá của bạn!!');
        onClose();
      })
      .catch(error => console.log(error));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      style={{flex: 1, height: '100%'}}
      statusBarTranslucent>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <View
            style={{
              backgroundColor:
                theme === 'light' ? appColors.white : appColors.dark,
              width: '100%',
              padding: 16,
              borderRadius: 12,
            }}>
            <RowComponent
              styles={{justifyContent: 'flex-end', marginBottom: 12}}>
              <TitleComponent flex={1} text="Đánh giá" />
              <ButtonIcon
                onPress={onClose}
                icon={
                  <AntDesign
                    name="close"
                    size={24}
                    color={theme === 'light' ? appColors.dark : appColors.white}
                  />
                }
              />
            </RowComponent>

            <RowComponent
              styles={{
                paddingVertical: 18,
              }}>
              <Rating
                size={32}
                rating={rate}
                onChange={val => setRate(val)}
                touchColor={appColors.yellow4}
                fillColor={appColors.yellow4}
              />
            </RowComponent>

            <TextComponent
              text="Hãy nói thêm về trải nghiệm của bạn khi nghe audio này"
              line={2}
            />
            <InputCompoment
              placeholder="gasgas"
              value={content}
              onChange={val => setContent(val)}
              multiline
              numberOfLine={5}
              styles={{textAlignVertical: 'top'}}
              onEnd={() => Keyboard.dismiss()}
            />
            <RowComponent styles={{justifyContent: 'flex-end'}}>
              <ButtonComponent
                width={'50%'}
                text="Gửi"
                onPress={handleRatingAudio}
              />
            </RowComponent>
          </View>
        </View>
      </KeyboardAvoidingView>
      <LoadingModal visible={loading} />
    </Modal>
  );
};

export default ModalRating;
