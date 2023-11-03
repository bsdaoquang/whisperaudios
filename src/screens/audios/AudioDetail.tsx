/** @format */

import React, {useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RowComponent} from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import TextComponent from '../../components/TextComponent';
import {appInfos} from '../../constants/appInfos';
import {Book} from '../../models';
import HeaderAudioDetail from './components/HeaderAudioDetail';
import SpaceComponent from '../../components/SpaceComponent';
import TitleComponent from '../../components/TitleComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import AuthorComponent from '../../components/AuthorComponent';
import {appColors} from '../../constants/appColors';
import TagComponent from '../../components/TagComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyles} from '../../styles/globalStyles';
import Infocomponent from './components/Infocomponent';
import ChapterComponent from '../../components/ChapterComponent';

const AudioDetail = ({route, navigation}: any) => {
  const {audio}: {audio: Book} = route.params;

  const [tabSelected, setTabSelected] = useState<'info' | 'chaps'>('info');

  return (
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
                size={18}
                line={2}
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
          ) : (
            <ChapterComponent id={audio.chapsId} isList />
          )}
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}>
          <TouchableOpacity
            onPress={() => console.log('')}
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
