package com.baumblatt.capacitor.firebase.auth.handlers;

import android.content.Intent;

import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;

public class PhoneProviderHandler implements ProviderHandler {
    @Override
    public void init(CapacitorFirebaseAuth plugin) {

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
