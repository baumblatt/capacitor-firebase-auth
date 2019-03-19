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
  signIn(options: {provider: {providerId: string;}}): Promise<SignInResult>;
  signOut(options: {provider?: {providerId: string;}}): Promise<void>;
}
