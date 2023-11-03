/** @format */

import React from 'react';
import {TouchableOpacity} from 'react-native';
import {RowComponent} from './RowComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';
import {i18n} from '../languages/i18n';

interface Props {
  title: string;
  onPress?: () => void;
  seemore?: boolean;
}

const TabbarComponent = ({title, onPress, seemore}: Props) => {
  return (
    <RowComponent
      styles={{
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
      }}>
      <TitleComponent text={title} size={22} />
      {seemore && onPress && (
        <TouchableOpacity onPress={onPress}>
          <TextComponent text={i18n.t('seemore')} size={14} flex={0} />
        </TouchableOpacity>
      )}
    </RowComponent>
  );
};

export default TabbarComponent;
