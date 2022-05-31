import 'firebase/auth';
import firebase from 'firebase/app';
export class GoogleSignInResult {
    constructor(idToken) {
        this.idToken = idToken;
        this.providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
    }
}
export class TwitterSignInResult {
    constructor(idToken, secret) {
        this.idToken = idToken;
        this.secret = secret;
        this.providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
    }
}
export class FacebookSignInResult {
    constructor(idToken) {
        this.idToken = idToken;
        this.providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
    }
}
export class AppleSignInResult {
    constructor(idToken, rawNonce, accessToken, secret) {
        this.idToken = idToken;
        this.rawNonce = rawNonce;
        this.accessToken = accessToken;
        this.secret = secret;
        this.providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
    }
}
export class PhoneSignInResult {
    constructor(verificationId, verificationCode) {
        this.verificationId = verificationId;
        this.verificationCode = verificationCode;
        this.providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
    }
}
//# sourceMappingURL=definitions.js.map