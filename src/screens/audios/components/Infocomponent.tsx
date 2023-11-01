import {View, Text} from 'react-native';
import React from 'react';
import {Book} from '../../../models';
import SectionComponent from '../../../components/SectionComponent';
import TitleComponent from '../../../components/TitleComponent';
import TextComponent from '../../../components/TextComponent';

interface Props {
  item: Book;
}

const Infocomponent = (props: Props) => {
  const {item} = props;

  return (
    <SectionComponent>
      <TitleComponent text="Description" />
      <TextComponent
        text={item.description}
        line={25}
        flex={1}
        styles={{textAlign: 'justify', lineHeight: 20}}
      />
    </SectionComponent>
  );
};

export default Infocomponent;
