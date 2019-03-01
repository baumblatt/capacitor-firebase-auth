import { WebPlugin } from '@capacitor/core';
import { CapacitorFirebaseAuthPlugin } from './definitions';

export class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
  constructor() {
    super({
      name: 'CapacitorFirebaseAuth',
      platforms: ['web']
    });
  }

  async signIn(options: {provider: {providerId: string;}}): Promise<{providerId: string; displayName?: string; idToken?: string}> {
    return Promise.resolve({providerId: options.provider.providerId});
  }

  async signOut(options: {provider: {providerId: string;}}): Promise<void> {
    options.provider;
    return Promise.resolve();
  }
}

const CapacitorFirebaseAuth = new CapacitorFirebaseAuthWeb();

export { CapacitorFirebaseAuth };
