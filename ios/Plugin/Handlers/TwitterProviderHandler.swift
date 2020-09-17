import Foundation
import Capacitor
import FirebaseAuth

class TwitterProviderHandler: NSObject, ProviderHandler {
    var provider: OAuthProvider? = nil
    var plugin: CapacitorFirebaseAuth? = nil
    
    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Twitter Provider Handler")
        self.plugin = plugin
        
        self.provider = OAuthProvider(providerID: "twitter.com")
        
        self.provider?.customParameters = [
            "lang": self.plugin?.languageCode ?? "en"
        ]
    }

    func signIn(call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.provider?.getCredentialWith(nil) { credential, error in
              if error != nil {
                print(error?.localizedDescription ?? "A failure occurs in Twitter sign in.")
                self.plugin!.handleError(message: "A failure occurs in Twitter sign in.")
                return
              }
              if credential != nil {
                Auth.auth().signIn(with: credential!) { (authResult, error) in
                    if error != nil {
                      print(error?.localizedDescription ?? "A failure occurs in Twitter sign in.")
                      self.plugin!.handleError(message: "A failure occurs in Twitter sign in.")
                      return
                    }
                    self.plugin?.handleAuthCredentials(credential: (authResult?.credential!)!);
                }
                
              }
            }
        }
    }
    
    func isAuthenticated() -> Bool {
        return false
    }
    
    func fillResult(credential: AuthCredential?, data: PluginResultData) -> PluginResultData {
        var jsResult: PluginResultData = [:]
        
        data.forEach { (key, value) in
            jsResult[key] = value
        }
        
        let twitterCredential = credential as! OAuthCredential
        
        jsResult["idToken"] = twitterCredential.accessToken
        jsResult["secret"] = twitterCredential.secret
        
        return jsResult
    }
    
    func signOut() {
        // there is nothing to do here
        print("TwitterProviderHandler.signOut called.");
    }
}
