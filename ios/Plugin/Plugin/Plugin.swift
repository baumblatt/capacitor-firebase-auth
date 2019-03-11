import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth
import GoogleSignIn

typealias JSObject = [String:Any]
typealias JSArray = [JSObject]
typealias ProvidersMap = [String:ProviderHandler]

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(CapacitorFirebaseAuth)
public class CapacitorFirebaseAuth: CAPPlugin {
    
    var callbackId: String? = nil
    var providers: ProvidersMap = [:]
    
    public override func load() {
        FirebaseApp.configure()
        
        self.providers = [
            "google.com": GoogleProviderHandler()
        ]
        
        self.providers["google.com"]?.initialize(plugin: self)
    }
    
    @objc func signIn(_ call: CAPPluginCall) {
        guard let provider = call.getObject("provider") else {
            call.error("The provider is required")
            return
        }
    
        guard let providerId = provider["providerId"] as? String else {
            call.error("The provider Id is required")
            return
        }
        
        guard let theProvider = self.providers[providerId] else {
            call.error("Unsupported provider")
            return
        }
        
        guard let callbackId = call.callbackId else {
            call.error("The call has no callbackId")
            return
        }
        
        self.callbackId = callbackId
        theProvider.signIn()
        call.save()
    }
    
    func authenticate(idToken: String, credential: AuthCredential) {
        Auth.auth().signInAndRetrieveData(with: credential) { (authResult, error) in
            if let error = error {
                self.handleError(message: error.localizedDescription)
                return
            }
            
            guard let user = authResult?.user else {
                print("There is no user on firebase AuthResult")
                return
            }
            
            self.parseUser(idToken: idToken, user: user);
        }
    }
    
    func parseUser(idToken: String, user: User) {
        guard let callbackId = self.callbackId else {
            print("Ops, there is no callbackId for this call")
            return
        }
        
        let call = self.bridge.getSavedCall(callbackId)
        
        call?.success([
            "providerId": user.providerID,
            "displayName": user.displayName,
            "idToken": idToken
        ])
    }
    
    func handleError(message: String) {
        guard let callbackId = self.callbackId else {
            print("Ops, there is no callbackId for this call")
            return
        }
        
        let call = self.bridge.getSavedCall(callbackId)
        print(message)
        call?.reject(message)
    }
    
    @objc func signOut(_ call: CAPPluginCall){
        guard let provider = call.getObject("provider") else {
            call.error("The provider is required")
            return
        }
        
        guard let providerId = provider["providerId"] as? String else {
            call.error("The provider Id is required")
            return
        }
        
        guard let theProvider = self.providers[providerId] else {
            call.error("Unsupported provider")
            return
        }
        
        do {
            try theProvider.signOut();
            call.success()
        } catch let signOutError as NSError {
            print ("Error signing out: %@", signOutError)
        }
    }
}
