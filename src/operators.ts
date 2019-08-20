import {User, UserInfo} from 'firebase/app';
import {Observable, of, pipe, UnaryFunction} from 'rxjs';
import {switchMap} from 'rxjs/operators';

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
export const mapUserToUserInfo = (): UnaryFunction<Observable<User>, Observable<UserInfo>> =>
	pipe(
		switchMap((user: User) => {
			if (user) {
				const {uid, providerId, displayName, photoURL, phoneNumber, email} = user;
				return of({uid, providerId, displayName, photoURL, phoneNumber, email});
			}

			return of(user);
		}),
	);
