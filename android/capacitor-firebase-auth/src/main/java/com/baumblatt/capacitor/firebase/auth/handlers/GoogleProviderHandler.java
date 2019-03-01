package com.baumblatt.capacitor.firebase.auth.handlers;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.util.Log;

import com.baumblatt.capacitor.firebase.auth.R;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInStatusCodes;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.GoogleAuthProvider;

public class GoogleProviderHandler implements ProviderHandler, GoogleApiClient.OnConnectionFailedListener {
    public static final int RC_GOOGLE_SIGN_IN = 9001;
    private static final String GOOGLE_TAG = "GoogleProviderHandler";

    private GoogleSignInClient mGoogleSignInClient;

    @Override
    public int getRequestCode() {
        return RC_GOOGLE_SIGN_IN;
    }

    @Override
    public void init(Context context, Activity activity) {
        GoogleApiAvailability googleAPI = GoogleApiAvailability.getInstance();
        int result = googleAPI.isGooglePlayServicesAvailable(context);
        if (result == ConnectionResult.SUCCESS) {
            Log.d(GOOGLE_TAG, "Google Api is Available.");
        } else {
            Log.w(GOOGLE_TAG, "Google Api is not Available.");
        }

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(context.getString(R.string.default_web_client_id))
                .requestEmail()
                .build();

        this.mGoogleSignInClient = GoogleSignIn.getClient(activity, gso);
    }

    @Override
    public Intent getIntent() {
        return this.mGoogleSignInClient.getSignInIntent();
    }

    @Override
    public String getIdToken(Intent data) {
        try {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);

            // Google Sign In was successful, authenticate with Firebase
            GoogleSignInAccount account = task.getResult(ApiException.class);

            if(account != null) {
                Log.d(GOOGLE_TAG, "Google Sign In succeed.");
                return account.getIdToken();
            }

        } catch (ApiException e) {
            // Google Sign In failed, update UI appropriately
            Log.w(GOOGLE_TAG, GoogleSignInStatusCodes.getStatusCodeString(e.getStatusCode()), e);


        }

        // Google Sign In failed, update UI appropriately
        Log.w(GOOGLE_TAG, "Google Sign In failed.");
        return null;
    }

    @Override
    public AuthCredential getAuthCredential(Intent data)  {
        try {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);

            // Google Sign In was successful, authenticate with Firebase
            GoogleSignInAccount account = task.getResult(ApiException.class);

            if(account != null) {
                Log.d(GOOGLE_TAG, "Google Sign In succeed.");
                return GoogleAuthProvider.getCredential(account.getIdToken(), null);
            }

        } catch (ApiException e) {
            // Google Sign In failed, update UI appropriately
            Log.w(GOOGLE_TAG, GoogleSignInStatusCodes.getStatusCodeString(e.getStatusCode()), e);


        }

        // Google Sign In failed, update UI appropriately
        Log.w(GOOGLE_TAG, "Google Sign In failed.");
        return null;
    }

    @Override
    public void signOut() {
        this.mGoogleSignInClient.signOut();
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Log.i(GOOGLE_TAG, "Unresolvable failure in connecting to Google APIs");
    }
}
