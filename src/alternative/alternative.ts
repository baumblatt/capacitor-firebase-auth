import {Plugins} from '@capacitor/core';
import {Observable, throwError} from 'rxjs';

import 'firebase/auth';
import * as firebase from 'firebase/app';
import {
	CapacitorFirebaseAuthPlugin,
	FacebookSignInResult,
	GoogleSignInResult,
	PhoneSignInResult,
	SignInOptions, SignInResult,
	TwitterSignInResult
} from '../definitions';

// @ts-ignore
const plugin: CapacitorFirebaseAuthPlugin = Plugins.CapacitorFirebaseAuth;

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (providerId: string, data?: SignInOptions): Observable<{userCredential: firebase.auth.UserCredential, result: SignInResult}> => {
	const googleProvider = new firebase.auth.GoogleAuthProvider().providerId;
	const facebookProvider = new firebase.auth.FacebookAuthProvider().providerId;
	const twitterProvider = new firebase.auth.TwitterAuthProvider().providerId;
	const phoneProvider = new firebase.auth.PhoneAuthProvider().providerId;
	switch (providerId) {
		case googleProvider:
			return cfaSignInGoogle();
		case twitterProvider:
			return cfaSignInTwitter();
		case facebookProvider:
			return cfaSignInFacebook();
		case phoneProvider:
			return cfaSignInPhone(data.phone, data.verificationCode);
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

/**
 * Call the Google sign in method on native layer and sign in on web layer, exposing the entire native result
 * for use Facebook API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: GoogleSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInGoogle = (): Observable<{userCredential: firebase.auth.UserCredential, result: GoogleSignInResult}> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({providerId}).then((result: GoogleSignInResult) => {
			// create the credentials
			const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next({userCredential, result});
					observer.complete();
				})
				.catch((reject: any) => {
					observer.error(reject);
				});
		}).catch(reject => {
			observer.error(reject);
		});
	});
};

/**
 * Call the Facebook sign in method on native and sign in on web layer, exposing the entire native result
 * for use Facebook API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: FacebookSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInFacebook = (): Observable<{userCredential: firebase.auth.UserCredential, result: FacebookSignInResult}> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({providerId}).then((result: FacebookSignInResult) => {
			// create the credentials
			const credential = firebase.auth.FacebookAuthProvider.credential(result.idToken);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next({userCredential, result});
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

/**
 * Call the Twitter sign in method on native and sign in on web layer, exposing the entire native result
 * for use Twitter User API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: TwitterSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInTwitter = (): Observable<{userCredential: firebase.auth.UserCredential, result: TwitterSignInResult}> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({providerId}).then((result :TwitterSignInResult) => {
			// create the credentials
			const credential = firebase.auth.TwitterAuthProvider.credential(result.idToken, result.secret);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next({userCredential ,result});
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * This implementation is just to keep everything in compliance if others providers in this alternative calls.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (phone: string, verificationCode?: string) : Observable<{userCredential: firebase.auth.UserCredential, result: PhoneSignInResult}>  => {
	return new Observable(observer => {
		// get the provider id
		const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;

		plugin.signIn({providerId, data:{phone, verificationCode}}).then((result: PhoneSignInResult) => {
			// if there is no verification code
			if (!result.verificationCode) {
				return observer.complete();
			}

			// create the credentials
			const credential = firebase.auth.PhoneAuthProvider.credential(result.verificationId, result.verificationCode);

			// web sign in
			firebase.app().auth().signInWithCredential(credential)
				.then((userCredential: firebase.auth.UserCredential) => {
					observer.next({userCredential, result});
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));

	});
};

// re-exporting the unchanged functions from facades for simple imports.
export {cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent, cfaSignOut} from '../facades'
