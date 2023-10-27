/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SearchBooks from '../screens/SearchBooks';
import AudioDetail from '../screens/audios/AudioDetail';
import CategoryBooks from '../screens/categories/CategoryBooks';
import AuthorDetail from '../screens/authors/AuthorDetail';

const SearchNavigator = () => {
	const SearchStack = createNativeStackNavigator();
	return (
		<SearchStack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<SearchStack.Screen name='Search' component={SearchBooks} />
			<SearchStack.Screen name='CategoryBooks' component={CategoryBooks} />
			<SearchStack.Screen name='AuthorDetail' component={AuthorDetail} />
		</SearchStack.Navigator>
	);
};

export default SearchNavigator;
