import 'firebase/auth';
import { registerPlugin } from '@capacitor/core';
import firebase from 'firebase/app';
import { Observable, throwError } from 'rxjs';
export const CapacitorFirebaseAuth = registerPlugin('CapacitorFirebaseAuth', {
    web: () => import('./web').then(m => new m.CapacitorFirebaseAuthWeb()),
});
const plugin = CapacitorFirebaseAuth;
/**
 * Call the sign in method on native layer and sign in on web layer with retrieved credentials.
 * @param providerId The provider identification.
 * @param data The provider additional information (optional).
 */
export const cfaSignIn = (providerId, data) => {
    const googleProvider = new firebase.auth.GoogleAuthProvider().providerId;
    const facebookProvider = new firebase.auth.FacebookAuthProvider().providerId;
    const twitterProvider = new firebase.auth.TwitterAuthProvider().providerId;
    const phoneProvider = new firebase.auth.PhoneAuthProvider().providerId;
    switch (providerId) {
        case googleProvider:
            return cfaSignInGoogle();
        case twitterProvider:
            return cfaSignInTwitter();
        case facebookProvider:
            return cfaSignInFacebook();
        case cfaSignInAppleProvider:
            return cfaSignInApple();
        case phoneProvider:
            if (!data) {
                throw new Error('Phone and Verification data must be provided.');
            }
            return cfaSignInPhone(data.phone, data.verificationCode);
        default:
            return throwError(new Error(`The '${providerId}' provider was not supported`));
    }
};
/**
 * Call the Google sign in method on native layer and sign in on web layer with retrieved credentials.
 */
export const cfaSignInGoogle = () => {
    return new Observable(observer => {
        // get the provider id
        const providerId = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
        // native sign in
        plugin.signIn({ providerId }).then((result) => {
            // create the credentials
            const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken);
            // web sign in
            firebase.app().auth().signInWithCredential(credential)
                .then((userCredential) => {
                if (!userCredential.user) {
                    throw new Error('Firebase User was not received.');
                }
                observer.next(userCredential.user);
                observer.complete();
            })
                .catch((reject) => {
                observer.error(reject);
            });
        }).catch((reject) => {
            observer.error(reject);
        });
    });
};
/**
 * Call the Twitter sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInTwitter = () => {
    return new Observable(observer => {
        // get the provider id
        const providerId = firebase.auth.TwitterAuthProvider.PROVIDER_ID;
        // native sign in
        plugin.signIn({ providerId }).then((result) => {
            // create the credentials
            const credential = firebase.auth.TwitterAuthProvider.credential(result.idToken, result.secret);
            // web sign in
            firebase.app().auth().signInWithCredential(credential)
                .then((userCredential) => {
                if (!userCredential.user) {
                    throw new Error('Firebase User was not received.');
                }
                observer.next(userCredential.user);
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        }).catch((reject) => observer.error(reject));
    });
};
/**
 * Call the Facebook sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInFacebook = () => {
    return new Observable(observer => {
        // get the provider id
        const providerId = firebase.auth.FacebookAuthProvider.PROVIDER_ID;
        // native sign in
        plugin.signIn({ providerId }).then((result) => {
            // create the credentials
            const credential = firebase.auth.FacebookAuthProvider.credential(result.idToken);
            // web sign in
            firebase.app().auth().signInWithCredential(credential)
                .then((userCredential) => {
                if (!userCredential.user) {
                    throw new Error('Firebase User was not received.');
                }
                observer.next(userCredential.user);
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        }).catch((reject) => observer.error(reject));
    });
};
export const cfaSignInAppleProvider = 'apple.com';
/**
 * Call the Apple sign in method on native and sign in on web layer with retrieved credentials.
 */
export const cfaSignInApple = () => {
    return new Observable(observer => {
        // native sign in
        plugin.signIn({ providerId: cfaSignInAppleProvider }).then((result) => {
            const { idToken, rawNonce } = result;
            const provider = new firebase.auth.OAuthProvider('apple.com');
            provider.addScope('email');
            provider.addScope('name');
            const credential = provider.credential({ idToken, rawNonce });
            // web sign in
            firebase.app().auth().signInWithCredential(credential)
                .then((userCredential) => {
                if (!userCredential.user) {
                    throw new Error('Firebase User was not received.');
                }
                observer.next(userCredential.user);
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        }).catch((reject) => observer.error(reject));
    });
};
/**
 * Call the Phone verification sign in, handling send and retrieve to code on native, but only sign in on web with retrieved credentials.
 * @param phone The user phone number.
 * @param verificationCode The verification code sent by SMS (optional).
 */
export const cfaSignInPhone = (phone, verificationCode) => {
    return new Observable(observer => {
        // get the provider id
        const providerId = firebase.auth.PhoneAuthProvider.PROVIDER_ID;
        plugin.signIn({ providerId, data: { phone, verificationCode } }).then((result) => {
            // if there is no verification code
            if (!result.verificationCode) {
                return observer.complete();
            }
            // create the credentials
            const credential = firebase.auth.PhoneAuthProvider.credential(result.verificationId, result.verificationCode);
            // web sign in
            firebase.app().auth().signInWithCredential(credential)
                .then((userCredential) => {
                if (!userCredential.user) {
                    throw new Error('Firebase User was not received.');
                }
                observer.next(userCredential.user);
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        }).catch((reject) => observer.error(reject));
    });
};
/**
 * Observable of one notification of <code>On Code Sent</code>event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeSent = () => {
    return new Observable(observer => {
        // @ts-ignore
        return plugin.addListener('cfaSignInPhoneOnCodeSent', (event) => {
            observer.next(event.verificationId);
            observer.complete();
        });
    });
};
/**
 * Observable of one notification of <code>On Code Received</code> event from Phone Verification process.
 */
export const cfaSignInPhoneOnCodeReceived = () => {
    return new Observable(observer => {
        // @ts-ignore
        return plugin.addListener('cfaSignInPhoneOnCodeReceived', (event) => {
            observer.next(event);
            observer.complete();
        });
    });
};
/**
 * Call Google sign out method on native and web layers.
 */
export const cfaSignOut = () => {
    return new Observable(observer => {
        plugin.signOut({}).then(() => {
            // web sign out
            firebase.app().auth().signOut()
                .then(() => {
                observer.next();
                observer.complete();
            })
                .catch((reject) => observer.error(reject));
        });
    });
};
//# sourceMappingURL=facades.js.map