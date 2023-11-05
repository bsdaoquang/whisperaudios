import {View, Text, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';

interface Props {
  icon: ReactNode;
  onPress: () => void;
  styles?: StyleProp<ViewStyle>;
}

const ButtonIcon = (props: Props) => {
  const {icon, onPress, styles} = props;

  return (
    <TouchableOpacity style={styles} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

export default ButtonIcon;
