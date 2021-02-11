import 'firebase/auth';
import { FacebookSignInResult, SignInOptions } from '../definitions';
export declare const facebookSignInWeb: (options: {
    providerId: string;
    data?: SignInOptions;
}) => Promise<FacebookSignInResult>;
