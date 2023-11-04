import React, {useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import AuthorComponent from '../components/AuthorComponent';
import {RowComponent} from '../components/RowComponent';
import SectionComponent from '../components/SectionComponent';
import SpaceComponent from '../components/SpaceComponent';
import TitleComponent from '../components/TitleComponent';
import {appColors} from '../constants/appColors';
import {Book} from '../models';
import {Chapter} from '../models/Book';
import {playingSelector} from '../redux/reducers/playingData';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PlayingControlModal = (props: Props) => {
  const {visible, onClose} = props;

  const modalizeRef = useRef<Modalize>();
  const playlist = useSelector(playingSelector);
  const dispatch = useDispatch();

  const {
    audio,
    chaps,
    chapIndex,
    isShow,
  }: {audio: Book; chaps: Chapter[]; chapIndex: number; isShow: boolean} =
    playlist;

  useEffect(() => {
    visible ? modalizeRef.current?.open() : modalizeRef.current?.close();
  }, [visible]);

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        handlePosition="inside"
        onClose={onClose}
        adjustToContentHeight>
        <RowComponent styles={{padding: 16, justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
            <AntDesign name="close" size={24} color={appColors.text} />
          </TouchableOpacity>
        </RowComponent>

        <SectionComponent
          styles={{justifyContent: 'center', alignItems: 'center'}}>
          <FastImage
            source={{uri: audio.image}}
            style={{width: 150, height: 150, borderRadius: 100}}
            resizeMode={FastImage.resizeMode.cover}
          />
          <SpaceComponent height={18} />
          <TitleComponent text={audio.title} size={22} />
          <AuthorComponent authorId={audio.authorId} />
        </SectionComponent>
      </Modalize>
    </Portal>
  );
};

export default PlayingControlModal;
