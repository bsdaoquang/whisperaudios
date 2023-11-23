import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {NativeEventEmitter, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getCountry} from 'react-native-localize';
import {Host} from 'react-native-portalize/lib/Host';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {Provider} from 'react-redux';
import {i18n} from './src/languages/i18n';
import store from './src/redux/store';
import Router from './src/routers/Router';
import {requestUserPermission} from './src/utils/notificationsHelper';
import Toast from 'react-native-toast-message';

const eventEmitter = new NativeEventEmitter();

const App = () => {
  const lang = getCountry();
  i18n.locale = lang ? lang.toLowerCase() : 'us';

  useEffect(() => {
    settupPlayer();
    requestUserPermission();
    eventEmitter.removeAllListeners('backgroundTimer');
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
          // Capability.Stop,
          Capability.SeekTo,
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
          <Toast />
        </Provider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
