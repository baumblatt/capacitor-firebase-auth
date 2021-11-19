import { 
	FacebookAuthProvider, getAuth, GoogleAuthProvider, OAuthProvider, PhoneAuthProvider, 
	signInWithCredential, TwitterAuthProvider, UserCredential 
} from 'firebase/auth';

import { Observable, throwError } from 'rxjs';

import { CapacitorFirebaseAuth } from '../';
import {
  AppleSignInResult, FacebookSignInResult, GoogleSignInResult, PhoneSignInResult, SignInOptions,
  SignInResult, TwitterSignInResult
} from '../definitions';

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (providerId: string, data?: SignInOptions): Observable<{ userCredential: UserCredential, result: SignInResult }> => {
	const googleProvider = new GoogleAuthProvider().providerId;
	const facebookProvider = new FacebookAuthProvider().providerId;
	const twitterProvider = new TwitterAuthProvider().providerId;
	const phoneProvider = new PhoneAuthProvider(getAuth()).providerId;
	switch (providerId) {
		case googleProvider:
			return cfaSignInGoogle();
		case twitterProvider:
			return cfaSignInTwitter();
		case facebookProvider:
			return cfaSignInFacebook();
		case cfaSignInAppleProvider:
			return cfaSignInApple();
		case phoneProvider:
			return cfaSignInPhone(data?.phone as string, data?.verificationCode as string);
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

/**
 * Call the Google sign in method on native layer and sign in on web layer, exposing the entire native result
 * for use Google API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: GoogleSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInGoogle = (): Observable<{ userCredential: UserCredential, result: GoogleSignInResult }> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = GoogleAuthProvider.PROVIDER_ID;

		// native sign in
		CapacitorFirebaseAuth.signIn<GoogleSignInResult>({ providerId }).then((result: GoogleSignInResult) => {
			// create the credentials
			const credential = GoogleAuthProvider.credential(result.idToken);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					observer.next({ userCredential, result });
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
export const cfaSignInFacebook = (): Observable<{ userCredential: UserCredential, result: FacebookSignInResult }> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = FacebookAuthProvider.PROVIDER_ID;

		// native sign in
		CapacitorFirebaseAuth.signIn<FacebookSignInResult>({ providerId }).then((result: FacebookSignInResult) => {
			// create the credentials
			const credential = FacebookAuthProvider.credential(result.idToken);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					observer.next({ userCredential, result });
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
export const cfaSignInTwitter = (): Observable<{ userCredential: UserCredential, result: TwitterSignInResult }> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = TwitterAuthProvider.PROVIDER_ID;

		// native sign in
		CapacitorFirebaseAuth.signIn<TwitterSignInResult>({ providerId }).then((result: TwitterSignInResult) => {
			// create the credentials
			const credential = TwitterAuthProvider.credential(result.idToken, result.secret);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					observer.next({ userCredential, result });
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

export const cfaSignInAppleProvider = 'apple.com';

/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInApple = (): Observable<{ userCredential: UserCredential, result: AppleSignInResult }> => {
	return new Observable(observer => {
		// native sign in
		CapacitorFirebaseAuth.signIn<AppleSignInResult>({ providerId: cfaSignInAppleProvider }).then((result: AppleSignInResult) => {

			const provider = new OAuthProvider('apple.com');
			provider.addScope('email');
			provider.addScope('name');

			const credential = provider.credential(result)

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					observer.next({ userCredential, result });
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));
		}).catch(reject => observer.error(reject));
	});
}

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * This implementation is just to keep everything in compliance if others providers in this alternative calls.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (phone: string, verificationCode?: string): Observable<{ userCredential: UserCredential, result: PhoneSignInResult }> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = PhoneAuthProvider.PROVIDER_ID;

		CapacitorFirebaseAuth.signIn<PhoneSignInResult>({ providerId, data: { phone, verificationCode } }).then((result: PhoneSignInResult) => {
			// if there is no verification code
			if (!result.verificationCode) {
				return observer.complete();
			}

			// create the credentials
			const credential = PhoneAuthProvider.credential(result.verificationId, result.verificationCode);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					observer.next({ userCredential, result });
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch(reject => observer.error(reject));

	});
};

// re-exporting the unchanged functions from facades for simple imports.
export { cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent, cfaSignOut } from '../facades'
