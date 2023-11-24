/** @format */

import React, {useEffect} from 'react';
import MainNavigator from './MainNavigator';
import {useDispatch} from 'react-redux';
import {addUser} from '../redux/reducers/userReducer';
import auth from '@react-native-firebase/auth';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AudioDetail from '../screens/audios/AudioDetail';
import PlayingScreen from '../screens/audios/PlayingScreen';
import AddNewAuthor from '../screens/authors/AddNewAuthor';
import AddNewCategory from '../screens/categories/AddNewCategory';
import AddNewChapter from '../screens/audios/AddNewChapter';
import Recording from '../screens/audios/Recording';
import AddNewRecorder from '../screens/audios/AddNewRecorder';
import HomeScreen from '../screens/home/HomeScreen';
import CategoriesScreen from '../screens/categories/CategoriesScreen';
import CategoryBooks from '../screens/categories/CategoryBooks';
import NewBooks from '../screens/audios/NewBooks';
import AuthorsScreen from '../screens/authors/AuthorsScreen';
import AuthorDetail from '../screens/authors/AuthorDetail';
import RatingsScreen from '../screens/audios/components/RatingsScreen';
import BooksByAuthor from '../screens/authors/BooksByAuthor';
import SearchBooks from '../screens/SearchBooks';
import HomeAuth from '../screens/auth/HomeAuth';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginWithPhone from '../screens/auth/LoginWithPhone';
import SettingScreen from '../screens/auth/SettingScreen';
import ListeningsScreen from '../screens/auth/ListeningsScreen';
import LikedAudios from '../screens/auth/LikedAudios';
import EditProfile from '../screens/auth/EditProfile';
import NotificationsScreen from '../screens/auth/NotificationsScreen';

const Router = () => {
  const dispatch = useDispatch();
  const user = auth().currentUser;
  useEffect(() => {
    user && dispatch(addUser(user));
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="CategoryBooks" component={CategoryBooks} />
      <Stack.Screen name="NewBooks" component={NewBooks} />
      <Stack.Screen name="AuthorsScreen" component={AuthorsScreen} />
      <Stack.Screen name="AuthorDetail" component={AuthorDetail} />
      <Stack.Screen name="RatingsScreen" component={RatingsScreen} />
      <Stack.Screen name="BooksByAuthor" component={BooksByAuthor} />
      <Stack.Screen name="AudioDetail" component={AudioDetail} />
      <Stack.Screen name="PlayingScreen" component={PlayingScreen} />
      <Stack.Screen name="AddNewAuthor" component={AddNewAuthor} />
      <Stack.Screen name="AddNewCategory" component={AddNewCategory} />
      <Stack.Screen name="AddNewChapter" component={AddNewChapter} />
      <Stack.Screen name="Recording" component={Recording} />
      <Stack.Screen name="AddNewRecorder" component={AddNewRecorder} />
      <Stack.Screen name="Search" component={SearchBooks} />
      <Stack.Screen name="HomeAuth" component={HomeAuth} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="LoginWithPhone" component={LoginWithPhone} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="ListeningsScreen" component={ListeningsScreen} />
      <Stack.Screen name="LikedAudios" component={LikedAudios} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );

  return <MainNavigator />;
};

export default Router;
