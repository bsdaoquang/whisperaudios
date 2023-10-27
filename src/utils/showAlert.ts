import {Alert} from 'react-native';

export const showAlert = ({
  title,
  mess,
  onPress,
}: {
  title?: string;
  mess: string;
  onPress: () => void;
}) => {
  return Alert.alert(title ? title : '', mess, [
    {text: 'Hủy bỏ', style: 'cancel', onPress: () => {}},
    {
      text: 'Đồng ý',
      style: 'default',
      onPress: onPress,
    },
  ]);
};
