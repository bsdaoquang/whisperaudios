/** @format */

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import {appInfos} from '../constants/appInfos';
import {addUser} from '../redux/reducers/userReducer';

export class handleAuthentication {
  static Register = async (data: {email: string; pass: string}) => {
    // let result = '';
    // await auth()
    // 	.createUserWithEmailAndPassword(data.email, data.pass)
    // 	.then((userCredentical) => {
    // 		const user = userCredentical.user;
    // 		this.UpdateUser(user);
    // 		result = 'OK';
    // 	})
    // 	.catch((error) => {
    // 		console.log(error);
    // 		if (error.code === 'auth/email-already-in-use') {
    // 			result = 'Email đã được sử dụng';
    // 		}
    // 		if (error.code === 'auth/invalid-email') {
    // 			result = 'Địa chỉ email không tồn tại';
    // 		}
    // 	});
    // return result;
  };

  static GoogleSignin = async (dispatch: any) => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const user = await auth()
      .signInWithCredential(googleCredential)
      .then(async authCreatedential => {
        const user = authCreatedential.user;
        return user;
      })
      .catch(error => console.log(error));
    if (user) {
      this.UpdateUser(user, dispatch);

      return user;
    }
  };
  static FacebookSignin = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    // if (result.isCancelled) {
    //   console.log('User cancelled the login process');
    // }
    // const data: any = await AccessToken.getCurrentAccessToken();
    // if (!data) {
    //   console.log('Something went wrong obtaining access token');
    // }
    // const facebookCredential = auth.FacebookAuthProvider.credential(
    //   data.accessToken,
    // );

    // // Sign-in the user with the credential
    // const user = auth().signInWithCredential(facebookCredential);
    // this.UpdateUser(user);
  };

  static Login = async (data: {email: string; pass: string}, dispatch: any) => {
    await auth()
      .signInWithEmailAndPassword(data.email, data.pass)
      .then(userCredential => {
        const user = userCredential.user;
        this.UpdateUser(user, dispatch);
        return user;
      })
      .catch(error => {
        console.log('Can not login', error);
        return 'error';
      });
  };

  // resent email verified
  static ResentEmailVerified = async (email: string) => {
    // try {
    // 	await auth();
    // 	return 'OK';
    // } catch (error) {
    // 	return 'Error';
    // }
  };

  static LoginWithPhoneNumber = async (phone: string) => {
    // try {
    // 	const confirmation = await auth().signInWithPhoneNumber(phone);
    // 	return confirmation;
    // } catch (error) {
    // 	return error;
    // }
  };

  static UpdateUser = async (user: any, dispatch?: any) => {
    const data: any = {
      // metaData: user.metadata,
      displayName: user.displayName
        ? user.displayName
        : user.email
        ? user.email.split('@')[0]
        : '',
      email: user.email ?? '',
      mota: '',
      uid: user.uid,
      photoURL: user.photoURL ?? '',
      emailVerified: user.emailVerified,
    };

    await AsyncStorage.setItem(appInfos.localNames.uid, user.uid);
    dispatch && dispatch(addUser(data));

    try {
      await firestore()
        .collection(appInfos.databaseNames.users)
        .doc(user.uid)
        .set(data)
        .then(() => {
          console.log('User info updated');
        });
    } catch (error) {
      console.log(`Không thể cập nhật thông tin user: ${error}`);
    }
  };
}
