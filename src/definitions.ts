import {auth} from 'firebase';

declare global {
  interface PluginRegistry {
    CapacitorFirebaseAuth?: CapacitorFirebaseAuthPlugin;
  }
}

export class GoogleSignInResult{
  providerId = auth.GoogleAuthProvider.PROVIDER_ID;
  constructor(public idToken: string, public displayName: string) {
  }
}

export class TwitterSignInResult {
  providerId = auth.TwitterAuthProvider.PROVIDER_ID;
  constructor(public idToken: string, public secret: string, public displayName: string) {
  }
}

export class FacebookSignInResult {
  providerId = auth.FacebookAuthProvider.PROVIDER_ID;
  constructor(public idToken: string, public displayName: string) {
  }
}

export class PhoneSignInResult {
  providerId = auth.PhoneAuthProvider.PROVIDER_ID;
  constructor(public verificationId: string, public verificationCode: string, public displayName: string) {
  }
}

export type SignInResult = GoogleSignInResult | TwitterSignInResult | FacebookSignInResult | PhoneSignInResult;

export interface SignInPhoneData {
  phone: string,
  code: string
}

export type SignInData = SignInPhoneData;

export interface CapacitorFirebaseAuthPlugin {
  signIn(options: {name?: string, provider: {providerId: string;}, data?: SignInData}): Promise<SignInResult>;
  signOut(options: {name?: string}): Promise<void>;
}
