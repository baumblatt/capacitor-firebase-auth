var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { registerWebPlugin, WebPlugin } from '@capacitor/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { facebookSignInWeb } from './providers/facebook.provider';
import { googleSignInWeb } from './providers/google.provider';
import { phoneSignInWeb } from './providers/phone.provider';
import { twitterSignInWeb } from './providers/twitter.provider';
export class CapacitorFirebaseAuthWeb extends WebPlugin {
    constructor() {
        super({
            name: 'CapacitorFirebaseAuth',
            platforms: ['web']
        });
    }
    signIn(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const googleProvider = new firebase.auth.GoogleAuthProvider().providerId;
            const facebookProvider = new firebase.auth.FacebookAuthProvider().providerId;
            const twitterProvider = new firebase.auth.TwitterAuthProvider().providerId;
            const phoneProvider = new firebase.auth.PhoneAuthProvider().providerId;
            switch (options.providerId) {
                case googleProvider:
                    return googleSignInWeb(options);
                case twitterProvider:
                    return twitterSignInWeb(options);
                case facebookProvider:
                    return facebookSignInWeb(options);
                case phoneProvider:
                    return phoneSignInWeb(options);
            }
            return Promise.reject(`The '${options.providerId}' provider was not supported`);
        });
    }
    signOut(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(options);
            return firebase.auth().signOut();
        });
    }
}
const CapacitorFirebaseAuth = new CapacitorFirebaseAuthWeb();
export { CapacitorFirebaseAuth };
// Register as a web plugin
registerWebPlugin(CapacitorFirebaseAuth);
//# sourceMappingURL=web.js.map