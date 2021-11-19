import { getAuth, signInWithPopup, TwitterAuthProvider, useDeviceLanguage } from 'firebase/auth';

import { SignInOptions, TwitterSignInResult } from '../definitions';

export const twitterSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<TwitterSignInResult>
    = async () => {
        const provider = new TwitterAuthProvider();
        useDeviceLanguage(getAuth());
        const userCredential = await signInWithPopup(getAuth(), provider);
        const credential = TwitterAuthProvider.credentialFromResult(userCredential);
        return new TwitterSignInResult(credential.accessToken as string, credential.secret as string);
    }
