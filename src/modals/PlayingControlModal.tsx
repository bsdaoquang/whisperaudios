import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, useColorScheme} from 'react-native';
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
import TextComponent from '../components/TextComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const PlayingControlModal = (props: Props) => {
  const {visible, onClose} = props;

  const modalizeRef = useRef<Modalize>();
  const playlist = useSelector(playingSelector);
  const dispatch = useDispatch();
  const theme = useColorScheme();
  const textColor = theme === 'light' ? appColors.dark : appColors.white;
  const iconSize = 20;

  const {
    audio,
    chaps,
    chapIndex,
  }: {audio: Book; chaps: Chapter[]; chapIndex: number; isShow: boolean} =
    playlist;

  const [index, setIndex] = useState(chapIndex);

  useEffect(() => {
    visible ? modalizeRef.current?.open() : modalizeRef.current?.close();
  }, [visible]);

  return audio && chaps.length > 0 ? (
    <Portal>
      <Modalize
        modalStyle={{
          backgroundColor: theme === 'light' ? appColors.light : appColors.dark,
          marginBottom: 20,
        }}
        ref={modalizeRef}
        handlePosition="inside"
        onClose={onClose}
        adjustToContentHeight>
        <RowComponent styles={{padding: 16, justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
            <AntDesign
              name="close"
              size={24}
              color={theme === 'dark' ? appColors.white : appColors.text}
            />
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
        <SectionComponent>
          <TextComponent text={chaps[index].title} flex={1} />
          <RowComponent>
            <TextComponent text={`00:00`} size={12} />
            <View style={{flex: 1}}>
              {/* <Slider
              minimumTrackTintColor={appColors.primary}
              thumbTintColor={appColors.primary}
              maximumTrackTintColor="#e0e0e0"
              value={0}
              minimumValue={0}
              maximumValue={100}
              // onSlidingComplete={async val => {
              //   await TrackPlayer.seekTo(val);
              // }}
            /> */}
            </View>
            <TextComponent text={`00:00`} size={12} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent styles={{justifyContent: 'space-around'}}>
            <TouchableOpacity>
              <Ionicons
                name="play-skip-back"
                size={iconSize - 2}
                color={textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="play-back" size={iconSize} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons
                name="replay-30"
                size={iconSize + 2}
                color={textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  padding: 12,
                  backgroundColor:
                    theme === 'dark' ? appColors.white : appColors.dark,
                  borderRadius: 100,
                },
              ]}>
              <Ionicons name="play" size={22} color={appColors.dark} />
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialIcons
                name="forward-30"
                size={iconSize + 2}
                color={textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="play-forward" size={iconSize} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="play-skip-forward"
                size={iconSize - 2}
                color={textColor}
              />
            </TouchableOpacity>
          </RowComponent>
        </SectionComponent>
      </Modalize>
    </Portal>
  ) : (
    <></>
  );
};
export default PlayingControlModal;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
