import Foundation
import Capacitor
import FirebaseAuth
import FBSDKCoreKit
import FBSDKLoginKit

class FacebookProviderHandler: NSObject, ProviderHandler {
    var plugin: CapacitorFirebaseAuth? = nil
    var loginManager: FBSDKLoginManager? = nil
    
    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Facebook Provider Handler")
        self.plugin = plugin
        
        self.loginManager = FBSDKLoginManager()
    }
    
    func signIn(call: CAPPluginCall) {
        self.loginManager!.logIn(withReadPermissions: ["public_profile", "email"], from: self.plugin!.bridge.viewController) {
            ( result: FBSDKLoginManagerLoginResult?, error: Error?) in
            
            if let error = error {
                print(error.localizedDescription)
                self.plugin!.handleError(message: "A failure occurs in Facebook sign in.")
                return
            }
            
            guard let token: FBSDKAccessToken = result?.token else {
                print("There is no token in Facebook sign in.")
                self.plugin?.handleError(message: "There is no token in Facebook sign in.")
                return
            }

            let credential = FacebookAuthProvider.credential(withAccessToken: token.tokenString)
            self.plugin?.handleAuthCredentials(credential: credential)
        }
    }
    
    func isAuthenticated() -> Bool {
        return FBSDKAccessToken.current() != nil
    }
    
    func fillResult(data: PluginResultData) -> PluginResultData {
        guard let accessToken = FBSDKAccessToken.current() else {
            return data
        }
        
        var jsResult: PluginResultData = [:]
        data.map { (key, value) in
            jsResult[key] = value
        }
        
        jsResult["idToken"] = accessToken.tokenString
        
        return jsResult
    }
    
    func signOut(){
        self.loginManager!.logOut()
    }
    
}
