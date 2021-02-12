import 'firebase/auth';

import firebase from 'firebase/app';

import { AppleSignInResult, SignInOptions } from '../definitions';

import OAuthCredential = firebase.auth.OAuthCredential;

export const appleSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<AppleSignInResult>
    = async () => {
        const provider = new firebase.auth.OAuthProvider('apple.com');
        firebase.auth().useDeviceLanguage();
        const userCredential = await firebase.auth().signInWithPopup(provider);
        const credential = userCredential?.credential as OAuthCredential;
        return new AppleSignInResult(credential.idToken as string, '', credential.accessToken as string, credential.secret ?? "");
    }
