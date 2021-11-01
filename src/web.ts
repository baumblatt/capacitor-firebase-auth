import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  PhoneAuthProvider,
  Auth,
  signOut,
} from 'firebase/auth';
import { WebPlugin } from '@capacitor/core';

import {
  CapacitorFirebaseAuthPlugin,
  SignInOptions,
  SignInResult,
} from './definitions';
import { appleSignInWeb } from './providers/apple.provider';
import { facebookSignInWeb } from './providers/facebook.provider';
import { googleSignInWeb } from './providers/google.provider';
import { phoneSignInWeb } from './providers/phone.provider';
import { twitterSignInWeb } from './providers/twitter.provider';

export class CapacitorFirebaseAuthWeb
  extends WebPlugin
  implements CapacitorFirebaseAuthPlugin
{
  constructor() {
    super();
  }

  async signIn<T extends SignInResult>(
    options: {
      providerId: string;
      data?: SignInOptions;
    },
    auth: Auth
  ): Promise<T> {
    const appleProvider = 'apple.com';
    const googleProvider = new GoogleAuthProvider().providerId;
    const facebookProvider = new FacebookAuthProvider().providerId;
    const twitterProvider = new TwitterAuthProvider().providerId;
    const phoneProvider = new PhoneAuthProvider(auth).providerId;

    switch (options.providerId) {
      case appleProvider:
        return appleSignInWeb(options, auth) as any;
      case googleProvider:
        return googleSignInWeb(options, auth) as any;
      case twitterProvider:
        return twitterSignInWeb(options, auth) as any;
      case facebookProvider:
        return facebookSignInWeb(options, auth) as any;
      case phoneProvider:
        return phoneSignInWeb(options, auth) as any;
    }

    return Promise.reject(
      `The '${options.providerId}' provider was not supported`
    );
  }

  async signOut(options: {}, auth: Auth): Promise<void> {
    console.log(options);
    return signOut(auth);
  }
}
