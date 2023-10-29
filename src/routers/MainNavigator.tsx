/** @format */

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import AudioDetail from '../screens/audios/AudioDetail';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeRoot" component={TabNavigator} />
      <Stack.Screen name="AudioDetail" component={AudioDetail} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
