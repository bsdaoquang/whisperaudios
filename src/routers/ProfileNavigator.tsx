/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeAuth from '../screens/auth/HomeAuth';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginWithPhone from '../screens/auth/LoginWithPhone';

const ProfileNavigator = () => {
	const AuthStack = createNativeStackNavigator();
	return (
		<AuthStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<AuthStack.Screen name='HomeAuth' component={HomeAuth} />
			<AuthStack.Screen name='RegisterScreen' component={RegisterScreen} />
			<AuthStack.Screen name='LoginWithPhone' component={LoginWithPhone} />
		</AuthStack.Navigator>
	);
};

export default ProfileNavigator;
