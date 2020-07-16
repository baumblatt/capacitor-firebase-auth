package com.baumblatt.capacitor.firebase.auth.handlers;

import android.content.Intent;
import android.util.Log;

import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.firebase.FirebaseException;
import com.google.firebase.FirebaseTooManyRequestsException;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthProvider;

import java.util.concurrent.TimeUnit;

public class PhoneProviderHandler implements ProviderHandler {
    private static final String PHONE_TAG = "PhoneProviderHandler";

    private String mVerificationId;
    private String mVerificationCode;

    private PhoneAuthProvider.ForceResendingToken mResendToken;
    private PhoneAuthProvider.OnVerificationStateChangedCallbacks mCallbacks;

    private CapacitorFirebaseAuth plugin;

    @Override
    public void init(final CapacitorFirebaseAuth plugin) {
        this.plugin = plugin;

        this.mCallbacks = new PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            @Override
            public void onVerificationCompleted(PhoneAuthCredential credential) {
                Log.d(PHONE_TAG, "PhoneAuth:onVerificationCompleted:" + credential);
                mVerificationCode = credential.getSmsCode();

                PluginCall call = plugin.getSavedCall();

                // Notify listeners of Code Received event.
                JSObject jsEvent = new JSObject();
                jsEvent.put("verificationId", mVerificationId);
                jsEvent.put("verificationCode", mVerificationCode);
                plugin.notifyListeners("cfaSignInPhoneOnCodeReceived", jsEvent);

                JSObject jsUser = new JSObject();
                jsUser.put("callbackId", call.getCallbackId());
                jsUser.put("providerId", credential.getProvider());
                jsUser.put("verificationId", mVerificationId);
                jsUser.put("verificationCode", mVerificationCode);

                call.success(jsUser);
            }

            @Override
            public void onVerificationFailed(FirebaseException error) {
                Log.w(PHONE_TAG, "PhoneAuth:onVerificationFailed:" + error);

                if (error instanceof FirebaseAuthInvalidCredentialsException) {
                    plugin.handleFailure("Invalid phone number.", error);
                } else if (error instanceof FirebaseTooManyRequestsException) {
                    plugin.handleFailure("Quota exceeded.", error);
                } else {
                    plugin.handleFailure("PhoneAuth Sign In failure.", error);
                }

            }

            public void onCodeSent(String verificationId,
                                   PhoneAuthProvider.ForceResendingToken token) {
                // The SMS verification code has been sent to the provided phone number, we
                // now need to ask the user to enter the code and then construct a credential
                // by combining the code with a verification ID.
                Log.d(PHONE_TAG, "onCodeSent:" + verificationId);

                // Save verification ID and resending token so we can use them later
                mVerificationId = verificationId;
                mResendToken = token;

                // Notify listeners of Code Sent event.
                JSObject jsEvent = new JSObject();
                jsEvent.put("verificationId", mVerificationId);
                plugin.notifyListeners("cfaSignInPhoneOnCodeSent", jsEvent);
            }
        };
    }

    @Override
    public void signIn(PluginCall call) {
        if (!call.getData().has("data")) {
            call.reject("The auth data is required");
            return;
        }

        JSObject data = call.getObject("data", new JSObject());

        String phone = data.getString("phone", "");
        if (phone.equalsIgnoreCase("null") || phone.equalsIgnoreCase("")) {
            call.reject("The phone number is required");
            return;
        }

        String code = data.getString("verificationCode", "");
        if(code.equalsIgnoreCase("null") || code.equalsIgnoreCase("")) {
            PhoneAuthProvider.getInstance().verifyPhoneNumber
                    (phone, 60, TimeUnit.SECONDS, this.plugin.getActivity(), this.mCallbacks);
        } else {
            AuthCredential credential = PhoneAuthProvider.getCredential(this.mVerificationId, code);
            this.mVerificationCode = code;
            plugin.handleAuthCredentials(credential);
        }
    }

    @Override
    public void signOut() {
        // there is nothing to do here
    }

    @Override
    public int getRequestCode() {
        // there is nothing to do here
        return 0;
    }

    @Override
    public void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        // there is nothing to do here
    }

    @Override
    public boolean isAuthenticated() {
        return false;
    }

    @Override
    public void fillResult(AuthCredential auth, JSObject jsUser) {
        jsUser.put("verificationId", this.mVerificationId);
        jsUser.put("verificationCode", this.mVerificationCode);

        this.mVerificationId = null;
        this.mVerificationCode = null;
    }
}
