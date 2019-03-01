declare global {
  interface PluginRegistry {
    CapacitorFirebaseAuth?: CapacitorFirebaseAuthPlugin;
  }
}

export interface CapacitorFirebaseAuthPlugin {
  signIn(options: {provider: {providerId: string;}}): Promise<{providerId: string; displayName?: string; idToken?: string}>;
  signOut(options: {provider: {providerId: string;}}): Promise<void>;
}
