package com.baumblatt.capacitor.firebase.auth.handlers;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import com.google.firebase.auth.AuthCredential;

public interface ProviderHandler {
    void init(Context context, Activity activity);
    Intent getIntent();
    int getRequestCode();
    AuthCredential getAuthCredential(Intent data);
    String getIdToken(Intent data);
    void signOut();
}
