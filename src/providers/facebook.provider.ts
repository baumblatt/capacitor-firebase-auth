import 'firebase/auth';

import firebase from 'firebase/app';

import { FacebookSignInResult, SignInOptions } from '../definitions';

import OAuthCredential = firebase.auth.OAuthCredential;

export const facebookSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<FacebookSignInResult>
    = async () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().useDeviceLanguage();
        const userCredential = await firebase.auth().signInWithPopup(provider);
        const credential = userCredential?.credential as OAuthCredential;
        return new FacebookSignInResult(credential?.accessToken as string);
    }
