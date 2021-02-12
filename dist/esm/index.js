import { registerPlugin } from '@capacitor/core';
const CapacitorFirebaseAuth = registerPlugin('CapacitorFirebaseAuth', {
    web: () => import('./web').then(m => new m.CapacitorFirebaseAuthWeb()),
});
export * from './definitions';
export { CapacitorFirebaseAuth };
//# sourceMappingURL=index.js.map