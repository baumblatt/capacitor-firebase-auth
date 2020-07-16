package com.baumblatt.capacitor.firebase.auth.handlers;

import android.content.Intent;
import android.util.Log;

import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.FacebookAuthProvider;

public class FacebookProviderHandler implements ProviderHandler {
    private static final String FACEBOOK_TAG = "FacebookProviderHandler";
    public static final int RC_FACEBOOK_LOGIN = 0xface;

    private CapacitorFirebaseAuth plugin;
    private CallbackManager mCallbackManager;
    private LoginButton loginButton;


    @Override
    public void init(final CapacitorFirebaseAuth plugin) {
        this.plugin = plugin;

        try {
            this.loginButton = new LoginButton(this.plugin.getContext());
            this.loginButton.setPermissions("email", "public_profile");

            this.mCallbackManager = CallbackManager.Factory.create();

            this.loginButton.registerCallback(mCallbackManager, new FacebookCallback<LoginResult>() {
                @Override
                public void onSuccess(LoginResult loginResult) {
                    Log.d(FACEBOOK_TAG, "facebook:onSuccess:" + loginResult);
                    handleFacebookAccessToken(loginResult.getAccessToken());
                }

                @Override
                public void onCancel() {
                    Log.d(FACEBOOK_TAG, "facebook:onCancel");
                    plugin.handleFailure("Facebook Sign In cancel.", null);
                }

                @Override
                public void onError(FacebookException error) {



                    Log.d(FACEBOOK_TAG, "facebook:onError", error);
                    plugin.handleFailure("Facebook Sign In failure.", error);
                }
            });

        } catch (FacebookException error) {
            Log.w(FACEBOOK_TAG, "Facebook initialization error, review your configs", error);
        }
    }

    private void handleFacebookAccessToken(AccessToken token) {
        AuthCredential credential = FacebookAuthProvider.getCredential(token.getToken());
        this.plugin.handleAuthCredentials(credential);
    }

    @Override
    public void signIn(PluginCall call) {
        this.loginButton.performClick();
    }

    @Override
    public void signOut() {
        LoginManager.getInstance().logOut();
    }

    @Override
    public int getRequestCode() {
        return FacebookProviderHandler.RC_FACEBOOK_LOGIN;
    }

    @Override
    public void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        // Pass the activity result back to the Facebook SDK
        mCallbackManager.onActivityResult(requestCode, resultCode, data);
    }


    @Override
    public boolean isAuthenticated() {
        AccessToken accessToken = AccessToken.getCurrentAccessToken();
        return accessToken != null && !accessToken.isExpired();
    }

    @Override
    public void fillResult(AuthCredential credential, JSObject jsResult) {
        AccessToken accessToken = AccessToken.getCurrentAccessToken();
        if(accessToken != null && !accessToken.isExpired()) {
            jsResult.put("idToken", accessToken.getToken());
        }
    }
}
