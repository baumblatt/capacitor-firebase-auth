import 'firebase/auth';
import firebase from 'firebase/app';
import { AppleSignInResult } from '../definitions';
export const appleSignInWeb = async () => {
    var _a;
    const provider = new firebase.auth.OAuthProvider('apple.com');
    firebase.auth().useDeviceLanguage();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const credential = userCredential === null || userCredential === void 0 ? void 0 : userCredential.credential;
    return new AppleSignInResult(credential.idToken, '', credential.accessToken, (_a = credential.secret) !== null && _a !== void 0 ? _a : "");
};
//# sourceMappingURL=apple.provider.js.map