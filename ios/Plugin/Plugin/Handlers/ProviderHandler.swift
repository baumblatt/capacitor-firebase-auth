import Foundation

protocol ProviderHandler {
    func initialize(plugin: CapacitorFirebaseAuth) -> Void
    func signIn() -> Void
    func signOut() throws -> Void
}
