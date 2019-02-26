import { WebPlugin } from '@capacitor/core';
import { CapacitorFirebaseAuthPlugin } from './definitions';

export class CapacitorFirebaseAuthWeb extends WebPlugin implements CapacitorFirebaseAuthPlugin {
  constructor() {
    super({
      name: 'CapacitorFirebaseAuth',
      platforms: ['web']
    });
  }

  async echo(options: { value: string }): Promise<{value: string}> {
    console.log('ECHO', options);
    return options;
  }
}

const CapacitorFirebaseAuth = new CapacitorFirebaseAuthWeb();

export { CapacitorFirebaseAuth };
