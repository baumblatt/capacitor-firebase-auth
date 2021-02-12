import { registerPlugin } from '@capacitor/core';

import type { CapacitorFirebaseAuthPlugin } from './definitions';

const CapacitorFirebaseAuth = registerPlugin<CapacitorFirebaseAuthPlugin>('CapacitorFirebaseAuth', {
  web: () => import('./web').then(m => new m.CapacitorFirebaseAuthWeb()),
});

export * from './definitions';
export { CapacitorFirebaseAuth };
