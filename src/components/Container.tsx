/** @format */

import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {appColors} from '../constants/appColors';
import {darkStyles} from '../styles/darkStyles';
import {lightStyles} from '../styles/lightStyles';
import {RowComponent} from './RowComponent';
import TitleComponent from './TitleComponent';
import {useDispatch, useSelector} from 'react-redux';
import {disableModal, playingSelector} from '../redux/reducers/playingData';
import PlayingControlModal from '../modals/PlayingControlModal';

interface Props {
  children: any;
  title?: any;
  back?: boolean;
  right?: ReactNode;
  scroll?: boolean;
  styles?: StyleProp<ViewStyle>;
  search?: ReactNode;
  isFlex?: boolean;
  isShow?: boolean;
  onCloseModal?: () => void;
}

const Container = (props: Props) => {
  const {
    title,
    children,
    back,
    right,
    scroll,
    styles,
    search,
    isFlex,
    isShow,
    onCloseModal,
  } = props;
  const theme = useColorScheme();
  const styleTheme = theme === 'light' ? lightStyles : darkStyles;
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={[styleTheme.container, styles]}>
      {title || right || back ? (
        <RowComponent
          styles={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {back ? (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{paddingRight: 16}}>
              <ArrowLeft2
                size={20}
                color={theme === 'dark' ? appColors.light : appColors.dark}
              />
            </TouchableOpacity>
          ) : (
            <View style={{width: 42}} />
          )}

          {title && (
            <TitleComponent
              text={title}
              line={1}
              flex={1}
              styles={{textAlign: 'center'}}
            />
          )}

          {search && search}

          {right ? right : <View style={{width: 42}} />}
        </RowComponent>
      ) : null}

      <View
        style={{
          flex: 1,
        }}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{flexGrow: isFlex ? 1 : 0}}
            automaticallyAdjustContentInsets={false}>
            {children}
          </ScrollView>
        ) : (
          <View style={{flex: 1}}>{children}</View>
        )}
      </View>

      <PlayingControlModal
        visible={isShow ? true : false}
        onClose={() => {
          onCloseModal && onCloseModal();
          dispatch(disableModal({}));
        }}
      />
    </View>
  );
};

export default Container;
