import { of, pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
export const mapUserToUserInfo = () => pipe(switchMap((user) => {
    if (user) {
        const { uid, providerId, displayName, photoURL, phoneNumber, email } = user;
        return of({ uid, providerId, displayName, photoURL, phoneNumber, email });
    }
    return of(user);
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
export const mapUserCredentialToUserInfo = () => pipe(switchMap(({ userCredential }) => {
    if (!!userCredential) {
        const { uid, providerId, displayName, photoURL, phoneNumber, email } = userCredential.user;
        return of({ uid, providerId, displayName, photoURL, phoneNumber, email });
    }
    return of(null);
}));
//# sourceMappingURL=operators.js.map