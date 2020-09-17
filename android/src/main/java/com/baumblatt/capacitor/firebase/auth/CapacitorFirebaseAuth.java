package com.baumblatt.capacitor.firebase.auth;

import android.content.Intent;
import android.util.Log;
import android.util.SparseArray;

import androidx.annotation.NonNull;

import com.baumblatt.capacitor.firebase.auth.R;
import com.baumblatt.capacitor.firebase.auth.handlers.AppleProviderHandler;
import com.baumblatt.capacitor.firebase.auth.handlers.FacebookProviderHandler;
import com.baumblatt.capacitor.firebase.auth.handlers.GoogleProviderHandler;
import com.baumblatt.capacitor.firebase.auth.handlers.PhoneProviderHandler;
import com.baumblatt.capacitor.firebase.auth.handlers.ProviderHandler;
import com.baumblatt.capacitor.firebase.auth.handlers.TwitterProviderHandler;
import com.getcapacitor.CapConfig;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.HashMap;
import java.util.Map;

@NativePlugin(requestCodes = {
        GoogleProviderHandler.RC_GOOGLE_SIGN_IN,
        FacebookProviderHandler.RC_FACEBOOK_LOGIN
})
public class CapacitorFirebaseAuth extends Plugin {
    public static final String CONFIG_KEY_PREFIX = "plugins.CapacitorFirebaseAuth.";
    private static final String PLUGIN_TAG = "CapacitorFirebaseAuth";

    private FirebaseAuth firebaseAuth;
    private Map<String, ProviderHandler> providerHandlers = new HashMap<>();
    private SparseArray<ProviderHandler> providerHandlerByRC = new SparseArray<>();

    private boolean nativeAuth = false;

    private CapConfig config;

    public CapConfig getConfig() {
        return this.config;
    }

    public void load() {
        super.load();

        this.config = new CapConfig(this.bridge.getActivity().getAssets(), null);

        String[] providers = this.config.getArray(CONFIG_KEY_PREFIX+"providers", new String[0]);
        this.nativeAuth = this.config.getBoolean(CONFIG_KEY_PREFIX+"nativeAuth", false);
        String languageCode = this.config.getString(CONFIG_KEY_PREFIX+"languageCode", "en");

        // FirebaseApp is not initialized in this process - Error #1
        Log.d(PLUGIN_TAG, "Verifying if the default FirebaseApp was initialized.");
        if(FirebaseApp.getApps(this.getContext()).size() == 0) {
            Log.d(PLUGIN_TAG, "Initializing the default FirebaseApp ");
            FirebaseApp.initializeApp(this.getContext());
        }

        Log.d(PLUGIN_TAG, "Retrieving FirebaseAuth instance");
        this.firebaseAuth = FirebaseAuth.getInstance();
        this.firebaseAuth.setLanguageCode(languageCode);

        for (String provider: providers) {
            if (provider.equalsIgnoreCase(getContext().getString(R.string.google_provider_id))) {
                Log.d(PLUGIN_TAG, "Initializing Google Provider");
                this.providerHandlers.put(provider, new GoogleProviderHandler());
                this.providerHandlers.get(provider).init(this);
                Log.d(PLUGIN_TAG, "Google Provider Initialized");
            } else if (provider.equalsIgnoreCase(getContext().getString(R.string.twitter_provider_id))) {
                Log.d(PLUGIN_TAG, "Initializing Twitter Provider");
                this.providerHandlers.put(provider, new TwitterProviderHandler());
                this.providerHandlers.get(provider).init(this);
                Log.d(PLUGIN_TAG, "Twitter Provider Initialized");
            } else if (provider.equalsIgnoreCase(getContext().getString(R.string.facebook_provider_id))) {
                Log.d(PLUGIN_TAG, "Initializing Facebook Provider");
                this.providerHandlers.put(provider, new FacebookProviderHandler());
                this.providerHandlers.get(provider).init(this);
                Log.d(PLUGIN_TAG, "Facebook Provider Initialized");
            } else if (provider.equalsIgnoreCase(getContext().getString(R.string.apple_provider_id))) {
                Log.d(PLUGIN_TAG, "Initializing Apple Provider");
                this.providerHandlers.put(provider, new AppleProviderHandler());
                this.providerHandlers.get(provider).init(this);
                Log.d(PLUGIN_TAG, "Facebook Apple Initialized");
            } else if (provider.equalsIgnoreCase(getContext().getString(R.string.phone_provider_id))) {
                Log.d(PLUGIN_TAG, "Initializing Phone Provider");
                this.providerHandlers.put(provider, new PhoneProviderHandler());
                this.providerHandlers.get(provider).init(this);
                Log.d(PLUGIN_TAG, "Phone Provider Initialized");
            }
        }

        for (ProviderHandler providerHandler : this.providerHandlers.values()) {
            this.providerHandlerByRC.put(providerHandler.getRequestCode(), providerHandler);
        }
    }

    @PluginMethod()
    public void signIn(PluginCall call) {
        if (!call.getData().has("providerId")) {
            call.reject("The provider id is required");
            return;
        }

        ProviderHandler handler = this.getProviderHandler(call);

        if (handler == null) {
            Log.w(PLUGIN_TAG, "Provider not supported");
            call.reject("The provider is disable or unsupported");
        } else {

            if (handler.isAuthenticated()) {
                JSObject jsResult = this.build(null, call);
                call.success(jsResult);
            } else {
                this.saveCall(call);
                handler.signIn(call);
            }

        }
    }

    @PluginMethod()
    public void signOut(PluginCall call) {
        // sing out from providers
        for (ProviderHandler providerHandler : this.providerHandlers.values()) {
            providerHandler.signOut();
        }

        // sign out from firebase
        FirebaseUser currentUser = this.firebaseAuth.getCurrentUser();
        if (currentUser != null) {
            this.firebaseAuth.signOut();
        }

        call.success();
    }

    @Override
    public void startActivityForResult(PluginCall call, Intent intent, int resultCode) {
        super.startActivityForResult(call, intent, resultCode);
    }

    @Override
    public void notifyListeners(String eventName, JSObject data) {
        super.notifyListeners(eventName, data);
    }

    private ProviderHandler getProviderHandler(PluginCall call) {
        String providerId = call.getString("providerId", null);
        return this.providerHandlers.get(providerId);
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d(PLUGIN_TAG, "Handle on Activity Result");

        final PluginCall savedCall = getSavedCall();
        if (savedCall == null) {
            Log.d(PLUGIN_TAG, "No saved call on activity result.");
            return;
        }

        final ProviderHandler handler = this.providerHandlerByRC.get(requestCode);
        if (handler == null) {
            Log.w(PLUGIN_TAG, "No provider handler with given request code.");
            savedCall.reject("No provider handler with given request code.");
        } else {
            handler.handleOnActivityResult(requestCode, resultCode, data);
        }
    }

    public void handleAuthCredentials(AuthCredential credential) {
        final PluginCall savedCall = getSavedCall();
        if (savedCall == null) {
            Log.d(PLUGIN_TAG, "No saved call on activity result.");
            return;
        }

        if (credential == null) {
            Log.w(PLUGIN_TAG, "Sign In failure: credentials.");
            savedCall.reject("Sign In failure: credentials.");
            return;
        }

        if (this.nativeAuth) {
            nativeAuth(savedCall, credential);
        } else {
            JSObject jsResult = this.build(credential, savedCall);
            savedCall.success(jsResult);
        }
    }

    private void nativeAuth(final PluginCall savedCall, final AuthCredential credential) {
        this.firebaseAuth.signInWithCredential(credential)
                .addOnCompleteListener(this.getActivity(), new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            Log.d(PLUGIN_TAG, "Firebase Sign In with Credential succeed.");
                            FirebaseUser user = firebaseAuth.getCurrentUser();

                            if (user == null) {
                                Log.w(PLUGIN_TAG, "Ops, no Firebase user after Sign In with Credential succeed.");
                                savedCall.reject("Ops, no Firebase user after Sign In with Credential succeed");
                            } else {
                                JSObject jsResult = build(credential, savedCall);
                                savedCall.success(jsResult);
                            }
                        } else {
                            // If sign in fails, display a message to the user.
                            Log.w(PLUGIN_TAG, "Firebase Sign In with Credential failure.", task.getException());
                            savedCall.reject("Firebase Sign In with Credential failure.");
                        }
                    }
                }).addOnFailureListener(this.getActivity(), new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception ex) {
                        // If sign in fails, display a message to the user.
                        Log.w(PLUGIN_TAG, "Firebase Sign In with Credential failure.", ex);
                        savedCall.reject("Firebase Sign In with Credential failure.");

                    }
        });
    }

    public void handleFailure(String message, Exception e) {
        PluginCall savedCall = getSavedCall();
        if (savedCall == null) {
            Log.d(PLUGIN_TAG, "No saved call on handle failure.");
            return;
        }

        if (e != null) {
            savedCall.reject(message, e);
        } else {
            savedCall.reject(message);
        }
    }

    private JSObject build(AuthCredential credential, PluginCall call) {
        Log.d(PLUGIN_TAG, "Building authentication result");

        JSObject jsResult = new JSObject();
        jsResult.put("callbackId", call.getCallbackId());
        jsResult.put("providerId", call.getString("providerId"));

        ProviderHandler handler = this.getProviderHandler(call);
        if (handler != null) {
            handler.fillResult(credential, jsResult);
        }

        return jsResult;
    }
}
