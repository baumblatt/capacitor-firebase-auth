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

    var providersNames: [String] = [];
    var languageCode: String = "en"
    var nativeAuth: Bool = false

    var callbackId: String? = nil
    var providers: ProvidersMap = [:]
    var frontendApi: String? = nil

    public override func load() {
        self.providersNames = self.getConfigValue("providers") as? [String] ?? []
        self.nativeAuth = self.getConfigValue("nativeAuth") as? Bool ?? false
        self.languageCode = self.getConfigValue("languageCode") as? String ?? "en"
        self.frontendApi = self.getConfigValue("frontendApi") as? String

        if (FirebaseApp.app() == nil) {
            FirebaseApp.configure()
            Auth.auth().languageCode = self.languageCode;
        }

        for provider in self.providersNames {
            if ("google.com" == provider) {
                self.providers["google.com"] = GoogleProviderHandler()
                self.providers["google.com"]?.initialize(plugin: self)
            } else if ("twitter.com" == provider) {
                self.providers["twitter.com"] = TwitterProviderHandler()
                self.providers["twitter.com"]?.initialize(plugin: self)
            } else if ("facebook.com" == provider) {
                self.providers["facebook.com"] = FacebookProviderHandler()
                self.providers["facebook.com"]?.initialize(plugin: self)
            } else if ("apple.com" == provider) {
                if #available(iOS 13.0, *) {
                    self.providers["apple.com"] = AppleProviderHandler()
                    self.providers["apple.com"]?.initialize(plugin: self)
                }
            }
            else if ("phone" == provider) {
                self.providers["phone"] = PhoneNumberProviderHandler()
                self.providers["phone"]?.initialize(plugin: self)
            }
        }
    }

    @objc func signIn(_ call: CAPPluginCall) {
        guard let theProvider : ProviderHandler = self.getProvider(call: call) else {
            // call.reject inside getProvider
            return
        }

        guard let callbackId = call.callbackId else {
            call.error("The call has no callbackId")
            return
        }

        self.callbackId = callbackId
        call.save()

        DispatchQueue.main.async {
            if (theProvider.isAuthenticated()) {
                self.buildResult();
                return
            }

            theProvider.signIn(call: call)
        }

    }

    func getProvider(call: CAPPluginCall) -> ProviderHandler? {
        guard let providerId = call.getString("providerId") else {
            call.error("The provider Id is required")
            return nil
        }

        guard let theProvider = self.providers[providerId] else {
            call.error("The provider is disable or unsupported")
            return nil
        }

        return theProvider
    }

    func handleAuthCredentials(credential: AuthCredential) {
        if (self.nativeAuth) {
            self.authenticate(credential: credential)
        } else {
            self.buildResult()
        }
    }

    func authenticate(credential: AuthCredential) {
        Auth.auth().signIn(with: credential) { (authResult, error) in

            if let error = error {
                self.handleError(message: error.localizedDescription)
                return
            }

            guard (authResult?.user) != nil else {
                print("There is no user on firebase AuthResult")
                self.handleError(message: "There is no token in Facebook sign in.")
                return
            }

            guard let callbackId = self.callbackId else {
                print("Ops, there is no callbackId building result")
                return
            }

            guard self.bridge.getSavedCall(callbackId) != nil else {
                print("Ops, there is no saved call building result")
                return
            }

            self.buildResult();
        }
    }

    func buildResult() {
        guard let callbackId = self.callbackId else {
            print("Ops, there is no callbackId building result")
            return
        }

        guard let call = self.bridge.getSavedCall(callbackId) else {
            print("Ops, there is no saved call building result")
            return
        }

        guard let frontendApiUrl = self.frontendApi else {
            return call.reject("Ops, 'frontendApi' is not set in config file")
        }

        // Request ID Token from Google
        Auth.auth().currentUser?.getIDToken(completion: { (idToken, error) in
            if error != nil {
                return self.handleError(message: error?.localizedDescription ?? "Can not get idToken")
            }

            let frontendAPI = FrontendAPI(
                    baseUrl: frontendApiUrl,
                    idToken: idToken!
            )

            // Exchange idToken to customToken
            frontendAPI.getCustomToken(completion: { (customToken, error) in
                if error != nil {
                    return self.handleError(message: error!.localizedDescription)
                }

                if customToken == nil {
                    return self.handleError(message: "Custom token is empty")
                }

                guard let provider: ProviderHandler = self.getProvider(call: call) else {
                    return
                }

                // Initial data
                let jsPluginResult: PluginResultData = [
                    "callbackId": callbackId,
                    "providerId": call.getString("providerId") ?? "",
                    "customToken": customToken ?? "",
                ]

                // Merged with provider related data
                let jsResult: PluginResultData = provider.fillResult(data: jsPluginResult)
                let currentDisplayName: String? = Auth.auth().currentUser?.displayName ?? nil

                print("Current display name: \(currentDisplayName ?? "nil")")

                // If user displayName is set, return the result
                if currentDisplayName != nil {
                    return call.success(jsResult);
                }

                var userDisplayName: String = "Gebruiker"

                if jsResult["givenName"] != nil,
                   jsResult["familyName"] != nil {
                    let givenName = jsResult["givenName"] as! String
                    let familyName = jsResult["familyName"] as! String

                    userDisplayName = "\(givenName) \(familyName)"
                }

                // Make a request to set user's display name on Firebase
                let changeRequest = Auth.auth().currentUser?.createProfileChangeRequest()
                changeRequest?.displayName = userDisplayName
                changeRequest?.commitChanges(completion: { (error) in

                    if let error = error {
                        print(error.localizedDescription)
                        call.reject(error.localizedDescription)
                    } else {
                        print("Updated display name: \(Auth.auth().currentUser!.displayName!)")
                        call.success(jsResult);
                    }
                })
            })
        })
    }

    func handleError(message: String) {
        print(message)

        guard let callbackId = self.callbackId else {
            print("Ops, there is no callbackId handling error")
            return
        }

        guard let call = self.bridge.getSavedCall(callbackId) else {
            print("Ops, there is no saved call handling error")
            return
        }

        call.reject(message)
    }

    @objc func signOut(_ call: CAPPluginCall){
        do {
            for provider in self.providers.values {
                try provider.signOut()
            }

            if (Auth.auth().currentUser != nil) {
                try Auth.auth().signOut()
            }

            call.success()
        } catch let signOutError as NSError {
            print ("Error signing out: %@", signOutError)
            call.reject("Error signing out: \(signOutError)")
        }
    }
}
