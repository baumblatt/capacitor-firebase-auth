import {Plugins} from '@capacitor/core';
import {app, auth, User} from 'firebase/app';
import {Observable, throwError} from 'rxjs';
import {CapacitorFirebaseAuthPlugin} from './definitions';

const plugin: CapacitorFirebaseAuthPlugin = Plugins.CapacitorFirebaseAuth;

export const cfaSignIn = (name: string, providerId: string): Observable<User> => {
	switch (providerId) {
		case auth.GoogleAuthProvider.PROVIDER_ID:
			return cfaSignInGoogle(name);
		case auth.TwitterAuthProvider.PROVIDER_ID:
			return cfaSignInTwitter(name);
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

export const cfaSignInGoogle = (name: string) : Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.GoogleAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({provider: {providerId}}).then((result) => {
			// create the credentials
			const credential = auth.GoogleAuthProvider.credential(result.idToken);

			// web sign in
			app(name).auth().signInWithCredential(credential)
				.then(user => observer.next(user))
				.catch(reject => {
					console.log('Web Sign In Error', reject);
					observer.error(reject);
				});
		}).catch(reject => {
			console.log('Native Sign In Error', reject);
			observer.error(reject);
		});
	});
};

export const cfaSignInTwitter = (name: string) : Observable<User> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.TwitterAuthProvider.PROVIDER_ID;

		// native sign in
		plugin.signIn({provider: {providerId}}).then((result) => {
			// create the credentials
			const credential = auth.TwitterAuthProvider.credential(result.idToken, result.secret);

			// web sign in
			app(name).auth().signInWithCredential(credential)
				.then(user => observer.next(user))
				.catch(reject => observer.error(reject));

		}).catch(reject => observer.error(reject));
	});
};


export const cfaSignOut = (name: string, providerId: string) : Observable<void> => {
	switch (providerId) {
		case auth.GoogleAuthProvider.PROVIDER_ID:
			return cfaSignOutGoogle(name);
		case auth.TwitterAuthProvider.PROVIDER_ID:
			return cfaSignOutTwitter(name);
		default:
			return throwError(new Error(`The '${providerId}' provider was not supported`));
	}
};

export const cfaSignOutGoogle = (name: string) : Observable<void> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.GoogleAuthProvider.PROVIDER_ID;

		plugin.signOut({provider: {providerId}}).then(() => {
			// web sign in
			app(name).auth().signOut()
				.then(() => observer.complete())
				.catch(reject => observer.error(reject));
		});
	});
};

export const cfaSignOutTwitter = (name: string) : Observable<void> => {
	return new Observable(observer => {
		// get the provider id
		const providerId = auth.TwitterAuthProvider.PROVIDER_ID;

		plugin.signOut({provider: {providerId}}).then(() => {
			// web sign in
			app(name).auth().signOut()
				.then(() => observer.complete())
				.catch(reject => observer.error(reject));
		});
	});
};
