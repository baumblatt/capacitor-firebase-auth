import {Plugins} from '@capacitor/core';
import {app, auth, User} from 'firebase/app';
import {Observable, throwError} from 'rxjs';
import {CapacitorFirebaseAuthPlugin, FacebookSignInResult, GoogleSignInResult, PhoneSignInResult, SignInOptions, TwitterSignInResult} from './definitions';

const plugin: CapacitorFirebaseAuthPlugin = Plugins.CapacitorFirebaseAuth;

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (providerId: string, data?: SignInOptions): Observable<User> => {
	switch (providerId) {
		case auth.GoogleAuthProvider.PROVIDER_ID:
			return cfaSignInGoogle();
		case auth.TwitterAuthProvider.PROVIDER_ID:
			return cfaSignInTwitter();
		case auth.FacebookAuthProvider.PROVIDER_ID:
			return cfaSignInFacebook();
		case auth.PhoneAuthProvider.PROVIDER_ID:
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
		const providerId = auth.GoogleAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({providerId}).then((result: GoogleSignInResult) => {
			// create the credentials
			const credential = auth.GoogleAuthProvider.credential(result.idToken);

			// web sign in
			app().auth().signInAndRetrieveDataWithCredential(credential)
				.then((userCredential: auth.UserCredential) => {
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch(reject => {
					observer.error(reject);
				});
		}).catch(reject => {
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
		const providerId = auth.TwitterAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({providerId}).then((result :TwitterSignInResult) => {
			// create the credentials
			const credential = auth.TwitterAuthProvider.credential(result.idToken, result.secret);

			// web sign in
			app().auth().signInAndRetrieveDataWithCredential(credential)
				.then((userCredential: auth.UserCredential) => {
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch(reject => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

/**
 * Call the Facebook sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInFacebook = (): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.FacebookAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({providerId}).then((result: FacebookSignInResult) => {
			// create the credentials
			const credential = auth.FacebookAuthProvider.credential(result.idToken);

			// web sign in
			app().auth().signInAndRetrieveDataWithCredential(credential)
				.then((userCredential: auth.UserCredential) => {
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch(reject => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (phone: string, verificationCode?: string) : Observable<User>  => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.PhoneAuthProvider.PROVIDER_ID;

		plugin.signIn({providerId, data:{phone, verificationCode}}).then((result: PhoneSignInResult) => {
			// create the credentials
			const credential = auth.PhoneAuthProvider.credential(result.verificationId, result.verificationCode);

			// web sign in
			app().auth().signInAndRetrieveDataWithCredential(credential)
				.then((userCredential: auth.UserCredential) => {
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch(reject => observer.error(reject));

		}).catch(reject => observer.error(reject));

	});
};

/**
 * Observable of one notification of <code>On Code Sent</code>event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeSent = () : Observable<string> => {
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
export const cfaSignInPhoneOnCodeReceived = () : Observable<{verificationId: string, verificationCode: string}> => {
	return new Observable<{verificationId: string, verificationCode: string}>(observer => {
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
			// web sign in
			app().auth().signOut()
				.then(() => {
					observer.next();
					observer.complete();
				})
				.catch(reject => observer.error(reject));
		});
	});
};
