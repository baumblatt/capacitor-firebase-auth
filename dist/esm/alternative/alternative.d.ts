import { Observable } from 'rxjs';
import 'firebase/auth';
import * as firebase from 'firebase/app';
import { FacebookSignInResult, GoogleSignInResult, PhoneSignInResult, SignInOptions, SignInResult, TwitterSignInResult } from '../definitions';
/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export declare const cfaSignIn: (providerId: string, data?: SignInOptions) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: SignInResult;
}>;
/**
 * Call the Google sign in method on native layer and sign in on web layer, exposing the entire native result
 * for use Facebook API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: GoogleSignInResult}}>
 * @See Issue #23.
 */
export declare const cfaSignInGoogle: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: GoogleSignInResult;
}>;
/**
 * Call the Facebook sign in method on native and sign in on web layer, exposing the entire native result
 * for use Facebook API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: FacebookSignInResult}}>
 * @See Issue #23.
 */
export declare const cfaSignInFacebook: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: FacebookSignInResult;
}>;
/**
 * Call the Twitter sign in method on native and sign in on web layer, exposing the entire native result
 * for use Twitter User API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: TwitterSignInResult}}>
 * @See Issue #23.
 */
export declare const cfaSignInTwitter: () => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: TwitterSignInResult;
}>;
/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * This implementation is just to keep everything in compliance if others providers in this alternative calls.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export declare const cfaSignInPhone: (phone: string, verificationCode?: string) => Observable<{
    userCredential: firebase.auth.UserCredential;
    result: PhoneSignInResult;
}>;
export { cfaSignInPhoneOnCodeReceived, cfaSignInPhoneOnCodeSent, cfaSignOut } from '../facades';
