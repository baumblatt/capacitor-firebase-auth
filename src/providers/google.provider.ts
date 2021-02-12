import 'firebase/auth';

import firebase from 'firebase/app';

import { GoogleSignInResult, SignInOptions } from '../definitions';

import OAuthCredential = firebase.auth.OAuthCredential;

export const googleSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<GoogleSignInResult>
    = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().useDeviceLanguage();
        const userCredential = await firebase.auth().signInWithPopup(provider);
        const credential = userCredential?.credential as OAuthCredential;
        return new GoogleSignInResult(credential.idToken as string);
    }
