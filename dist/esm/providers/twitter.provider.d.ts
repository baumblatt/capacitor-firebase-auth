import 'firebase/auth';
import { SignInOptions, TwitterSignInResult } from '../definitions';
export declare const twitterSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<TwitterSignInResult>;
