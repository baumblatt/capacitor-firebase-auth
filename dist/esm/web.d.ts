import 'firebase/auth';
import { WebPlugin } from '@capacitor/core';
import { CapacitorFirebaseAuthPlugin, SignInOptions, SignInResult } from './definitions';
export declare class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
    constructor();
    signIn<T extends SignInResult>(options: {
        providerId: string;
        data?: SignInOptions;
    }): Promise<T>;
    signOut(options: {}): Promise<void>;
}
