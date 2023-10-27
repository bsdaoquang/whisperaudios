/** @format */

import { doc, setDoc } from 'firebase/firestore'
import { fs } from '../firebase/firebaseConfig'
import { appInfos } from '../constants/appInfos'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import auth from '@react-native-firebase/auth'
// import { AccessToken, LoginManager } from 'react-native-fbsdk-next'

GoogleSignin.configure({
  webClientId:
    '122728025595-dni755pvglind3b2ta26q2g5mg32c5i7.apps.googleusercontent.com',
})

export class handleAuthentication {
  static Register = async (data: { email: string; pass: string }) => {
    let result = ''

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
  }

  static GoogleSignin = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn()

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)

    // Sign-in the user with the credential
    const user = await auth()
      .signInWithCredential(googleCredential)
      .then(async (authCreatedential) => {
        const user = authCreatedential.user
        return user
      })
    if (user) {
      this.UpdateUser(user)

      return user
    }
  }
  static FacebookSignin = async () => {
    // const result = await LoginManager.logInWithPermissions([
    //   'public_profile',
    //   'email',
    // ])
    // if (result.isCancelled) {
    //   console.log('User cancelled the login process')
    // }
    // const data: any = await AccessToken.getCurrentAccessToken()
    // if (!data) {
    //   console.log('Something went wrong obtaining access token')
    // }
    // const facebookCredential = auth.FacebookAuthProvider.credential(
    //   data.accessToken,
    // )
    // // Sign-in the user with the credential
    // const user = auth().signInWithCredential(facebookCredential)
    // console.log(user)
  }

  static Login = async (data: { email: string; pass: string }) => {
    // signInWithEmailAndPassword(auth, data.email, data.pass)
    //  const user =	signInWithEmailAndPassword( data.email, data.pass)
    // 		(userCredential) => {
    // 			const user = userCredential.user;
    // 			this.UpdateUser(user);
    // 		}
    // 	);
    // } catch (error) {
    // 	console.log(`Không thể đăng nhập: ${error}`);
    // 	return 'error';
    // }
  }

  // resent email verified
  static ResentEmailVerified = async (email: string) => {
    // try {
    // 	await auth();
    // 	return 'OK';
    // } catch (error) {
    // 	return 'Error';
    // }
  }

  static LoginWithPhoneNumber = async (phone: string) => {
    // try {
    // 	const confirmation = await auth().signInWithPhoneNumber(phone);
    // 	return confirmation;
    // } catch (error) {
    // 	return error;
    // }
  }

  static UpdateUser = async (user: any) => {
    const data: any = {
      // metaData: user.metadata,
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
    }

    try {
      await setDoc(doc(fs, appInfos.databaseNames.users, user.uid), data).then(
        () => {
          console.log('User info updated')
        },
      )
    } catch (error) {
      console.log(`Không thể cập nhật thông tin user: ${error}`)
    }
  }

  // 	static Logout = async () => {
  // 		try {
  // 			await auth()
  // 				.signOut()
  // 				.then(() => {
  // 					return 'Logout';
  // 				});
  // 		} catch (error) {
  // 			return error;
  // 		}
  // 	};

  // 	static FogetPass = async (email: string) => {
  // 		try {
  // 			// Kiểm tra xem có email này hay không
  // 			const api = `${apis.users}.json?orderBy="email"&equalTo="${email}"`;
  // 			const res: any = await getData.getData(api);

  // 			if (res && res.length > 0) {
  // 				// return 'OK';
  // 				await auth()
  // 					.sendPasswordResetEmail(email)
  // 					.then(() => {
  // 						Alert.alert(
  // 							'Quên mật khẩu',
  // 							`Một email thay đổi mật khẩu đã được gửi đến ${email}, vui lòng kiểm tra và làm theo hướng dẫn để đổi mật khẩu\n\nNếu không nhận được, vui lòng kiểm tra trong hộp thư spam `,
  // 							[
  // 								{
  // 									text: 'Đến hộp thư',
  // 									onPress: () => Linking.openURL('https://mail.google.com'),
  // 								},
  // 							]
  // 						);

  // 						return 'OK';
  // 					})
  // 					.catch(() => {
  // 						return 'Error';
  // 					});
  // 			} else {
  // 				return 'Error';
  // 			}
  // 		} catch (error) {
  // 			return error;
  // 		}
  // 	};
}
