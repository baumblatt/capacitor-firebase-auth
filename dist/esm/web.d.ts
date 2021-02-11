import 'firebase/auth';
import { WebPlugin } from '@capacitor/core';
import { CapacitorFirebaseAuthPlugin, SignInResult } from './definitions';
export declare class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
    constructor();
    signIn(options: {
        providerId: string;
    }): Promise<SignInResult>;
    signOut(options: {}): Promise<void>;
}
declare const CapacitorFirebaseAuth: CapacitorFirebaseAuthWeb;
export { CapacitorFirebaseAuth };
