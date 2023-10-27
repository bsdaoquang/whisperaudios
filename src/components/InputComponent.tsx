/** @format */

import React, {ReactNode, useState} from 'react';
import {
  Keyboard,
  KeyboardTypeOptions,
  StyleProp,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import TextComponent from './TextComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  placeholder?: string;
  value: string;
  max?: number;
  onChange: (val: string) => void;
  flex?: number;
  clear?: boolean;
  show?: boolean;
  type?: KeyboardTypeOptions;
  isSecure?: boolean;
  onEnd?: () => void;
  helpText?: string;
  color?: string;
  prefix?: ReactNode;
  affix?: ReactNode;
  isCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  setIsShowPass?: (val: boolean) => void;
  height?: number;
  styles?: StyleProp<TextStyle>;
  ref?: any;
  autoFocus?: boolean;
  borderRadius?: number;
}

export const InputCompoment = (props: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  const {
    placeholder,
    value,
    max,
    onChange,
    flex,
    clear,
    show,
    type,
    isSecure,
    onEnd,
    helpText,
    setIsShowPass,
    color,
    prefix,
    affix,
    isCapitalize,
    height,
    styles,
    ref,
    autoFocus,
    borderRadius,
  } = props;

  const theme = useColorScheme();
  const inputContainerStyle: StyleProp<ViewStyle> =
    theme === 'light'
      ? {}
      : {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: borderRadius ?? 10,
          borderColor: isFocus
            ? appColors.gray3
            : helpText
            ? appColors.danger
            : appColors.white,
          borderWidth: isFocus || helpText ? 1 : 0,
          paddingHorizontal: 10,
          paddingVertical: 10,
          minHeight: height ?? 42,
          marginTop: 5,
          backgroundColor: color ?? appColors.dark1,
        };

  const inputStyle: StyleProp<TextStyle> =
    theme === 'light'
      ? {}
      : {
          flex: 1,
          margin: 0,
          padding: 0,
          color: appColors.light,
          fontFamily: fontFamilies.regular,
          marginLeft: prefix ? 10 : 0,
        };

  return (
    <View
      style={[
        {marginBottom: 16, flex: flex ?? 0, alignItems: 'flex-start'},
        styles,
      ]}>
      <View style={inputContainerStyle}>
        {prefix && prefix}
        <TextInput
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          ref={ref}
          value={value}
          maxLength={max}
          onChangeText={val => onChange(val)}
          placeholder={placeholder ?? ''}
          secureTextEntry={isSecure ? !show : false}
          placeholderTextColor={appColors.gray7}
          keyboardType={type ? type : 'default'}
          autoComplete={type === 'email-address' ? 'email' : 'off'}
          autoFocus={autoFocus}
          style={[inputStyle, styles]}
          autoCapitalize={isCapitalize}
          onEndEditing={onEnd}
        />

        {affix && affix}

        {isSecure && setIsShowPass ? (
          <TouchableOpacity onPress={show => setIsShowPass(true)}>
            {show ? (
              <Ionicons
                name="eye-off"
                size={18}
                color={appColors.description}
              />
            ) : (
              <Ionicons name="eye" size={18} color={appColors.description} />
            )}
          </TouchableOpacity>
        ) : null}

        {clear && value ? (
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              onChange('');
            }}>
            <AntDesign
              name="close"
              size={16}
              color={theme === 'light' ? appColors.gray : appColors.light}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {helpText ? (
        <TextComponent
          styles={{marginTop: 8}}
          text={helpText}
          color={appColors.danger}
          size={12}
        />
      ) : null}
    </View>
  );
};
