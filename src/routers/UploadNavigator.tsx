import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import UploadScreen from '../screens/upload/UploadScreen';
import CreateAudio from '../screens/upload/CreateAudio';

const UploadNavigator = () => {
  const UploadStack = createNativeStackNavigator();
  return (
    <UploadStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <UploadStack.Screen name="UploadHome" component={UploadScreen} />
      <UploadStack.Screen name="CreateAudio" component={CreateAudio} />
    </UploadStack.Navigator>
  );
};

export default UploadNavigator;
