import 'firebase/auth';
import { AppleSignInResult, SignInOptions } from '../definitions';
export declare const appleSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<AppleSignInResult>;
