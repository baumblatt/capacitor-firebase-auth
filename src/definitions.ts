import {auth} from 'firebase';

declare global {
  interface PluginRegistry {
    CapacitorFirebaseAuth?: CapacitorFirebaseAuthPlugin;
  }
}

export class GoogleSignInResult{
  providerId = auth.GoogleAuthProvider.PROVIDER_ID;
  constructor(public idToken: string) {
  }
}

export class TwitterSignInResult {
  providerId = auth.TwitterAuthProvider.PROVIDER_ID;
  constructor(public idToken: string, public secret: string) {
  }
}

export class FacebookSignInResult {
  providerId = auth.FacebookAuthProvider.PROVIDER_ID;
  constructor(public idToken: string) {
  }
}

export class PhoneSignInResult {
  providerId = auth.PhoneAuthProvider.PROVIDER_ID;
  constructor(public verificationId: string, public verificationCode: string) {
  }
}

export type SignInResult = GoogleSignInResult | TwitterSignInResult | FacebookSignInResult | PhoneSignInResult;

export interface PhoneSignInOptions {
  phone: string,
  verificationCode: string
}

export type SignInOptions = PhoneSignInOptions;

export interface CapacitorFirebaseAuthPlugin {
  signIn(options: {providerId: string, data?: SignInOptions}): Promise<SignInResult>;
  signOut(options: {}): Promise<void>;
}
