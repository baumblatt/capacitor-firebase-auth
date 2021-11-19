import { FacebookAuthProvider, getAuth, signInWithPopup, useDeviceLanguage } from 'firebase/auth';

import { FacebookSignInResult, SignInOptions } from '../definitions';

//mport OAuthCredential = firebase.auth.OAuthCredential;

export const facebookSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<FacebookSignInResult>
    = async () => {
        const provider = new FacebookAuthProvider();
        useDeviceLanguage(getAuth());
        const userCredential = await signInWithPopup(getAuth(), provider);
        const credential = FacebookAuthProvider.credentialFromResult(userCredential)
        return new FacebookSignInResult(credential?.accessToken as string);
    }
