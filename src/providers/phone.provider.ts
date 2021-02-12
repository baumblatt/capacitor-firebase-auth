import firebase from 'firebase';

import { PhoneSignInResult, SignInOptions } from '../definitions';

export const phoneSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<PhoneSignInResult>
    = async (options) => {
        firebase.auth().useDeviceLanguage();
        const code = options.data?.verificationCode as string;
        const verifier = new firebase.auth.RecaptchaVerifier(options.data?.container);
        const userCredential = await firebase.auth().signInWithPhoneNumber(options.data?.phone as string, verifier);
        const confirmation = await userCredential.confirm(code);
        const idToken = await confirmation.user?.getIdToken()
        return new PhoneSignInResult(idToken as string, code);
    }
