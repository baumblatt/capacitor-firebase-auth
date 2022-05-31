import 'firebase/auth';
import firebase from 'firebase/app';
import { FacebookSignInResult } from '../definitions';
export const facebookSignInWeb = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().useDeviceLanguage();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const credential = userCredential === null || userCredential === void 0 ? void 0 : userCredential.credential;
    return new FacebookSignInResult(credential === null || credential === void 0 ? void 0 : credential.accessToken);
};
//# sourceMappingURL=facebook.provider.js.map