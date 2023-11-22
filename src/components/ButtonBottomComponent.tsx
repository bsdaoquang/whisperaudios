import React from 'react';
import {appColors} from '../constants/appColors';
import {i18n} from '../languages/i18n';
import ButtonComponent from './ButtonComponent';
import LinkComponent from './LinkComponent';
import {RowComponent} from './RowComponent';
import SectionComponent from './SectionComponent';

interface Props {
  textCancel?: string;
  onCancel?: () => void;
  onOK?: () => void;
  oKText?: string;
  cancelable?: boolean;
  disable?: boolean;
}

const ButtonBottomComponent = (props: Props) => {
  const {textCancel, onOK, oKText, onCancel, cancelable, disable} = props;

  return (
    <SectionComponent>
      <RowComponent>
        <LinkComponent
          styles={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          size={16}
          text={textCancel ?? i18n.t('cancel')}
          onPress={onCancel ? onCancel : () => undefined}
        />
        <ButtonComponent
          disable={disable}
          styles={{flex: 1}}
          text={oKText ?? i18n.t('Upload')}
          onPress={onOK ? onOK : () => undefined}
          textStyle={{color: appColors.white}}
        />
      </RowComponent>
    </SectionComponent>
  );
};

export default ButtonBottomComponent;
