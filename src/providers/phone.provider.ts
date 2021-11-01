import {
  Auth,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  useDeviceLanguage,
} from 'firebase/auth';

import { PhoneSignInResult, SignInOptions } from '../definitions';

export const phoneSignInWeb: (
  options: { providerId: string; data?: SignInOptions },
  auth: Auth
) => Promise<PhoneSignInResult> = async (options, auth) => {
  useDeviceLanguage(auth);
  const code = options.data?.verificationCode as string;
  const verifier = new RecaptchaVerifier(options.data?.container, {}, auth);
  const userCredential = await signInWithPhoneNumber(
    auth,
    options.data?.phone as string,
    verifier
  );
  const confirmation = await userCredential.confirm(code);
  const idToken = await confirmation.user?.getIdToken();
  return new PhoneSignInResult(idToken as string, code);
};
