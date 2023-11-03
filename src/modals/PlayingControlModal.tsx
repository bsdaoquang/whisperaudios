import {View, Text} from 'react-native';
import React from 'react';

interface Props {
  index: number;
  chapId: string;
  visible: boolean;
  onClose: () => void;
}

const PlayingControlModal = (props: Props) => {
  const {index, chapId, visible, onClose} = props;

  return (
    <View>
      <Text>PlayingControlModal</Text>
    </View>
  );
};

export default PlayingControlModal;
