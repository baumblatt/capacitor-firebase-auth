declare global {
  interface PluginRegistry {
    CapacitorFirebaseAuth?: CapacitorFirebaseAuthPlugin;
  }
}

export interface SignInResult {
  providerId: string;
  displayName?: string;
  idToken?: string;
  secret?: string;
}

export interface CapacitorFirebaseAuthPlugin {
  signIn(options: {name?: string, provider: {providerId: string;}}): Promise<SignInResult>;
  signOut(options: {name?: string}): Promise<void>;
}
