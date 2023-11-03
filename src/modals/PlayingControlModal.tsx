import React, {useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {RowComponent} from '../components/RowComponent';
import TextComponent from '../components/TextComponent';
import {appColors} from '../constants/appColors';
import {playingSelector, remotePlaying} from '../redux/reducers/playingData';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PlayingControlModal = (props: Props) => {
  const {visible, onClose} = props;

  const modalizeRef = useRef<Modalize>();
  const playlist = useSelector(playingSelector);
  const dispatch = useDispatch();

  // console.log(playlist, visible);

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
          <TouchableOpacity onPress={() => dispatch(remotePlaying({}))}>
            <AntDesign name="close" size={24} color={appColors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
            <AntDesign name="close" size={24} color={appColors.text} />
          </TouchableOpacity>
        </RowComponent>

        <TextComponent text="fasfah" />
      </Modalize>
    </Portal>
  );
};

export default PlayingControlModal;
