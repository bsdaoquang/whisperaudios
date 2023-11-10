/** @format */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, MusicSquareSearch, User} from 'iconsax-react-native';
import React from 'react';
import {useColorScheme} from 'react-native';
import {appColors} from '../constants/appColors';
import HomeNavigator from './HomeNavigator';
import ProfileNavigator from './ProfileNavigator';
import SearchNavigator from './SearchNavigator';

const TabNavigator = () => {
  const Tabs = createBottomTabNavigator();

  const theme = useColorScheme();
  const bgColor = theme === 'light' ? appColors.light : appColors.dark;

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
          } else if (route.name === 'ProfileTab') {
            icon = <User variant={variant} size={size} color={iconColor} />;
          }

          return icon;
        },
      })}>
      <Tabs.Screen name="HomeTab" component={HomeNavigator} />
      <Tabs.Screen name="SearchTab" component={SearchNavigator} />
      <Tabs.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tabs.Navigator>
  );
};

export default TabNavigator;
