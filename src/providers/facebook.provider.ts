import { Auth, FacebookAuthProvider, OAuthProvider, signInWithPopup, useDeviceLanguage } from 'firebase/auth';
import { FacebookSignInResult, SignInOptions } from '../definitions';


export const facebookSignInWeb: (options: { providerId: string, data?: SignInOptions },auth:Auth) => Promise<FacebookSignInResult>
    = async (options: { providerId: string, data?: SignInOptions },auth:Auth) => {
        const provider = new FacebookAuthProvider();
        useDeviceLanguage(auth);
        const userCredential = await signInWithPopup(auth,provider);
        const credential = OAuthProvider.credentialFromResult(userCredential);
        return new FacebookSignInResult(credential?.accessToken as string);
    }
