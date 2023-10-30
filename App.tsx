import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import {getCountry} from 'react-native-localize';
import {i18n} from './src/languages/i18n';
import store from './src/redux/store';
import Router from './src/routers/Router';

GoogleSignin.configure({
  webClientId:
    '122728025595-dni755pvglind3b2ta26q2g5mg32c5i7.apps.googleusercontent.com',
});

const App = () => {
  const lang = getCountry();
  i18n.locale = lang ? lang.toLowerCase() : 'us';

  return (
    <>
      <StatusBar hidden />
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
