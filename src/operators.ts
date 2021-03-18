import firebase from 'firebase/app';
import { Observable, pipe, UnaryFunction } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Operator to map firebase.User to firebase.UserInfo.
 *
 * Sample of use:
 *
 * ```ts
 * import {cfaSignIn, mapUserToUserInfo} from 'capacitor-firebase-auth';
 * import {UserInfo} from 'firebase/app';
 *
 * cfaSignIn('google.com').pipe(
 *     mapUserToUserInfo(),
 * ).subscribe(
 *     (user: UserInfo) => console.log(user.displayName);
 * )
 * ```
 */
export const mapUserToUserInfo = (): UnaryFunction<Observable<firebase.User>, Observable<firebase.UserInfo>> =>
	pipe(map((user: firebase.User) => {
		if (user) {
			const { uid, providerId, displayName, photoURL, phoneNumber, email } = user;
			return { uid, providerId, displayName, photoURL, phoneNumber, email };
		}
		return user;
	}));

/**
 * Operator to map firebase.auth.UserCredential to firebase.UserInfo.
 *
 * For use with alternative facade only.
 *
 * Sample of use:
 *
 * ```ts
 * import {cfaSignIn, mapUserToUserInfo} from 'capacitor-firebase-auth/alternative';
 * import {UserInfo} from 'firebase/app';
 *
 * cfaSignIn('google.com').pipe(
 *     mapUserToUserInfo(),
 * ).subscribe(
 *     (user: UserInfo) => console.log(user.displayName);
 * )
 * ```
 */
export const mapUserCredentialToUserInfo = (): UnaryFunction<Observable<{ userCredential: firebase.auth.UserCredential }>, Observable<firebase.UserInfo | null>> =>
	pipe(map(({ userCredential }: { userCredential: firebase.auth.UserCredential }) => {
		if (userCredential?.user) {
			const { uid, providerId, displayName, photoURL, phoneNumber, email } = userCredential.user;
			return { uid, providerId, displayName, photoURL, phoneNumber, email };
		}
		return null;
	}));
