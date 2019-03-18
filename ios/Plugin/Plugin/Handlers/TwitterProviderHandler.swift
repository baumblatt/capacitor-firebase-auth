import Foundation
import Capacitor
import FirebaseAuth
import TwitterKit

class TwitterProviderHandler: NSObject, ProviderHandler {
    var plugin: CapacitorFirebaseAuth? = nil
    
    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Twitter Provider Handler")
        self.plugin = plugin
        
        guard let path = Bundle.main.path(forResource: "Twitter-Info", ofType: "plist") else {
            print("Missing Twitter-Info.plist configuration.")
            return
        }
        
        let config = NSDictionary(contentsOfFile: path)
        
        guard let apiKey = config?["API_KEY"] as? String else {
            print("There is no API_KEY on Twitter-Info.plist configuration.")
            return
        }
        
        guard let apiSecret = config?["API_SECRET"] as? String else {
            print("There is no API_SECRET on Twitter-Info.plist configuration.")
            return
        }

        TWTRTwitter.sharedInstance().start(withConsumerKey: apiKey, consumerSecret: apiSecret)
    }

    func signIn() {
        DispatchQueue.main.async {
            TWTRTwitter.sharedInstance().logIn(with: self.plugin?.bridge.viewController) { (session, error) in
                
                guard let session = session else {
                    self.plugin?.handleError(message: "There is no session in Twitter sign in.")
                    return
                }
                
                let credential = TwitterAuthProvider.credential(withToken: session.authToken, secret: session.authTokenSecret);
                self.plugin?.authenticate(idToken: session.authToken, credential: credential)
            }
        }
    }
    
    func fillUser(data: PluginResultData) -> PluginResultData {
        guard let session = TWTRTwitter.sharedInstance().sessionStore.session() else {
            return data;
        }

        var jsUser: PluginResultData = [:]
        data.map { (key, value) in
            jsUser[key] = value
        }
        
        jsUser["secret"] = session.authTokenSecret
        
        return jsUser
    }
    
    func signOut() {
        guard let session = TWTRTwitter.sharedInstance().sessionStore.session() else {
            return;
        }
        
        TWTRTwitter.sharedInstance().sessionStore.logOutUserID(session.userID)
    }
}
