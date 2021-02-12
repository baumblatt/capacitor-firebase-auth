import 'firebase/auth';
import firebase from 'firebase/app';
import { WebPlugin } from '@capacitor/core';
import { appleSignInWeb } from './providers/apple.provider';
import { facebookSignInWeb } from './providers/facebook.provider';
import { googleSignInWeb } from './providers/google.provider';
import { phoneSignInWeb } from './providers/phone.provider';
import { twitterSignInWeb } from './providers/twitter.provider';
export class CapacitorFirebaseAuthWeb extends WebPlugin {
    constructor() {
        super();
    }
    async signIn(options) {
        const appleProvider = 'apple.com';
        const googleProvider = new firebase.auth.GoogleAuthProvider().providerId;
        const facebookProvider = new firebase.auth.FacebookAuthProvider().providerId;
        const twitterProvider = new firebase.auth.TwitterAuthProvider().providerId;
        const phoneProvider = new firebase.auth.PhoneAuthProvider().providerId;
        switch (options.providerId) {
            case appleProvider:
                return appleSignInWeb(options);
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
    async signOut(options) {
        console.log(options);
        return firebase.auth().signOut();
    }
}
//# sourceMappingURL=web.js.map