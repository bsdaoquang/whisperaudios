import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
  KeyboardType,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import TextComponent from './TextComponent';
import {RowComponent} from './RowComponent';
import ButtonIcon from './ButtonIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TitleComponent from './TitleComponent';

interface Props {
  val: string;
  title?: string;
  onFinish?: (newVal: string) => void;
  placeHolder?: string;
  type?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
    | 'url';
  inputMode?:
    | 'none'
    | 'text'
    | 'decimal'
    | 'numeric'
    | 'tel'
    | 'search'
    | 'email'
    | 'url';
  isEdit?: boolean;
}

const InputEditComponent = (props: Props) => {
  const {val, title, onFinish, placeHolder, type, inputMode, isEdit} = props;

  const [value, setValue] = useState(val);
  const [isEneable, setIsEneable] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const inputRef = useRef<any>();

  useEffect(() => {
    isEneable && inputRef.current?.focus();
  }, [isEneable]);

  useEffect(() => {
    setIsChange(true);
  }, [value]);

  return (
    <View style={{marginBottom: 16}}>
      {title && <TextComponent text={title} flex={0} />}
      {isEdit ? (
        <RowComponent>
          <TextInput
            ref={inputRef}
            placeholder={placeHolder ? placeHolder : title ? title : ''}
            value={value}
            onChangeText={val => setValue(val)}
            style={styles.input}
            keyboardType={type ?? 'default'}
            inputMode={inputMode ?? 'none'}
            editable={isEneable}
          />

          {isEneable ? (
            <ButtonIcon
              icon={
                <MaterialIcons
                  name={value === val ? 'close' : 'save'}
                  size={22}
                  color={value === val ? appColors.error4 : appColors.primary}
                />
              }
              onPress={
                value !== val
                  ? () => {
                      setIsEneable(false);
                      onFinish && onFinish(value);
                    }
                  : () => setIsEneable(false)
              }
            />
          ) : (
            <ButtonIcon
              icon={
                <MaterialIcons
                  name={isEneable && value === val ? 'close' : 'edit'}
                  size={22}
                  color={appColors.gray}
                />
              }
              onPress={() => setIsEneable(true)}
            />
          )}
        </RowComponent>
      ) : (
        <TitleComponent flex={0} styles={{marginTop: 4}} text={val} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 0,
    flex: 1,
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.gray2,
    padding: 4,
  },
});

export default InputEditComponent;
