import {Plugins} from '@capacitor/core';
import {app, auth, User} from 'firebase/app';
import {Observable, throwError} from 'rxjs';
import {CapacitorFirebaseAuthPlugin} from './definitions';

const plugin: CapacitorFirebaseAuthPlugin = Plugins.CapacitorFirebaseAuth;

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param name The Firebase application name (optional)
 */
export const cfaSignIn = (providerId: string, name?: string): Observable<User> => {
	switch (providerId) {
		case auth.GoogleAuthProvider.PROVIDER_ID:
			return cfaSignInGoogle(name);
		case auth.TwitterAuthProvider.PROVIDER_ID:
			return cfaSignInTwitter(name);
		case auth.FacebookAuthProvider.PROVIDER_ID:
			return cfaSignInFacebook(name);
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

/**
 * Call the Google sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param name The Firebase application name (optional)
 */
export const cfaSignInGoogle = (name?: string): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.GoogleAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({provider: {providerId}}).then((result) => {
			// create the credentials
			const credential = auth.GoogleAuthProvider.credential(result.idToken);

			// web sign in
			app(name).auth().signInAndRetrieveDataWithCredential(credential)
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
 * @param name The Firebase application name (optional)
 */
export const cfaSignInTwitter = (name?: string): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.TwitterAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({provider: {providerId}}).then((result) => {
			// create the credentials
			const credential = auth.TwitterAuthProvider.credential(result.idToken, result.secret);

			// web sign in
			app(name).auth().signInAndRetrieveDataWithCredential(credential)
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
 * @param name The Firebase application name (optional)
 */
export const cfaSignInFacebook = (name?: string): Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.FacebookAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({provider: {providerId}}).then((result) => {
			// create the credentials
			const credential = auth.FacebookAuthProvider.credential(result.idToken);

			// web sign in
			app(name).auth().signInAndRetrieveDataWithCredential(credential)
				.then((userCredential: auth.UserCredential) => {
					observer.next(userCredential.user);
					observer.complete();
				})
				.catch(reject => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};

/**
 * Call Google sign out method on native and web layers.
 * @param name The Firebase application name (optional)
 */
export const cfaSignOut = (name?: string): Observable<void> => {
	return new Observable(observer => {
		plugin.signOut( {name}).then(() => {
			// web sign in
			app(name).auth().signOut()
				.then(() => {
					observer.next();
					observer.complete();
				})
				.catch(reject => observer.error(reject));
		});
	});
};
