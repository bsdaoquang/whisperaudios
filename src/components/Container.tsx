/** @format */

import {useNavigation} from '@react-navigation/native';
import {ArrowLeft2} from 'iconsax-react-native';
import React, {ReactNode} from 'react';
import {
  KeyboardAvoidingView,
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
  onBack?: () => void;
}

const Container = (props: Props) => {
  const {title, children, back, right, scroll, styles, search, isFlex, onBack} =
    props;
  const theme = useColorScheme();
  const styleTheme = theme === 'light' ? lightStyles : darkStyles;
  const navigation: any = useNavigation();

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <View style={[styleTheme.container, styles]}>
        {title || right || back ? (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            {back && (
              <TouchableOpacity
                onPress={onBack ? () => onBack() : () => navigation.goBack()}
                style={{paddingRight: 16}}>
                <ArrowLeft2
                  size={24}
                  color={theme === 'dark' ? appColors.light : appColors.dark}
                />
              </TouchableOpacity>
            )}

            {title && (
              <View style={{flex: 1}}>
                <TitleComponent
                  size={18}
                  text={title}
                  line={1}
                  styles={{lineHeight: 26}}
                />
              </View>
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default Container;
