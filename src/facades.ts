import {registerPlugin} from '@capacitor/core';
import { 
	FacebookAuthProvider, getAuth, GoogleAuthProvider, OAuthProvider, PhoneAuthProvider, 
	signInWithCredential, signOut, TwitterAuthProvider, User, UserCredential 
} from 'firebase/auth';

import { Observable, throwError } from 'rxjs';

import {
  AppleSignInResult, CapacitorFirebaseAuthPlugin, FacebookSignInResult, GoogleSignInResult,
  PhoneSignInResult, SignInOptions, TwitterSignInResult
} from './definitions';

export const CapacitorFirebaseAuth = registerPlugin<CapacitorFirebaseAuthPlugin>('CapacitorFirebaseAuth', {
    web: () => import('./web').then(m => new m.CapacitorFirebaseAuthWeb()),
});
const plugin: CapacitorFirebaseAuthPlugin = CapacitorFirebaseAuth;

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (providerId: string, data?: SignInOptions): Observable<User> => {
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
			if (!data) {
				throw new Error('Phone and Verification data must be provided.')
			}
			return cfaSignInPhone(data.phone, data.verificationCode);
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

/**
 * Call the Google sign in method on native layer and sign in on web layer with retrieved credentials.
 */
export const cfaSignInGoogle = (): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = GoogleAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn<GoogleSignInResult>({ providerId }).then((result: GoogleSignInResult) => {
			// create the credentials
			const credential = GoogleAuthProvider.credential(result.idToken);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => {
					observer.error(reject);
				});
		}).catch((reject: any) => {
			observer.error(reject);
		});
	});
};

/**
 * Call the Twitter sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInTwitter = (): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = TwitterAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn<TwitterSignInResult>({ providerId }).then((result: TwitterSignInResult) => {
			// create the credentials
			const credential = TwitterAuthProvider.credential(result.idToken, result.secret);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch((reject: any) => observer.error(reject));
	});
};

/**
 * Call the Facebook sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInFacebook = (): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = FacebookAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn<FacebookSignInResult>({ providerId }).then((result: FacebookSignInResult) => {
			// create the credentials
			const credential = FacebookAuthProvider.credential(result.idToken);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch((reject: any) => observer.error(reject));
	});
};

export const cfaSignInAppleProvider = 'apple.com';

/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInApple = (): Observable<User> => {
	return new Observable(observer => {
		// native sign in
		plugin.signIn<AppleSignInResult>({ providerId: cfaSignInAppleProvider }).then((result: AppleSignInResult) => {
			const { idToken, rawNonce } = result;

			const provider = new OAuthProvider('apple.com');
			provider.addScope('email');
			provider.addScope('name');

			const credential = provider.credential({ idToken, rawNonce })

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));
		}).catch((reject: any) => observer.error(reject));
	});
}

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (phone: string, verificationCode?: string): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = PhoneAuthProvider.PROVIDER_ID;

		plugin.signIn<PhoneSignInResult>({ providerId, data: { phone, verificationCode } }).then((result: PhoneSignInResult) => {
			// if there is no verification code
			if (!result.verificationCode) {
				return observer.complete();
			}

			// create the credentials
			const credential = PhoneAuthProvider.credential(result.verificationId, result.verificationCode);

			// web sign in
			signInWithCredential(getAuth(), credential)
				.then((userCredential: UserCredential) => {
					if(!userCredential.user) {
						throw new Error('Firebase User was not received.')
					}
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));

		}).catch((reject: any) => observer.error(reject));

	});
};

/**
 * Observable of one notification of <code>On Code Sent</code>event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeSent = (): Observable<string> => {
	return new Observable<string>(observer => {
		// @ts-ignore
		return plugin.addListener('cfaSignInPhoneOnCodeSent', (event: { verificationId: string }) => {
			observer.next(event.verificationId);
			observer.complete();
		});
	});
};

/**
 * Observable of one notification of <code>On Code Received</code> event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeReceived = (): Observable<{ verificationId: string, verificationCode: string }> => {
	return new Observable<{ verificationId: string, verificationCode: string }>(observer => {
		// @ts-ignore
		return plugin.addListener('cfaSignInPhoneOnCodeReceived', (event: { verificationId: string, verificationCode: string }) => {
			observer.next(event);
			observer.complete();
		});
	});
};

/**
 * Call Google sign out method on native and web layers.
 */
export const cfaSignOut = (): Observable<void> => {
	return new Observable(observer => {
		plugin.signOut({}).then(() => {
			// web sign out
			signOut(getAuth())
				.then(() => {
					observer.next();
					observer.complete();
				})
				.catch((reject: any) => observer.error(reject));
		});
	});
};
