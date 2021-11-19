import { getAuth, signInWithPhoneNumber, useDeviceLanguage } from '@firebase/auth';
import { RecaptchaVerifier } from 'firebase/auth';
import { PhoneSignInResult, SignInOptions } from '../definitions';

export const phoneSignInWeb: (options: { providerId: string, data?: SignInOptions }) => Promise<PhoneSignInResult>
    = async (options) => {
        useDeviceLanguage(getAuth());
        const code = options.data?.verificationCode as string;
        const verifier = new RecaptchaVerifier(options.data?.container, null, getAuth());
        const userCredential = await signInWithPhoneNumber(getAuth(), options.data?.phone as string, verifier);
        const confirmation = await userCredential.confirm(code);
        const idToken = await confirmation.user?.getIdToken()
        return new PhoneSignInResult(idToken as string, code);
    }
