import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';
import {getCountry} from 'react-native-localize';
import {i18n} from './src/languages/i18n';
import store from './src/redux/store';
import TabNavigator from './src/routers/TabNavigator';

const App = () => {
  const lang = getCountry();
  console.log(lang.toLowerCase());
  i18n.locale = lang ? lang.toLowerCase() : 'us';

  return (
    <>
      <StatusBar hidden />
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
