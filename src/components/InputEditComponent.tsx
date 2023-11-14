import {View, Text, TextInput, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import TextComponent from './TextComponent';
import {RowComponent} from './RowComponent';
import ButtonIcon from './ButtonIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  val: string;
  title?: string;
  onFinish: (newVal: string) => void;
  placeHolder?: string;
}

const InputEditComponent = (props: Props) => {
  const {val, title, onFinish, placeHolder} = props;

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
    <View>
      {title && <TextComponent text={title} flex={0} />}
      <RowComponent>
        <TextInput
          ref={inputRef}
          placeholder={placeHolder ? placeHolder : title ? title : ''}
          value={value}
          onChangeText={val => setValue(val)}
          style={styles.input}
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
            onPress={() =>
              value !== val ? onFinish(value) : setIsEneable(false)
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
