import { pipe } from 'rxjs';
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
export const mapUserToUserInfo = () => pipe(map((user) => {
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
export const mapUserCredentialToUserInfo = () => pipe(map(({ userCredential }) => {
    if (userCredential === null || userCredential === void 0 ? void 0 : userCredential.user) {
        const { uid, providerId, displayName, photoURL, phoneNumber, email } = userCredential.user;
        return { uid, providerId, displayName, photoURL, phoneNumber, email };
    }
    return null;
}));
//# sourceMappingURL=operators.js.map