import firebase from 'firebase/app';
import { PhoneSignInResult } from '../definitions';
export const phoneSignInWeb = async (options) => {
    var _a, _b, _c, _d;
    firebase.auth().useDeviceLanguage();
    const code = (_a = options.data) === null || _a === void 0 ? void 0 : _a.verificationCode;
    const verifier = new firebase.auth.RecaptchaVerifier((_b = options.data) === null || _b === void 0 ? void 0 : _b.container);
    const userCredential = await firebase.auth().signInWithPhoneNumber((_c = options.data) === null || _c === void 0 ? void 0 : _c.phone, verifier);
    const confirmation = await userCredential.confirm(code);
    const idToken = await ((_d = confirmation.user) === null || _d === void 0 ? void 0 : _d.getIdToken());
    return new PhoneSignInResult(idToken, code);
};
//# sourceMappingURL=phone.provider.js.map