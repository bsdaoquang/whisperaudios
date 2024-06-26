/** @format */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, MusicSquareSearch, User} from 'iconsax-react-native';
import React from 'react';
import {useColorScheme} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {appColors} from '../constants/appColors';
import {userSelector} from '../redux/reducers/userReducer';
import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';
import SearchNavigator from './SearchNavigator';
import UploadNavigator from './UploadNavigator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TabNavigator = () => {
  const Tabs = createBottomTabNavigator();

  const theme = useColorScheme();
  const bgColor = theme === 'light' ? appColors.light : appColors.dark;

  const user = useSelector(userSelector);

  return (
    <Tabs.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: bgColor,
          elevation: 0,
          borderWidth: 0,
          borderColor: bgColor,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({focused, color, size}) => {
          let icon;
          let variant: any = focused ? 'Bold' : 'Outline';
          let iconColor =
            theme === 'dark'
              ? focused
                ? appColors.light
                : appColors.gray
              : focused
              ? appColors.primary
              : appColors.gray;

          if (route.name === 'HomeTab') {
            icon = <Home variant={variant} size={size} color={iconColor} />;
          } else if (route.name === 'SearchTab') {
            icon = (
              <MusicSquareSearch
                variant={variant}
                size={size}
                color={iconColor}
              />
            );
          } else if (route.name === 'UploadTab') {
            icon = (
              <MaterialIcons name="library-add" size={size} color={iconColor} />
            );
          } else if (route.name === 'ProfileTab') {
            icon = user.photoURL ? (
              <FastImage
                source={{uri: user.photoURL}}
                style={{
                  width: size,
                  height: size,
                  borderRadius: 100,
                  padding: focused ? 2 : 0,
                  borderWidth: focused ? 2 : 0,
                  borderColor:
                    theme === 'light' ? appColors.primary : appColors.white,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <User variant={variant} size={size} color={iconColor} />
            );
          }

          return icon;
        },
      })}>
      <Tabs.Screen name="HomeTab" component={HomeNavigator} />
      <Tabs.Screen name="SearchTab" component={SearchNavigator} />
      {/* <Tabs.Screen name="UploadTab" component={UploadNavigator} /> */}
      <Tabs.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tabs.Navigator>
  );
};

export default TabNavigator;
