var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { FacebookSignInResult } from '../definitions';
export const facebookSignInWeb = () => __awaiter(void 0, void 0, void 0, function* () {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().useDeviceLanguage();
    const userCredential = yield firebase.auth().signInWithPopup(provider);
    const { credential } = userCredential;
    return new FacebookSignInResult(credential.accessToken);
});
//# sourceMappingURL=facebook.provider.js.map