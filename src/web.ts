import { WebPlugin } from '@capacitor/core';
import {CapacitorFirebaseAuthPlugin, SignInResult} from './definitions';

export class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
  constructor() {
    super({
      name: 'CapacitorFirebaseAuth',
      platforms: ['web']
    });
  }

  async signIn(options: {providerId: string;}): Promise<SignInResult> {
    return Promise.resolve({providerId: options.providerId, idToken: undefined});
  }

  // @ts-ignore
  async signOut(options: {}): Promise<void> {
    return Promise.resolve();
  }
}

const CapacitorFirebaseAuth = new CapacitorFirebaseAuthWeb();

export { CapacitorFirebaseAuth };
