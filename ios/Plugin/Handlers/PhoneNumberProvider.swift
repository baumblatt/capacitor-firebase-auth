import Foundation
import Capacitor
import FirebaseAuth

class PhoneNumberProviderHandler: NSObject, ProviderHandler {

    var plugin: CapacitorFirebaseAuth? = nil
    var mPhoneNumber: String? = nil
    var mVerificationId: String? = nil
    var mVerificationCode: String? = nil


    func initialize(plugin: CapacitorFirebaseAuth) {
        print("Initializing Phone Number Provider Handler")
        self.plugin = plugin
    }

    func signIn(call: CAPPluginCall) {
        guard let data = call.getObject("data") else {
            call.reject("The auth data is required")
            return
        }

        guard let phone = data["phone"] as? String else {
            call.reject("The phone number is required")
            return
        }

        self.mPhoneNumber = phone

        PhoneAuthProvider.provider().verifyPhoneNumber(phone, uiDelegate: nil) { (verificationID, error) in
            if let error = error {
                if let errCode = AuthErrorCode(rawValue: error._code) {
                    switch errCode {
                    case AuthErrorCode.quotaExceeded:
                        call.reject("Quota exceeded.")
                    case AuthErrorCode.invalidPhoneNumber:
                        call.reject("Invalid phone number.")
                    case AuthErrorCode.captchaCheckFailed:
                        call.reject("Captcha Check Failed")
                    case AuthErrorCode.missingPhoneNumber:
                        call.reject("Missing phone number.")
                    default:
                        call.reject("PhoneAuth Sign In failure: \(String(describing: error))")
                    }

                    return
                }
            }

            self.mVerificationId = verificationID

            guard let verificationID = verificationID else {
                call.reject("There is no verificationID after .verifyPhoneNumber!")
                return
            }

            // notify event On Cond Sent.
            self.plugin?.notifyListeners("cfaSignInPhoneOnCodeSent", data: ["verificationId" : verificationID ])

            guard let callbackId = call.callbackId else {
                call.reject("There is no callbackId after .verifyPhoneNumber!")
                return
            }

            // return success call.
            call.resolve([
                "callbackId": callbackId,
                "verificationId": verificationID
            ])
        }
    }

    func signOut() {
        // do nothing
    }

    func isAuthenticated() -> Bool {
        return false
    }

    func fillResult(credential: AuthCredential?, data: PluginCallResultData) -> PluginCallResultData {

        var jsResult: PluginCallResultData = [:]
        data.forEach { (key, value) in
            jsResult[key] = value
        }

        jsResult["phone"] = self.mPhoneNumber
        jsResult["verificationId"] = self.mVerificationId
        jsResult["verificationCode"] = self.mVerificationCode

        return jsResult
    }
}
