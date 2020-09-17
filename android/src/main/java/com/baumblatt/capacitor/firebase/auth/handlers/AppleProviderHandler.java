package com.baumblatt.capacitor.firebase.auth.handlers;

import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.OAuthProvider;

import java.lang.reflect.Method;

public class AppleProviderHandler implements ProviderHandler, OnSuccessListener<AuthResult>, OnFailureListener {
    private static final String APPLE_TAG = "AppleProviderHandler";
    public static final int RC_APPLE_SIGN_IN = 8001;

    private CapacitorFirebaseAuth plugin;
    private FirebaseAuth firebaseAuth;
    private OAuthProvider.Builder provider;

    @Override
    public void init(CapacitorFirebaseAuth plugin) {
        this.plugin = plugin;

        String languageCode = this.plugin.getConfig().getString(CapacitorFirebaseAuth.CONFIG_KEY_PREFIX +"languageCode", "en");

        this.provider = OAuthProvider.newBuilder("apple.com");
        this.provider.addCustomParameter("lang", languageCode);
        this.firebaseAuth = FirebaseAuth.getInstance();
    }

    @Override
    public void signIn(PluginCall call) {
        Log.d(APPLE_TAG, "Apple SignIn starts..");
        Task<AuthResult> pendingResultTask = firebaseAuth.getPendingAuthResult();

        if (pendingResultTask != null) {
            // There's something already here! Finish the sign-in for your user.
            pendingResultTask.addOnSuccessListener(this).addOnFailureListener(this);
        } else {
            firebaseAuth.startActivityForSignInWithProvider(this.plugin.getActivity(), provider.build())
                    .addOnSuccessListener(this)
                    .addOnFailureListener(this);
        }
    }

    @Override
    public void onSuccess(AuthResult authResult) {
        this.plugin.handleAuthCredentials(authResult.getCredential());
    }

    @Override
    public void onFailure(@NonNull Exception exception) {
        Log.w(APPLE_TAG, "appleLogin:failure", exception);
        plugin.handleFailure("Apple Sign In failure.", exception);
    }

    @Override
    public void signOut() {
        // there is nothing to do here
        Log.d(APPLE_TAG, "AppleProviderHandler.signOut called.");
    }

    @Override
    public int getRequestCode() {
        // there is nothing to do here
        Log.d(APPLE_TAG, "AppleProviderHandler.getRequestCode called.");
        return RC_APPLE_SIGN_IN;
    }

    @Override
    public void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        // there is nothing to do here
        Log.d(APPLE_TAG, "AppleProviderHandler.signOut called.");
    }

    @Override
    public boolean isAuthenticated() {
        FirebaseUser user = firebaseAuth.getCurrentUser();
        return user != null &&  "apple.com".equals(user.getProviderId());
    }

    @Override
    public void fillResult(AuthCredential credential, JSObject jsResult) {
        if (credential != null) {
            jsResult.put("idToken", this.getCredentialParts(credential, "getAccessToken"));
            jsResult.put("rawNonce", this.getCredentialParts(credential, "getRawNonce"));
        }
    }

    private String getCredentialParts(AuthCredential credential, String methodName) {
        try {
            Method method = credential.getClass().getMethod(methodName);
            return (String) method.invoke(credential);
        } catch (Exception e) {
            Log.d(APPLE_TAG, String.format("Fail to get %s from credentials.", methodName));
            return "";
        }
    }

}
