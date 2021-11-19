import { getAuth, OAuthProvider, signInWithPopup, useDeviceLanguage } from 'firebase/auth';
import { AppleSignInResult, SignInOptions } from '../definitions';

export const appleSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<AppleSignInResult>
    = async () => {
        const provider = new OAuthProvider('apple.com');
        useDeviceLanguage(getAuth());
       // const userCredential = await signInWithPopup(getAuth(), provider);
        //const credential = userCredential?.credential as OAuthCredential;
        const result = await signInWithPopup(getAuth(), provider);
        const credential = OAuthProvider.credentialFromResult(result);
        return new AppleSignInResult(credential.idToken as string, '', credential.accessToken as string, credential.secret ?? "");
    }
