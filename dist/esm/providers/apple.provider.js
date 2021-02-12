import 'firebase/auth';
import firebase from 'firebase/app';
import { AppleSignInResult } from '../definitions';
export const appleSignInWeb = async () => {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    firebase.auth().useDeviceLanguage();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const credential = userCredential === null || userCredential === void 0 ? void 0 : userCredential.credential;
    return new AppleSignInResult(credential.idToken, credential.accessToken);
};
//# sourceMappingURL=apple.provider.js.map