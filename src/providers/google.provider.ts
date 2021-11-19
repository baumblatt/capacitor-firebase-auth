import { getAuth, GoogleAuthProvider, signInWithPopup, useDeviceLanguage } from 'firebase/auth';

import { GoogleSignInResult, SignInOptions } from '../definitions';

export const googleSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<GoogleSignInResult>
    = async () => {
        const provider = new GoogleAuthProvider();
        useDeviceLanguage(getAuth());
        const userCredential = await signInWithPopup(getAuth(), provider);
        const credential = GoogleAuthProvider.credentialFromResult(userCredential)
        return new GoogleSignInResult(credential.idToken as string);
    }
