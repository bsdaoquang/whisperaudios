/** @format */

import {StyleSheet} from 'react-native';
import {appColors} from '../constants/appColors';
import {fontFamilies} from '../constants/fontFamilies';

export const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: appColors.light,
    flex: 1,
  },
  text: {
    fontFamily: fontFamilies.regular,
    color: appColors.dark,
    fontSize: 14,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderColor: appColors.dark1,
    borderRadius: 100,
    marginHorizontal: 8,
  },
  card: {
    shadowColor: 'rgba(0,0,0,0.4)',
    backgroundColor: appColors.white,
  },
});
