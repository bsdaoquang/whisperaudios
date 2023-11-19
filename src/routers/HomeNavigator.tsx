/** @format */

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import NewBooks from '../screens/audios/NewBooks';
import RatingsScreen from '../screens/audios/components/RatingsScreen';
import AuthorDetail from '../screens/authors/AuthorDetail';
import AuthorsScreen from '../screens/authors/AuthorsScreen';
import BooksByAuthor from '../screens/authors/BooksByAuthor';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import CategoryBooks from '../screens/categories/CategoryBooks';
import HomeScreen from '../screens/home/HomeScreen';

const HomeNavigator = () => {
  const HomeStack = createNativeStackNavigator();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <HomeStack.Screen name="CategoryBooks" component={CategoryBooks} />
      <HomeStack.Screen name="NewBooks" component={NewBooks} />
      <HomeStack.Screen name="AuthorsScreen" component={AuthorsScreen} />
      <HomeStack.Screen name="AuthorDetail" component={AuthorDetail} />
      <HomeStack.Screen name="RatingsScreen" component={RatingsScreen} />
      <HomeStack.Screen name="BooksByAuthor" component={BooksByAuthor} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
