import 'firebase/auth';
export interface SignInResult {
}
export interface CapacitorFirebaseAuthPlugin {
    signIn<T extends SignInResult>(options: {
        providerId: string;
        data?: SignInOptions;
    }): Promise<T>;
    signOut(options: {}): Promise<void>;
}
export declare class GoogleSignInResult implements SignInResult {
    idToken: string;
    providerId: string;
    constructor(idToken: string);
}
export declare class TwitterSignInResult implements SignInResult {
    idToken: string;
    secret: string;
    providerId: string;
    constructor(idToken: string, secret: string);
}
export declare class FacebookSignInResult implements SignInResult {
    idToken: string;
    providerId: string;
    constructor(idToken: string);
}
export declare class AppleSignInResult implements SignInResult {
    idToken: string;
    rawNonce: string;
    accessToken: string;
    secret: string;
    providerId: string;
    constructor(idToken: string, rawNonce: string, accessToken: string, secret: string);
}
export declare class PhoneSignInResult implements SignInResult {
    verificationId: string;
    verificationCode: string;
    providerId: string;
    constructor(verificationId: string, verificationCode: string);
}
export interface PhoneSignInOptions {
    container?: HTMLElement;
    phone: string;
    verificationCode?: string;
}
export declare type SignInOptions = PhoneSignInOptions;
