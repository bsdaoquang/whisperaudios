/** @format */

import React from 'react';
import {TouchableOpacity} from 'react-native';
import {RowComponent} from './RowComponent';
import TextComponent from './TextComponent';
import TitleComponent from './TitleComponent';
import {i18n} from '../languages/i18n';
import {appColors} from '../constants/appColors';

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
      <TitleComponent text={title} size={18} />
      {seemore && onPress && (
        <TouchableOpacity onPress={onPress}>
          <TextComponent
            color={appColors.link}
            text={i18n.t('seemore')}
            size={14}
            flex={0}
          />
        </TouchableOpacity>
      )}
    </RowComponent>
  );
};

export default TabbarComponent;
