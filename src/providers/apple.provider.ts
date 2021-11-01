import { Auth, OAuthProvider, signInWithPopup, useDeviceLanguage } from 'firebase/auth';
import { AppleSignInResult, SignInOptions } from '../definitions';

export const appleSignInWeb: (options: { providerId: string, data?: SignInOptions },auth:Auth) => Promise<AppleSignInResult>
    = async (options: { providerId: string, data?: SignInOptions },auth:Auth) => {
        const provider = new OAuthProvider('apple.com');
        useDeviceLanguage(auth);
        const userCredential = await signInWithPopup(auth,provider);
        const credential = OAuthProvider.credentialFromResult(userCredential);
        return new AppleSignInResult(await userCredential.user.getIdToken(), '', credential.accessToken as string, credential.secret ?? "");
    }
