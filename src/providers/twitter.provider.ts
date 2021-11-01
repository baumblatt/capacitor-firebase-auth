import {
  TwitterAuthProvider,
  useDeviceLanguage,
  Auth,
  signInWithPopup,
  OAuthProvider,
} from 'firebase/auth';
import { SignInOptions, TwitterSignInResult } from '../definitions';

export const twitterSignInWeb: (
  options: { providerId: string; data?: SignInOptions },
  auth: Auth
) => Promise<TwitterSignInResult> = async (op,auth:Auth) => {
  const provider = new TwitterAuthProvider();
  useDeviceLanguage(auth);
  const userCredential = await signInWithPopup(auth,provider);
  const credential = OAuthProvider.credentialFromResult(userCredential);
  return new TwitterSignInResult(
    credential.accessToken as string,
    credential.secret as string
  );
};
