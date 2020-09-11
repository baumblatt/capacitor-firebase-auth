import Foundation
import Capacitor
import AuthenticationServices
import CryptoKit
import FirebaseCore
import FirebaseAuth

let authorizedUserIdKey = "appleAuthorizedUserIdKey"

@available(iOS 13.0, *)
class AppleProviderHandler: NSObject, ProviderHandler {
    var call: CAPPluginCall?
    var plugin: CapacitorFirebaseAuth? = nil
    var rawNonce: String?
    var appleIDCredential: ASAuthorizationAppleIDCredential? = nil

    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Apple Provider Handler")
        self.plugin = plugin
    }

    func signIn(call: CAPPluginCall) {
        self.call = call;
        self.rawNonce = NonceGenerator.generateNonceString();

        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]
        request.nonce = NonceGenerator.sha256(self.rawNonce!)

        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.performRequests()
    }

    public func isAuthenticated() -> Bool {
        return Auth.auth().currentUser != nil
    }

    public func fillResult(data: PluginResultData) -> PluginResultData {

        var jsResult: PluginResultData = [:]
        data.map { (key, value) in jsResult[key] = value }

        jsResult["user"] = self.appleIDCredential?.user
        jsResult["email"] = self.appleIDCredential?.email
        jsResult["givenName"] = self.appleIDCredential?.fullName?.givenName
        jsResult["familyName"] = self.appleIDCredential?.fullName?.familyName
        jsResult["identityToken"] = String(data: self.appleIDCredential?.identityToken! ?? Data(), encoding: .utf8)
        jsResult["authorizationCode"] = String(data: self.appleIDCredential?.authorizationCode! ?? Data(), encoding: .utf8)

        return jsResult
    }

    public func signOut() throws {
        self.appleIDCredential = nil
        UserDefaults.standard.set(nil, forKey: authorizedUserIdKey)
    }
}

@available(iOS 13.0, *)
extension AppleProviderHandler: ASAuthorizationControllerDelegate {
    public func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential else {
            self.call?.reject("Please, try again.")

            return
        }

        // Store user id key
        UserDefaults.standard.set(appleIDCredential.user, forKey: authorizedUserIdKey)

        // Retrieve the secure nonce generated during Apple sign in
        guard let currentNonce = rawNonce else {
            fatalError("Invalid state: A login callback was received, but no login request was sent.")
        }

        // Retrieve Apple identity token
        guard let appleIDToken = appleIDCredential.identityToken else {
            print("Failed to fetch identity token")
            return
        }

        // Convert Apple identity token to string
        guard let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
            print("Failed to decode identity token")
            return
        }

        // Initialize a Firebase credential using secure nonce and Apple identity token
        let firebaseCredential = OAuthProvider.credential(
                withProviderID: "apple.com",
                idToken: idTokenString,
                rawNonce: currentNonce
        )

        self.appleIDCredential = appleIDCredential;
        self.plugin?.handleAuthCredentials(credential: firebaseCredential)
    }

    public func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        self.call?.reject(error.localizedDescription)
    }
}
