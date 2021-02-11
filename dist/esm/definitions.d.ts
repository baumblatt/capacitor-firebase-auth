import 'firebase/auth';
declare module "@capacitor/core" {
    interface PluginRegistry {
        CapacitorFirebaseAuth?: CapacitorFirebaseAuthPlugin;
    }
}
export interface CapacitorFirebaseAuthPlugin {
    signIn(options: {
        providerId: string;
        data?: SignInOptions;
    }): Promise<SignInResult>;
    signOut(options: {}): Promise<void>;
}
export declare class GoogleSignInResult {
    idToken: string;
    providerId: string;
    constructor(idToken: string);
}
export declare class TwitterSignInResult {
    idToken: string;
    secret: string;
    providerId: string;
    constructor(idToken: string, secret: string);
}
export declare class FacebookSignInResult {
    idToken: string;
    providerId: string;
    constructor(idToken: string);
}
export declare class AppleSignInResult {
    idToken: string;
    rawNonce: string;
    providerId: string;
    constructor(idToken: string, rawNonce: string);
}
export declare class PhoneSignInResult {
    verificationId: string;
    verificationCode: string;
    providerId: string;
    constructor(verificationId: string, verificationCode: string);
}
export declare type SignInResult = GoogleSignInResult | TwitterSignInResult | FacebookSignInResult | PhoneSignInResult;
export interface PhoneSignInOptions {
    phone: string;
    verificationCode?: string;
}
export declare type SignInOptions = PhoneSignInOptions;
