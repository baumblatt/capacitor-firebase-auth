import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth
import GoogleSignIn


class GoogleProviderHandler: NSObject, ProviderHandler, GIDSignInDelegate {

    var plugin: CapacitorFirebaseAuth? = nil

    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Google Provider Handler")

        self.plugin = plugin

        GIDSignIn.sharedInstance().clientID = FirebaseApp.app()?.options.clientID
        GIDSignIn.sharedInstance().delegate = self
        GIDSignIn.sharedInstance().presentingViewController = self.plugin?.bridge.viewController

        let permissions = self.plugin?.getConfigValue("permissions") as? [String:Any] ?? [:]

        if let scopes = permissions["google"] as? [String] {
            GIDSignIn.sharedInstance().scopes = scopes;
        }

        let propertiesMap = self.plugin?.getConfigValue("properties") as? [String:Any] ?? [:]
        let properties = propertiesMap["google"] as? [String:Any] ?? [:]

        if let hostedDomain = properties["hostedDomain"] as? String {
            GIDSignIn.sharedInstance()?.hostedDomain = hostedDomain
        }

        NotificationCenter.default
            .addObserver(self, selector: #selector(handleOpenUrl(_ :)), name: Notification.Name(CAPNotifications.URLOpen.name()), object: nil)
    }

    @objc
    func handleOpenUrl(_ notification: Notification) {
        guard let object = notification.object as? JSObject else {
            self.plugin?.handleError(message: "There is no object on handleOpenUrl")
            return
        }

        guard let url = object["url"] as? URL else {
            self.plugin?.handleError(message: "There is no url on handleOpenUrl")
            return
        }

        GIDSignIn.sharedInstance().handle(url)
    }

    func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
        if let error = error {
            self.plugin?.handleError(message: error.localizedDescription)
            return
        }

        guard let authentication = user.authentication else {
            self.plugin?.handleError(message: "There is no authentication on GIDGoogleUser")
            return
        }

        let credential = GoogleAuthProvider.credential(withIDToken: authentication.idToken, accessToken: authentication.accessToken)
        self.plugin?.handleAuthCredentials(credential: credential);
    }

    func sign(_ signIn: GIDSignIn!, didDisconnectWith user: GIDGoogleUser!, withError error: Error!) {
        self.signOut()
    }

    func signIn(call: CAPPluginCall) {
        GIDSignIn.sharedInstance()?.signIn();
    }

    func isAuthenticated() -> Bool {
        return GIDSignIn.sharedInstance()?.currentUser != nil
    }

    func fillResult(credential: AuthCredential?, data: PluginResultData) -> PluginResultData {
        guard let currentUser = GIDSignIn.sharedInstance()?.currentUser else {
            return data
        }

        var jsResult: PluginResultData = [:]
        data.forEach { (key, value) in
            jsResult[key] = value
        }

        jsResult["idToken"] = currentUser.authentication.idToken

        return jsResult
    }

    func signOut(){
        GIDSignIn.sharedInstance()?.signOut()
    }
}
