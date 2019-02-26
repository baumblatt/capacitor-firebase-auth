declare global {
  interface PluginRegistry {
    CapacitorFirebaseAuth?: CapacitorFirebaseAuthPlugin;
  }
}

export interface CapacitorFirebaseAuthPlugin {
  echo(options: { value: string }): Promise<{value: string}>;
}
