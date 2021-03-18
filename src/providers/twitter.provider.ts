import 'firebase/auth';

import firebase from 'firebase/app';

import { SignInOptions, TwitterSignInResult } from '../definitions';

import OAuthCredential = firebase.auth.OAuthCredential;

export const twitterSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<TwitterSignInResult>
    = async () => {
        const provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().useDeviceLanguage();
        const userCredential = await firebase.auth().signInWithPopup(provider);
        const credential = userCredential?.credential as OAuthCredential;
        return new TwitterSignInResult(credential.accessToken as string, credential.secret as string);
    }
