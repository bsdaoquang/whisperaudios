/** @format */

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import TabNavigator from './TabNavigator';
import AudioDetail from '../screens/audios/AudioDetail';
import PlayingScreen from '../screens/audios/PlayingScreen';
import AddNewAuthor from '../screens/authors/AddNewAuthor';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeRoot" component={TabNavigator} />
      <Stack.Screen name="AudioDetail" component={AudioDetail} />
      <Stack.Screen name="PlayingScreen" component={PlayingScreen} />
      <Stack.Screen name="AddNewAuthor" component={AddNewAuthor} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
