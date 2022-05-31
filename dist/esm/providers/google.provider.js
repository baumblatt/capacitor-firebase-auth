import 'firebase/auth';
import firebase from 'firebase/app';
import { GoogleSignInResult } from '../definitions';
export const googleSignInWeb = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    const userCredential = await firebase.auth().signInWithPopup(provider);
    const credential = userCredential === null || userCredential === void 0 ? void 0 : userCredential.credential;
    return new GoogleSignInResult(credential.idToken);
};
//# sourceMappingURL=google.provider.js.map