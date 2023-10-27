import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';

import {NavigationContainer} from '@react-navigation/native';
import store from './src/redux/store';
import TabNavigator from './src/routers/TabNavigator';

const App = () => {
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
