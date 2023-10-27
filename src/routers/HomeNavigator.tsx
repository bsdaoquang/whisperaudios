/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import CategoryBooks from '../screens/categories/CategoryBooks';
import NewBooks from '../screens/audios/NewBooks';
import HomeScreen from '../screens/home/HomeScreen';
import AuthorsScreen from '../screens/authors/AuthorsScreen';
import AuthorDetail from '../screens/authors/AuthorDetail';
import AudioDetail from '../screens/audios/AudioDetail';

const HomeNavigator = () => {
	const HomeStack = createNativeStackNavigator();
	return (
		<HomeStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<HomeStack.Screen name='HomeScreen' component={HomeScreen} />
			<HomeStack.Screen name='CategoriesScreen' component={CategoriesScreen} />
			<HomeStack.Screen name='CategoryBooks' component={CategoryBooks} />
			<HomeStack.Screen name='NewBooks' component={NewBooks} />
			<HomeStack.Screen name='AuthorsScreen' component={AuthorsScreen} />
			<HomeStack.Screen name='AuthorDetail' component={AuthorDetail} />
		</HomeStack.Navigator>
	);
};

export default HomeNavigator;
