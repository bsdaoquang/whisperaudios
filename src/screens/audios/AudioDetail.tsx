/** @format */

import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthorComponent from '../../components/AuthorComponent';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TagComponent from '../../components/TagComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {appColors} from '../../constants/appColors';
import {appInfos} from '../../constants/appInfos';
import {fontFamilies} from '../../constants/fontFamilies';
import {Book} from '../../models';
import {globalStyles} from '../../styles/globalStyles';
import HeaderAudioDetail from './components/HeaderAudioDetail';
import Infocomponent from './components/Infocomponent';
import {Chapter} from '../../models/Book';
import firestore from '@react-native-firebase/firestore';
import {LoadingComponent} from '../../components/LoadingComponent';
import {useDispatch} from 'react-redux';
import {addPlaying} from '../../redux/reducers/playingData';
import Container from '../../components/Container';

const AudioDetail = ({route, navigation}: any) => {
  const {audio}: {audio: Book} = route.params;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isVisibleModalPlay, setIsVisibleModalPlay] = useState(false);
  const [tabSelected, setTabSelected] = useState<'info' | 'chaps'>('info');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getChapterInfo();
  }, [audio]);

  const getChapterInfo = async () => {
    setIsLoading(true);
    await firestore()
      .collection(appInfos.databaseNames.chapters)
      .doc(audio.chapsId)
      .get()
      .then((snap: any) => {
        if (snap.exists) {
          setChapters(snap.data().chaps);
        }
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  };

  const handleAddPlaylist = (index: number) => {
    dispatch(
      addPlaying({
        chaps: chapters,
        chapIndex: index,
      }),
    );
  };

  return (
    <Container>
      <ImageBackground
        source={{uri: audio.image}}
        style={{
          width: appInfos.sizes.width,
          height: appInfos.sizes.height,
        }}
        imageStyle={{resizeMode: 'cover'}}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
          locations={[0, 0.75]}
          style={{flex: 1}}>
          <HeaderAudioDetail />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{paddingTop: '50%'}} />
            <SectionComponent>
              <RowComponent styles={{marginBottom: 8}}>
                <TagComponent
                  icon={
                    <AntDesign
                      name="star"
                      size={14}
                      color={appColors.primary}
                      style={{marginRight: 4}}
                    />
                  }
                  text="4.5"
                  styles={styles.tag}
                  textStyle={{color: appColors.primary, fontSize: 12}}
                />
                <TagComponent
                  icon={
                    <MaterialCommunityIcons
                      name="playlist-music"
                      size={17}
                      color={appColors.primary}
                      style={{marginRight: 4}}
                    />
                  }
                  text={audio.totalChaps?.toString() ?? ''}
                  styles={styles.tag}
                  textStyle={{color: appColors.primary, fontSize: 12}}
                />
                <TagComponent
                  icon={
                    <MaterialCommunityIcons
                      name="motion-play"
                      size={14}
                      color={appColors.primary}
                      style={{marginRight: 4}}
                    />
                  }
                  text={audio.listens.toString() ?? '0'}
                  styles={styles.tag}
                  textStyle={{color: appColors.primary, fontSize: 12}}
                />
              </RowComponent>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TitleComponent
                  text={audio.title}
                  flex={0}
                  font={fontFamilies.bold}
                  size={22}
                  line={2}
                  styles={{textAlign: 'center'}}
                />
                <RowComponent>
                  <TextComponent text="By: " flex={0} />
                  <AuthorComponent
                    authorId={audio.authorId}
                    textStyle={{color: appColors.white}}
                  />
                </RowComponent>
              </View>
            </SectionComponent>
            <SectionComponent>
              <RowComponent
                styles={{
                  backgroundColor: `rgba(245, 245, 246, 0.1)`,
                  // opacity: 0.5,
                  borderRadius: 100,
                  padding: 4,
                }}>
                <TouchableOpacity
                  onPress={() => setTabSelected('info')}
                  style={[
                    styles.tab,
                    {
                      borderRadius: 100,
                      backgroundColor:
                        tabSelected === 'info'
                          ? `rgba(245, 245, 246, 0.8)`
                          : undefined,
                    },
                  ]}>
                  <TextComponent
                    text="Infomations"
                    color={
                      tabSelected === 'info' ? appColors.text : appColors.white
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTabSelected('chaps')}
                  style={[
                    styles.tab,
                    {
                      borderRadius: 100,
                      backgroundColor:
                        tabSelected === 'chaps'
                          ? `rgba(245, 245, 246, 0.8)`
                          : undefined,
                    },
                  ]}>
                  <TextComponent
                    text="Chapters"
                    color={
                      tabSelected === 'chaps' ? appColors.text : appColors.white
                    }
                  />
                </TouchableOpacity>
              </RowComponent>
            </SectionComponent>
            {tabSelected === 'info' ? (
              <Infocomponent item={audio} />
            ) : chapters.length > 0 ? (
              chapters.map((item, index) => (
                <RowComponent
                  key={`item${index}`}
                  onPress={() => handleAddPlaylist(index)}
                  styles={{
                    paddingHorizontal: 16,
                    marginBottom: 16,
                  }}>
                  <TextComponent
                    text={item.title}
                    flex={1}
                    font={fontFamilies.medium}
                  />
                </RowComponent>
              ))
            ) : (
              <LoadingComponent isLoading={isLoading} value={chapters.length} />
            )}
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
            }}>
            <TouchableOpacity
              onPress={() => handleAddPlaylist(0)}
              style={[
                styles.tab,
                globalStyles.rowCenter,
                {
                  backgroundColor: `rgba(245, 245, 246, 1)`,
                  paddingHorizontal: 16,
                },
              ]}>
              <MaterialCommunityIcons
                name="motion-play"
                size={14}
                color={appColors.primary}
                style={{marginRight: 4}}
              />
              <TextComponent text="Listen now" color={appColors.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Container>
  );
};

export default AudioDetail;
const styles = StyleSheet.create({
  tag: {
    backgroundColor: appColors.white,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  tab: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: appColors.white,
    borderRadius: 100,
  },
});
