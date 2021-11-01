import { GoogleSignInResult, SignInOptions } from '../definitions';
import {
  Auth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  useDeviceLanguage,
} from 'firebase/auth';

export const googleSignInWeb: (
  options: { providerId: string; data?: SignInOptions },
  auth: Auth
) => Promise<GoogleSignInResult> = async (
  options: { providerId: string; data?: SignInOptions },
  auth: Auth
) => {
  const provider = new GoogleAuthProvider();
  useDeviceLanguage(auth);
  const userCredential = await signInWithPopup(auth, provider);
  const credential = OAuthProvider.credentialFromResult(userCredential);

  return new GoogleSignInResult(credential.idToken as string);
};
