import firebase from 'firebase/app';
import 'firebase/auth';
import {GoogleSignInResult, SignInOptions} from '../definitions';
import OAuthCredential = firebase.auth.OAuthCredential;

export const googleSignInWeb: (options: {providerId: string, data?: SignInOptions}) => Promise<GoogleSignInResult>
    = async () => {
        try {

            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().useDeviceLanguage();

            const userCredential = await firebase.auth().signInWithPopup(provider);

            const {credential}: { credential: OAuthCredential } = userCredential;
            return new GoogleSignInResult(credential.idToken);

        } catch (e) {
            return Promise.reject(e);
        }
    }
