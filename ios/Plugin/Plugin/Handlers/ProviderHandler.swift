import Foundation
import Capacitor

protocol ProviderHandler {
    func initialize(plugin: CapacitorFirebaseAuth) -> Void
    func signIn() -> Void
    func signOut() throws -> Void
    func fillUser(data: PluginResultData) -> PluginResultData
}
