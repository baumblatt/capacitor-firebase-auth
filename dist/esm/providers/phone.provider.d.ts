import 'firebase/auth';
import { PhoneSignInResult, SignInOptions } from '../definitions';
export declare const phoneSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<PhoneSignInResult>;
