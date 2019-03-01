package com.baumblatt.capacitor.firebase.auth;

import android.content.Intent;
import android.support.annotation.NonNull;
import android.util.Log;
import android.util.SparseArray;

import com.baumblatt.capacitor.firebase.auth.handlers.GoogleProviderHandler;
import com.baumblatt.capacitor.firebase.auth.handlers.ProviderHandler;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.HashMap;
import java.util.Map;

@NativePlugin(requestCodes = {GoogleProviderHandler.RC_GOOGLE_SIGN_IN})
public class CapacitorFirebaseAuth extends Plugin {
    private static final String PLUGIN_TAG = "CapacitorFirebaseAuth";

    private FirebaseAuth mAuth;
    private Map<String, ProviderHandler> providerHandlers = new HashMap<>();
    private SparseArray<ProviderHandler> providerHandlerByRC = new SparseArray<>();

    public void load() {
        super.load();

        //TODO Get the Firebase App
        Log.d(PLUGIN_TAG, "Retrieving FirebaseAuth instance");
        this.mAuth = FirebaseAuth.getInstance();

        Log.d(PLUGIN_TAG, "Initializing Google Provider");
        String provider = getContext().getString(R.string.google_provider_id);
        this.providerHandlers.put(provider, new GoogleProviderHandler());
        this.providerHandlers.get(provider).init(this.getContext(), this.getActivity());
        Log.d(PLUGIN_TAG, "Google Provider Initialized");

        for (ProviderHandler providerHandler : this.providerHandlers.values()) {
            this.providerHandlerByRC.put(providerHandler.getRequestCode(), providerHandler);
        }
    }

    @PluginMethod()
    public void signIn(PluginCall call) {
        if (!call.getData().has("provider")) {
            call.reject("The provider is required");
            return;
        }

        JSObject provider = call.getObject("provider", new JSObject());
        String providerId = provider.getString("providerId", null);

//        FirebaseUser currentUser = this.mAuth.getCurrentUser();
//        if (currentUser != null) {
//            CapacitorFirebaseAuth.parseUser(currentUser, call, this.getActivity());
//            return;
//        }

        ProviderHandler handler = this.providerHandlers.get(providerId);

        if (handler == null) {
            Log.w(PLUGIN_TAG, "Provider not supported");
            call.reject("Provider not supported");
        } else {
            this.signIn(handler, call);
        }
    }

    @PluginMethod()
    public void signOut(PluginCall call) {
        if (!call.getData().has("provider")) {
            call.reject("The provider is required");
            return;
        }

        ProviderHandler handler = this.getProviderHandler(call);

        if (handler != null) {
            handler.signOut();
        }

        FirebaseAuth.getInstance().signOut();
        call.success();
    }

    private void signIn(ProviderHandler handler, PluginCall call) {
        Log.d(PLUGIN_TAG, "Get SignIn Intent");
        Intent intent = handler.getIntent();

        Log.d(PLUGIN_TAG, "Start Activity for Result");
        startActivityForResult(call, intent, handler.getRequestCode());
    }

    private ProviderHandler getProviderHandler(PluginCall call) {
        JSObject provider = call.getObject("provider", new JSObject());
        String providerId = provider.getString("providerId", null);

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
            final String idToken = handler.getIdToken(data);
            AuthCredential credential = handler.getAuthCredential(data);

            if (credential == null) {
                Log.w(PLUGIN_TAG, "Sign In failure: credentials.");
                savedCall.reject("Sign In failure: credentials.");
            } else {
                FirebaseAuth.getInstance().signInWithCredential(credential)
                        .addOnCompleteListener(this.getActivity(), new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if (task.isSuccessful()) {
                                    // Sign in success, update UI with the signed-in user's information
                                    Log.d(PLUGIN_TAG, "Firebase Sign In with Credential succeed.");
                                    FirebaseUser user = mAuth.getCurrentUser();

                                    if (user == null) {
                                        Log.w(PLUGIN_TAG, "Ops, no Firebase user after Sign In with Credential succeed.");
                                        savedCall.reject("Ops, no Firebase user after Sign In with Credential succeed");
                                    } else {
                                        CapacitorFirebaseAuth.parseUser(idToken, user, savedCall);
                                    }
                                } else {
                                    // If sign in fails, display a message to the user.
                                    Log.w(PLUGIN_TAG, "Firebase Sign In with Credential failure.", task.getException());
                                    savedCall.reject("Firebase Sign In with Credential failure.");
                                }
                            }
                        });
            }

        }
    }

    private static void parseUser(String token, FirebaseUser user, PluginCall call) {
        Log.d(PLUGIN_TAG, "Parsing Firebase user.");

        JSObject jsUser = new JSObject();
        jsUser.put("providerId", user.getProviderId());
        jsUser.put("displayName", user.getDisplayName());
        jsUser.put("idToken", token);

        Log.d(PLUGIN_TAG, "Firebase user parsed.");
        call.success(jsUser);

    }
}
