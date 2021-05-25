import firebase from "firebase/app";

import "firebase/auth";
import type { SignInOptions } from "../definitions";
import { FacebookSignInResult } from "../definitions";

import OAuthCredential = firebase.auth.OAuthCredential;

export const facebookSignInWeb: (options: {
  providerId: string;
  data?: SignInOptions;
}) => Promise<FacebookSignInResult> = async () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().useDeviceLanguage();

  const userCredential = await firebase.auth().signInWithPopup(provider);

  const { credential }: { credential: OAuthCredential } = userCredential;
  return new FacebookSignInResult(credential.accessToken);
};
