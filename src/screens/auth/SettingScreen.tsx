import {View, Text, Switch, useColorScheme, Appearance} from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import {RowComponent} from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import SectionComponent from '../../components/SectionComponent';
import {i18n} from '../../languages/i18n';
import {getCountry} from 'react-native-localize';

const SettingScreen = ({navigation}: any) => {
  const theme = useColorScheme();
  const lang = getCountry();

  return (
    <Container back title={i18n.t('setting')}>
      <SectionComponent styles={{marginTop: 20}}>
        <RowComponent
          styles={{paddingVertical: 10}}
          onPress={() =>
            Appearance.setColorScheme(theme === 'dark' ? 'light' : 'dark')
          }>
          <TextComponent text={i18n.t('theme')} flex={1} />
          <Switch
            value={theme === 'dark'}
            onChange={() =>
              Appearance.setColorScheme(theme === 'dark' ? 'light' : 'dark')
            }
          />
        </RowComponent>
        <RowComponent
          styles={{paddingVertical: 10}}
          onPress={() => (i18n.locale = lang)}>
          <TextComponent text={i18n.t('language')} flex={1} />
          <RowComponent>
            <TextComponent text="Vie" />
            <View>
              <Switch value={lang.toLowerCase() === 'us'} style={{flex: 0}} />
            </View>
            <TextComponent text="Eng" />
          </RowComponent>
        </RowComponent>
      </SectionComponent>
    </Container>
  );
};

export default SettingScreen;
