/** @format */

import React from 'react';
import Container from '../../components/Container';
import LatestBooks from '../../components/LatestBooks';
import { RowComponent } from '../../components/RowComponent';
import TitleComponent from '../../components/TitleComponent';
import TopAuthorBooks from '../../components/TopAuthorBooks';
import TopRatingBooks from '../../components/TopRatingBooks';
import Categories from './components/Categories';
import TopLikedSwiper from './components/TopLikedSwiper';
import { useSelector } from 'react-redux';
import { userSelector } from '../../redux/reducers/userReducer';
import { Image, TouchableOpacity } from 'react-native';
import ListeningComponent from '../../components/ListeningComponent';

const HomeScreen = ({ navigation }: any) => {
	const user = useSelector(userSelector);

	return (
		<Container scroll>
			<RowComponent
				styles={{
					padding: 16,
					justifyContent: 'space-between',
				}}>
				<TitleComponent text='Whisper Audios' size={22} />
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('ProfileTab', { screen: 'HomeAuth' })
					}>
					<Image
						source={
							user.photoURL
								? { uri: user.photoURL }
								: require('../../../assets/images/default-avatar.webp')
						}
						style={{
							width: 40,
							height: 40,
							borderRadius: 100,
							resizeMode: 'cover',
						}}
					/>
				</TouchableOpacity>
			</RowComponent>
			<Categories />
			<TopLikedSwiper />
			<ListeningComponent />
			<LatestBooks />
			<TopAuthorBooks />
			<TopRatingBooks />
		</Container>
	);
};

export default HomeScreen;
