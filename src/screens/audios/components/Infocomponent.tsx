import {View, Text, Touchable, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Book} from '../../../models';
import SectionComponent from '../../../components/SectionComponent';
import TitleComponent from '../../../components/TitleComponent';
import TextComponent from '../../../components/TextComponent';
import {appColors} from '../../../constants/appColors';

interface Props {
  item: Book;
}

const Infocomponent = (props: Props) => {
  const {item} = props;
  const [line, setLine] = useState(5);

  return (
    <SectionComponent>
      <TitleComponent text="Description" />
      <TouchableOpacity onPress={() => setLine(line === 5 ? 25 : 5)}>
        <TextComponent
          text={item.description}
          line={line}
          flex={1}
          styles={{textAlign: 'justify', lineHeight: 20}}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setLine(line === 5 ? 25 : 5)}>
        <TextComponent text="See more" flex={1} color={appColors.link} />
      </TouchableOpacity>
    </SectionComponent>
  );
};

export default Infocomponent;
