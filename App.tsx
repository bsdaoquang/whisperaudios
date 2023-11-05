import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getCountry} from 'react-native-localize';
import {Host} from 'react-native-portalize/lib/Host';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {Provider} from 'react-redux';
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

  useEffect(() => {
    settupPlayer();
  }, []);

  const settupPlayer = async () => {
    let isPlayerInitialized = false;

    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });

      isPlayerInitialized = true;
    } catch (e) {
      // intentionally leaved as blank
      console.log(e);
    }
  };
  return (
    <>
      <StatusBar hidden />
      <GestureHandlerRootView style={{flex: 1}}>
        <Provider store={store}>
          <Host>
            <NavigationContainer>
              <Router />
            </NavigationContainer>
          </Host>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
