import 'firebase/auth';

import firebase from 'firebase/app';

export interface SignInResult {
}

export interface CapacitorFirebaseAuthPlugin {
  signIn<T extends SignInResult>(options: { providerId: string, data?: SignInOptions }): Promise<T>;
  signOut(options: {}): Promise<void>;
}

export class GoogleSignInResult implements SignInResult {
  providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
  constructor(public idToken: string) {
  }
}

export class TwitterSignInResult implements SignInResult {
  providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
  constructor(public idToken: string, public secret: string) {
  }
}

export class FacebookSignInResult implements SignInResult {
  providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
  constructor(public idToken: string) {
  }
}

export type AppleName = {
  namePrefix?: string;
  givenName?: string;
  middleName?: string;
  familyName?: string;
  nameSuffix?: string;
};

export class AppleSignInResult implements SignInResult {
  providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
  fullName?: AppleName;
  constructor(public idToken: string, public rawNonce: string, public accessToken: string, public secret: string) {
  }
}

export class PhoneSignInResult implements SignInResult {
  providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
  constructor(public verificationId: string, public verificationCode: string) {
  }
}

export interface PhoneSignInOptions {
  container?: HTMLElement
  phone: string,
  verificationCode?: string
}

export type SignInOptions = PhoneSignInOptions;
