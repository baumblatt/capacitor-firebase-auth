import { Observable, throwError } from 'rxjs';

import { CapacitorFirebaseAuth } from '../';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  PhoneAuthProvider,
  TwitterAuthProvider,
  Auth,
  UserCredential,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import {
  AppleSignInResult,
  FacebookSignInResult,
  GoogleSignInResult,
  PhoneSignInResult,
  SignInOptions,
  SignInResult,
  TwitterSignInResult,
} from '../definitions';

/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (
  providerId: string,
  data?: SignInOptions,
  auth?: Auth
): Observable<{
  userCredential: UserCredential;
  result: SignInResult;
}> => {
  const googleProvider = GoogleAuthProvider.PROVIDER_ID;
  const facebookProvider = FacebookAuthProvider.PROVIDER_ID;
  const twitterProvider = TwitterAuthProvider.PROVIDER_ID;
  const phoneProvider = PhoneAuthProvider.PROVIDER_ID;
  switch (providerId) {
    case googleProvider:
      return cfaSignInGoogle(auth);
    case twitterProvider:
      return cfaSignInTwitter(auth);
    case facebookProvider:
      return cfaSignInFacebook(auth);
    case cfaSignInAppleProvider:
      return cfaSignInApple(auth);
    case phoneProvider:
      return cfaSignInPhone(
        data?.phone as string,
        data?.verificationCode as string,
        auth
      );
    default:
      return throwError(
        new Error(`The '${providerId}' provider was not supported`)
      );
  }
};

/**
 * Call the Google sign in method on native layer and sign in on web layer, exposing the entire native result
 * for use Google API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: GoogleSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInGoogle = (
  auth: Auth
): Observable<{
  userCredential: UserCredential;
  result: GoogleSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = GoogleAuthProvider.PROVIDER_ID;

    // native sign in
    CapacitorFirebaseAuth.signIn<GoogleSignInResult>({ providerId }, auth)
      .then((result: GoogleSignInResult) => {
        // create the credentials
        const credential = GoogleAuthProvider.credential(
          result.idToken
        );

        // web sign in
        signInWithCredential(auth,credential)
          .then((userCredential: UserCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => {
            observer.error(reject);
          });
      })
      .catch((reject) => {
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
export const cfaSignInFacebook = (
  auth: Auth
): Observable<{
  userCredential: UserCredential;
  result: FacebookSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = FacebookAuthProvider.PROVIDER_ID;

    // native sign in
    CapacitorFirebaseAuth.signIn<FacebookSignInResult>({ providerId }, auth)
      .then((result: FacebookSignInResult) => {
        // create the credentials
        const credential = FacebookAuthProvider.credential(result.idToken);

        // web sign in
        signInWithCredential(auth, credential)
          .then((userCredential: UserCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

/**
 * Call the Twitter sign in method on native and sign in on web layer, exposing the entire native result
 * for use Twitter User API with "user auth" authentication and the entire user credential from Firebase.
 * @return Observable<{user: firebase.User, result: TwitterSignInResult}}>
 * @See Issue #23.
 */
export const cfaSignInTwitter = (
  auth: Auth
): Observable<{
  userCredential: UserCredential;
  result: TwitterSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = TwitterAuthProvider.PROVIDER_ID;

    // native sign in
    CapacitorFirebaseAuth.signIn<TwitterSignInResult>({ providerId }, auth)
      .then((result: TwitterSignInResult) => {
        // create the credentials
        const credential = TwitterAuthProvider.credential(
          result.idToken,
          result.secret
        );

        // web sign in
        signInWithCredential(auth, credential)
          .then((userCredential: UserCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

export const cfaSignInAppleProvider = 'apple.com';

/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInApple = (
  auth: Auth
): Observable<{
  userCredential: UserCredential;
  result: AppleSignInResult;
}> => {
  return new Observable((observer) => {
    // native sign in
    CapacitorFirebaseAuth.signIn<AppleSignInResult>(
      {
        providerId: cfaSignInAppleProvider,
      },
      auth
    )
      .then((result: AppleSignInResult) => {
        const provider = new OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');

        const credential = provider.credential(result);

        // web sign in
        signInWithCredential(auth, credential)
          .then((userCredential: UserCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * This implementation is just to keep everything in compliance if others providers in this alternative calls.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (
  phone: string,
  verificationCode?: string,
  auth?: Auth
): Observable<{
  userCredential: UserCredential;
  result: PhoneSignInResult;
}> => {
  return new Observable((observer) => {
    // get the provider id
    const providerId = PhoneAuthProvider.PROVIDER_ID;

    CapacitorFirebaseAuth.signIn<PhoneSignInResult>(
      {
        providerId,
        data: { phone, verificationCode },
      },
      auth
    )
      .then((result: PhoneSignInResult) => {
        // if there is no verification code
        if (!result.verificationCode) {
          return observer.complete();
        }

        // create the credentials
        const credential = PhoneAuthProvider.credential(
          result.verificationId,
          result.verificationCode
        );

        // web sign in
        signInWithCredential(auth, credential)
          .then((userCredential: UserCredential) => {
            observer.next({ userCredential, result });
            observer.complete();
          })
          .catch((reject: any) => observer.error(reject));
      })
      .catch((reject) => observer.error(reject));
  });
};

// re-exporting the unchanged functions from facades for simple imports.
export {
  cfaSignInPhoneOnCodeReceived,
  cfaSignInPhoneOnCodeSent,
  cfaSignOut,
} from '../facades';
