/** @format */

import React, { useEffect } from 'react';
import MainNavigator from './MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/reducers/userReducer';

const Router = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		auth().onAuthStateChanged((user) => {
			user &&
				dispatch(
					addUser({
						displayName: user.displayName
							? user.displayName
							: user.email
							? user.email.split('@')[0]
							: '',
						email: user.email ?? '',
						mota: '',
						phoneNumber: user.phoneNumber ?? '',
						photoURL: user.photoURL ?? '',
						emailVerified: user.emailVerified,
						uid: user.uid,
					})
				);
		});
	}, []);

	return (
		<NavigationContainer>
			<MainNavigator />
		</NavigationContainer>
	);
};

export default Router;
