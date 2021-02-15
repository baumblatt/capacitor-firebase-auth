import {PhoneSignInResult, SignInOptions} from '../definitions';

export const phoneSignInWeb: (options: {providerId: string, data?: SignInOptions}) => Promise<PhoneSignInResult>
    = async (options) => {

    // const provider = new firebase.auth.PhoneAuthProvider();
    return Promise.reject(`The '${options.providerId}' provider was not implemented for web yet`);
}
