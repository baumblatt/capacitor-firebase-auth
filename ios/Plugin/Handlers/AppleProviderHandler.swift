import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth

import AuthenticationServices
import CryptoKit

class AppleProviderHandler: NSObject, ProviderHandler  {

    
    
    var plugin: CapacitorFirebaseAuth? = nil
    var currentNonce: String?
    
    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Google Provider Handler")
        
        self.plugin = plugin
    }
    
    func signIn(call: CAPPluginCall) {
        if #available(iOS 13, *) {
            self.startSignInWithAppleFlow()
        } else {
            self.plugin!.handleError(message: "A failure occurs in Apple sign in: iOS 13 is required")
        }
    }

    
    func isAuthenticated() -> Bool {
        return false
    }
    
    func signOut() {
        // there is nothing to do here
        print("AppleProviderHandler.signOut called.");
    }
    
    func fillResult(credential: AuthCredential?, data: PluginResultData) -> PluginResultData {
        var jsResult: PluginResultData = [:]
        
        data.forEach { (key, value) in
            jsResult[key] = value
        }
        
        let appleCredential = credential as! OAuthCredential
        jsResult["idToken"] = appleCredential.idToken
        jsResult["rawNonce"] = currentNonce
        
        return jsResult
    }
}


@available(iOS 13.0, *)
extension AppleProviderHandler: ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
    
    @available(iOS 13, *)
    func startSignInWithAppleFlow() {
      let nonce = randomNonceString()
      currentNonce = nonce
      let appleIDProvider = ASAuthorizationAppleIDProvider()
      let request = appleIDProvider.createRequest()
      request.requestedScopes = [.fullName, .email]
      request.nonce = sha256(nonce)

      let authorizationController = ASAuthorizationController(authorizationRequests: [request])
      authorizationController.delegate = self
      authorizationController.presentationContextProvider = self
      authorizationController.performRequests()
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
            guard let nonce = currentNonce else {
                print("Invalid state: A login callback was received, but no login request was sent.")
                self.plugin!.handleError(message: "A failure occurs in Apple sign in: Invalid state: A login callback was received, but no login request was sent.n")
                return
            }
            guard let appleIDToken = appleIDCredential.identityToken else {
                print("Unable to fetch identity token")
                self.plugin!.handleError(message: "A failure occurs in Apple sign in: Unable to fetch identity token")
                return
            }
            guard let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
                print("Unable to serialize token string from data: \(appleIDToken.debugDescription)")
                self.plugin!.handleError(message: "A failure occurs in Apple sign in: Unable to serialize token string from data: \(appleIDToken.debugDescription)")
                return
            }
            
            // Initialize a Firebase credential.
            let credential = OAuthProvider.credential(withProviderID: "apple.com", idToken: idTokenString, rawNonce: nonce)
            
            // Sign in with Firebase.
            self.plugin?.handleAuthCredentials(credential: credential);
        }
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        // Handle error.
        print("A failure occurs in Apple sign in: \(error)")
        self.plugin!.handleError(message: "A failure occurs in Apple sign in: \(error)")
    }
    
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return (self.plugin?.bridge.getWebView()?.window)!
    }
    
    // Adapted from https://auth0.com/docs/api-auth/tutorials/nonce#generate-a-cryptographically-random-nonce
    private func randomNonceString(length: Int = 32) -> String {
        precondition(length > 0)
        let charset: Array<Character> =
            Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
        var result = ""
        var remainingLength = length
        
        while remainingLength > 0 {
            let randoms: [UInt8] = (0 ..< 16).map { _ in
                var random: UInt8 = 0
                let errorCode = SecRandomCopyBytes(kSecRandomDefault, 1, &random)
                if errorCode != errSecSuccess {
                    fatalError("Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)")
                }
                return random
            }
            
            randoms.forEach { random in
                if remainingLength == 0 {
                    return
                }
                
                if random < charset.count {
                    result.append(charset[Int(random)])
                    remainingLength -= 1
                }
            }
        }
        
        return result
    }
    
    @available(iOS 13, *)
    private func sha256(_ input: String) -> String {
        let inputData = Data(input.utf8)
        let hashedData = SHA256.hash(data: inputData)
        let hashString = hashedData.compactMap {
            return String(format: "%02x", $0)
        }.joined()
        
        return hashString
    }
    
}
