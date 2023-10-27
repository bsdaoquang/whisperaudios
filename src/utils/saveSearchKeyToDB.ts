/** @format */

import {
	addDoc,
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
} from 'firebase/firestore';
import { appInfos } from '../constants/appInfos';
import { fs } from '../firebase/firebaseConfig';

export const saveSearchKeyToDatabase = async (
	keysearch: string,
	uid: string | undefined
) => {
	const filter = query(collection(fs, appInfos.databaseNames.searchs));
	await getDocs(filter).then(async (snap) => {
		if (snap.empty) {
			const data = {
				by: uid ?? '',
				value: keysearch,
				count: 1,
			};

			addDoc(collection(fs, appInfos.databaseNames.searchs), data);
		} else {
			snap.forEach(async (item: any) => {
				const data = {
					...item.data(),
					count: item.data().count + 1,
				};
				updateDoc(
					doc(fs, `${appInfos.databaseNames.searchs}/${item.id}`),
					data
				);
			});
		}
	});
};
