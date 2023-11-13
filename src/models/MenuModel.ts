import {ReactNode} from 'react';

export interface MenuModel {
  key: string;
  title: string;
  icon?: ReactNode;
  onPress?: () => void;
}
