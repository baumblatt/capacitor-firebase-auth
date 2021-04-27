import {registerWebPlugin, WebPlugin} from '@capacitor/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import {CapacitorFirebaseAuthPlugin, SignInResult} from './definitions';
import {facebookSignInWeb} from './providers/facebook.provider';
import {googleSignInWeb} from './providers/google.provider';
import {phoneSignInWeb} from './providers/phone.provider';
import {twitterSignInWeb} from './providers/twitter.provider';

export class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
  constructor() {
    super({
      name: 'CapacitorFirebaseAuth',
      platforms: ['web']
    });
  }

  async signIn(options: {providerId: string;}): Promise<SignInResult> {
      const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
      const facebookProvider = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
      const twitterProvider = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
      const phoneProvider = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
      switch (options.providerId) {
          case googleProvider:
              return googleSignInWeb(options);
          case twitterProvider:
              return twitterSignInWeb(options);
          case facebookProvider:
              return facebookSignInWeb(options);
          case phoneProvider:
              return phoneSignInWeb(options);
      }

	  return Promise.reject(`The '${options.providerId}' provider was not supported`);
  }

  async signOut(options: {}): Promise<void> {
      console.log(options);
      return firebase.auth().signOut()
  }
}

const CapacitorFirebaseAuth = new CapacitorFirebaseAuthWeb();
export { CapacitorFirebaseAuth };

// Register as a web plugin
registerWebPlugin(CapacitorFirebaseAuth);
