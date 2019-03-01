import { WebPlugin } from '@capacitor/core';
import { CapacitorFirebaseAuthPlugin } from './definitions';

export class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
  constructor() {
    super({
      name: 'CapacitorFirebaseAuth',
      platforms: ['web']
    });
  }

  async signIn(options: {provider: {providerId: string;}}): Promise<{provider: {providerId: string; displayName?: string; idToken?: string}}> {
    return Promise.resolve(options);
  }

  async signOut(options: {provider: {providerId: string;}}): Promise<void> {
    options.provider;
    return Promise.resolve();
  }
}

const CapacitorFirebaseAuth = new CapacitorFirebaseAuthWeb();

export { CapacitorFirebaseAuth };
