/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import {LogBox} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

GoogleSignin.configure({
  webClientId:
    '311627208266-1iadl63htatp64g91hs4avdrqdtsu9qv.apps.googleusercontent.com',
});

// AppRegistry.registerComponent(...);
TrackPlayer.registerPlaybackService(() => require('./service'));

AppRegistry.registerComponent(appName, () => App);
