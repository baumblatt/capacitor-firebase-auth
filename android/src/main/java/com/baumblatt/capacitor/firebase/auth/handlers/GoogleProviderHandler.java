package com.baumblatt.capacitor.firebase.auth.handlers;

import android.content.Intent;

import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import com.getcapacitor.Config;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;

import static com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth.CONFIG_KEY_PREFIX;

public class GoogleProviderHandler implements ProviderHandler {
    public static final int RC_GOOGLE_SIGN_IN = 9001;
    private static final String GOOGLE_TAG = "GoogleProviderHandler";

    private CapacitorFirebaseAuth plugin;
    private GoogleSignInClient mGoogleSignInClient;

    @Override
    public void init(CapacitorFirebaseAuth plugin) {
        this.plugin = plugin;

        String[] permissions = Config.getArray(CONFIG_KEY_PREFIX + "permissions.google", new String[0]);

    }

    @Override
    public void signIn(PluginCall call) {

    }

    @Override
    public void signOut() {

    }

    @Override
    public int getRequestCode() {
        return 0;
    }

    @Override
    public void handleOnActivityResult(int requestCode, int resultCode, Intent data) {

    }

    @Override
    public boolean isAuthenticated() {
        return false;
    }

    @Override
    public void fillResult(JSObject object) {

    }
}
