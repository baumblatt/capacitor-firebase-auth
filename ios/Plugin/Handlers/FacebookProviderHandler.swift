import Foundation
import Capacitor
import FirebaseAuth
import FBSDKCoreKit
import FBSDKLoginKit

class FacebookProviderHandler: NSObject, ProviderHandler {
    var plugin: CapacitorFirebaseAuth? = nil
    var loginManager: LoginManager? = nil
    
    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Facebook Provider Handler")
        self.plugin = plugin
        
        self.loginManager = LoginManager()
    }
    
    func signIn(call: CAPPluginCall) {
        self.loginManager!.logIn(permissions: ["public_profile", "email"], from: self.plugin!.bridge.viewController) {
            ( result: LoginManagerLoginResult?, error: Error?) in
            
            if let error = error {
                print(error.localizedDescription)
                self.plugin!.handleError(message: "A failure occurs in Facebook sign in.")
                return
            }
            
            guard let token: AccessToken = result?.token else {
                print("There is no token in Facebook sign in.")
                self.plugin?.handleError(message: "There is no token in Facebook sign in.")
                return
            }

            let credential = FacebookAuthProvider.credential(withAccessToken: token.tokenString)
            self.plugin?.handleAuthCredentials(credential: credential)
        }
    }
    
    func isAuthenticated() -> Bool {
        return AccessToken.current != nil
    }
    
    func fillResult(credential: AuthCredential?, data: PluginResultData) -> PluginResultData {
        guard let accessToken = AccessToken.current else {
            return data
        }
        
        var jsResult: PluginResultData = [:]
        data.forEach { (key, value) in
            jsResult[key] = value
        }
        
        jsResult["idToken"] = accessToken.tokenString
        
        return jsResult
    }
    
    func signOut(){
        self.loginManager!.logOut()
    }
    
}
