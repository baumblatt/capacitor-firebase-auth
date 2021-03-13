
[![npm version](https://badge.fury.io/js/capacitor-firebase-auth.svg)](https://badge.fury.io/js/capacitor-firebase-auth)

# capacitor-firebase-auth

Capacitor plugin for Firebase Authentication that handle the authentication on Native layer and propagate the token to the web view layer. After the sign-in process completes, the user will be signed in within both tiers.

Authenticating on the native layer is useful if you have another plugin that also needs authentication. But even if you don't need it, it does not negatively affect performance.

The plugin supports Google, Twitter, Facebook, Apple and Phone providers in Android, iOS and Web.

## Tracking the Work in Progress

| Platform   |   Google   |  Facebook | Twitter   | Phone     | Apple     | Email/Pass |
|:-----------|:----------:|:---------:|:---------:|:---------:|:---------:|:----------:|
| Android    |  ✅  |  ✅  |  ✅  |  ✅  |  🚧  |  🧠  | 
| iOS        |  ✅  |  ✅  |  ✅  |  ✅  |  ✅  |  🧠  | 
| Web        |  ✅  |  ✅  |  ✅  |  🧠  |  🧠  |  🧠  | 

✅ - Ready  
🚧 - Work in progress  
🧠 - Thinking about, date to be defined  

## Important notes for upgrading between minor or major versions.

#### from 2.x.y to 2.4.x
> Use of Firebase ^8.0.0
> Please, for a while read the instructions on issues #128.
> This is the last release before Capacitor 3.

#### from 2.2.x to 2.3.x
> Requires Capacitor Framework v2.2.1 or newer. This is another episode of the Capacitor Framework braking changes 
> on Android platform (com.getcapacitor.Config, now com.getcapacitor.CapConfig).

> Really sorry about braking changes in minor release, but I want to follow major version of the Capacitor Framework. 

#### from 2.0.x to 2.2.x 
> You need to use version 2.2.0 of the Capacitor Framework due braking changes on Android platform (com.getcapacitor.Config)

#### from 0.3.x to 2.0.0
> Sorry about that, but there is no path to do it, I my case, me and my team decided to re-build the projects from scratch, this does not mean code 
> rewrite, just a project, configurations and build. The good news is, there is no change on Typescript/Javascript/Java/Swift facades.

> Anyway, you can make a try with Capacitor Framework update instructions:
>[From <= 1.5.1 to 2.0.0](https://capacitorjs.com/docs/android/updating#from-1-5-1-to-2-0-0)

#### from 0.2.x to 0.3.0: esModuleInterop

> The firebase import was changed using `esModuleInterop`, that was a [Stencil](https://stenciljs.com) requirements, please see issue [#38](https://github.com/baumblatt/capacitor-firebase-auth/issues/38).

```
1 import * as firebase from 'firebase/app';
         ~~~~~~~~
    8601 export = firebase;
         ~~~~~~~~~~~~~~~~~~
    This module is declared with using 'export =', and can only be used with a default import when using the 'allowSyntheticDefaultImports' flag.
```
If you see the message above, please use `esModuleInterop=true` in your  `tsconfig.json` file.

#### from 0.1.x to 0.2.0: GoogleSignIn 5.0.0
> Required GoogleSignIn 5.0.0 on iOS platform, run `pod update` if using lower version.


## Next steps

1. Test for Apple provider for Android
2. Apple provider for Web
3. Link social accounts
4. Email/Password Provider

> Should we do this? It's very simple to authenticate on WebView without any plugin. 
> For awhile, waiting a good reason to do it. (track interest on Issue #24)

### How to Install

Install the plugin into your Capacitor project with npm.

```
npm install --save capacitor-firebase-auth
```

> Don't forget to run `npx cap sync` once after the installation to propagate the plugin to native projects. 
 
### How to Config

### The minimal version of some peer dependencies that breaks with previous versions

- FBSDKCoreKit 5.0.0 (see issue #12)
- FBSDKLoginKit 5.0.0 (see issue #12)
- GoogleSignIn 5.0.0 (see issue #14 and #15)

## Capacitor Plugins

1. In file `capacitor.config.json` config the providers list, language code and native authentication as desired
    ```
    [...]
      "plugins": {
        "CapacitorFirebaseAuth": {
          "providers": ["google.com", "twitter.com", "facebook.com", "phone"],
          "languageCode": "en",
          "nativeAuth": false,
          "properties": {
            "google": {
                "hostedDomain": "my-custom-domain.com"
            }
          },   
          "permissions": {
               "google": ["profile", "https://www.googleapis.com/auth/drive", ...]
           }
        }
      }
    [...]
    ```
   > Note: `nativeAuth` is a feature supported for Google, Twitter and Facebook (not Phone or Apple) to sign the user on the native layer too.
   >> This is useful if you need to handle any feature provided by another plugin that needs authentication.
    
   > Note 2: Don't forget to remove `hosted domain` properties from Google SignIn in case you don't need it. 
   > See more [here](https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInOptions.Builder#parameters_6)
   > about this feature.

2. In file `android/app/src/main/java/.../MainActivity.java` add the reference to the Capacitor Firebase Auth plugin inside the Bridge initialization.
    ```
    [...]
    import com.baumblatt.capacitor.firebase.auth.CapacitorFirebaseAuth;
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(CapacitorFirebaseAuth.class);
    }});
    [...]
    ```
    
3. For Typescript users, please, review your `tsconfig.json` and ensure that you are using `esModuleInterop=true`.

## Firebase

1. Follow instructions to add Firebase to your native project:
    * [Add Firebase to your Android project](https://firebase.google.com/docs/android/setup)
    * [Add Firebase to your iOS project ](https://firebase.google.com/docs/ios/setup)
2. If you haven't yet connected your app to your Firebase project, do so from the [Firebase console](https://console.firebase.google.com/).
    * Please, don't forgot your Google Service _.json_ or _.plist_ file or your app will crash on the startup.

#### Extra steps for iOS

1. Add a URL scheme to your project (iOS only)
    * See the official [documentation here](https://developers.google.com/identity/sign-in/ios/start-integrating#add_a_url_scheme_to_your_project).

2. Add the `Firebase/Auth` pod to the `Podfile` in `ios/App` like this:

```
target 'App' do
  capacitor_pods
  # Add your Pods here
  pod 'Firebase/Auth'
end
```

#### Extra steps for Android

1. Add Android SHA app hashes to Firebase console (android only)
    * For how to add the hash, check the [documentation here](https://support.google.com/firebase/answer/9137403?hl=en).
    * For _which_ hashes to add:
        * One set is from the local debug keystore which is added by Android Studio
        * Other two sets are from the "Google Play Console" if you go to "Signing" you can find your "upload" keys and your "release" keys

## Google

#### Google global configurations

1. Enable Google Sign-In in the Firebase console:
    * In the [Firebase console](https://console.firebase.google.com/), open the **Auth** section.
    * On the **Sign in method** tab, enable the **Google** sign-in method and click **Save**.
     
#### Google Android specific configurations
    
1. If you haven't yet specified your app's SHA-1 fingerprint, do so from the [Settings page](https://console.firebase.google.com/project/_/settings/general/) of the Firebase console. See [Authenticating Your Client](https://developers.google.com/android/guides/client-auth) for details on how to get your app's SHA-1 fingerprint.

#### Google iOS specific configurations

1. Add custom URL schemes to your Xcode project:
    * Open your project configuration: double-click the project name in the left tree view. Select your app from the **TARGETS** section, then select the **Info** tab, and expand the **URL Types** section.
    * Click the **+** button, and add a `URL scheme` for your reversed client ID. To find this value, open the `GoogleService-Info.plist` configuration file, and look for the `REVERSED_CLIENT_ID` key. Copy the value of that key, and paste it into the **URL Schemes** box on the configuration page. Leave the other fields blank.

## Phone

#### Google iOS specific configurations
Since that Apple using Push Notification service (APNs). You need to have `.p8` key and upload to project FCM config to use phone login or you will get this [Error](https://stackoverflow.com/questions/45091583/invalid-token-when-trying-to-authenticate-phone-number-using-firebase). Do so from the [Settings page](https://console.firebase.google.com/project/_/settings/cloudmessaging/) of the Firebase console. See [Configuring APNs with FCM](https://firebase.google.com/docs/cloud-messaging/ios/certs) for details on how to get your app's P8 key.

## Twitter

#### Twitter global configurations

1. [Register your app](https://apps.twitter.com/) as a developer application on Twitter and get your app's **API Key** and **API Secret**.
2. Enable Twitter Login:
    * In the [Firebase console](https://console.firebase.google.com/), open the **Auth** section
    * On the **Sign in method** tab, enable the **Twitter** sign-in method and specify the **App ID** and **App Secret** you got from Facebook.
    * Then, make sure your Firebase OAuth redirect URI (e.g. _my-app-12345.firebaseapp.com/\_\_/auth/handler_) is set as your Callback URL in your app's settings page on your [Twitter app's config](https://apps.twitter.com/).

#### Twitter Android and iOS specific configurations

1. There isn't any specific configuration on Android and iOs native projects because the use of firebase OAuthProvider.
> Since version 2.0.0 this plugin does not use Twitter Kit anymore, following implementation reference of Firebase Documentation.      

## Facebook

#### Facebook global configurations

1. On the [Facebook for Developers](https://developers.facebook.com/) site, get the **App ID** and an **App Secret** for your app
2. Enable Facebook Login:
    * In the [Firebase console](https://console.firebase.google.com/), open the **Auth** section
    * On the **Sign in method** tab, enable the **Facebook** sign-in method and specify the **App ID** and **App Secret** you got from Facebook.
    * Then, make sure your **OAuth redirect URI** (e.g. _my-app-12345.firebaseapp.com/__/auth/handler_) is listed as one of your OAuth redirect URIs in your Facebook app's settings page on the  [Facebook for Developers](https://developers.facebook.com/) site in the **Product Settings** > **Facebook Login** config.

#### Facebook Android specific configurations 

1. Add the dependency for **Facebook SDK** to your app-level build.gradle file:
    ```
    implementation 'com.facebook.android:facebook-android-sdk:5.15.3'
    ```
2. In file `android/app/src/main/AndroidManifest.xml`, add the following XML elements under `<manifest><application>` :
   
   ```xml
   <meta-data android:name="com.facebook.sdk.ApplicationId"
       android:value="@string/facebook_app_id"/>
   
   <activity
       android:name="com.facebook.FacebookActivity"
       android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"
       android:label="@string/app_name" />
   
   <activity
       android:name="com.facebook.CustomTabActivity"
       android:exported="true">
       <intent-filter>
           <action android:name="android.intent.action.VIEW" />
           <category android:name="android.intent.category.DEFAULT" />
           <category android:name="android.intent.category.BROWSABLE" />
           <data android:scheme="@string/fb_login_protocol_scheme" />
       </intent-filter>
   </activity>
   ```
   
3. In file `android/app/src/main/res/values/ids.xml` add the following lines :
    ```xml
    <string name="facebook_app_id">[APP_ID]</string>
    <string name="fb_login_protocol_scheme">fb[APP_ID]://authorize</string>
    ```
    > Don't forget to replace `[APP_ID]` by your Facebook **App ID**.

#### Facebook iOS specific configurations

1. Add your your `[APP_ID]` and `[APP_NAME]` keys in the file `ios/App/App/Info.plist`.

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        [...]
        <key>FacebookAppID</key>
        <string>[APP_ID]</string>
        <key>FacebookDisplayName</key>
        <string>[APP_NAME]</string>
        [...]
    </dict>
    </plist>    
    ```

2. Add custom URL schemes to your Xcode project:
   * Open your project configuration: double-click the project name in the left tree view. Select your app from the **TARGETS** section, then select the **Info** tab, and expand the **URL Types** section.
   * Click the **+** button, and add a `URL` scheme for the Callback URL of Facebook Kit for iOS. In **URL Schemes** box on the configuration page use `fb[APP_ID]`. Leave the other fields blank.

3. Add the pods that you want to install. You can include a Pod in your Podfile like this:

    ```
    target 'App' do
      capacitor_pods
      # Add your Pods here
        pod 'Firebase/Core'
        pod 'Firebase/Auth'
        pod 'FBSDKCoreKit'
        pod 'FBSDKLoginKit'
    end
    ```

4. Dispatch the designated callback URL to Facebook Kit in your `ios/App/App/AppDelegate.swift` file.

    Facebook SDK
    ```
      import FBSDKCoreKit
    
      ...
    
      func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        
        if let scheme = url.scheme, let host = url.host {
            if scheme == "fb\(String(describing: Settings.appID))" && host == "authorize" {
                return ApplicationDelegate.shared.application(app, open: url, options: options)
            }
        }
        
        return CAPBridge.handleOpenUrl(url, options)
      }
    ```


> Don't forget to replace `[APP_ID]` and `[APP_NAME]` by your Facebook **App ID** and **App Name** respectively.

## Apple

#### Apple global configurations 
1. Follow carefully sections: 
[Before you begin](https://firebase.google.com/docs/auth/ios/apple#before-you-begin), 
[Join the Apple Developer Program](https://firebase.google.com/docs/auth/ios/apple#join-the-apple-developer-program) and
[Configure Sign In with Apple](https://firebase.google.com/docs/auth/ios/apple#configure_sign_in_with_apple)
of Firebase docs.

2. Enable Apple as a sign-in provider, in the [Firebase console](https://console.firebase.google.com/), open the Auth section. On the Sign in method tab, enable the Apple provider. If you are only using Sign In with Apple in an iOS app, you can leave the Service ID, Apple Team ID, private key and key ID fields empty.

#### Apple Android configurations

1. Follow carefully sections:
[Configure Sign In with Apple](https://firebase.google.com/docs/auth/android/apple?authuser=0#configure-sign-in-with-apple)
 
#### Apple iOs configurations 
No additional configurations are required by this plugin.

> Don't forget to enable ```Apple Sign In``` capability for your App on Xcode.

## Usage

#### Sign in

```typescript
import {User} from 'firebase/app'
import {cfaSignIn} from 'capacitor-firebase-auth';

cfaSignIn('google.com').subscribe(
	(user: User) => console.log(user.displayName);
)
```

#### Sign in mapping User to UserInfo
```typescript
 import {cfaSignIn, mapUserToUserInfo} from 'capacitor-firebase-auth';
 import {UserInfo} from 'firebase/app';
 
 cfaSignIn('google.com').pipe(
 	mapUserToUserInfo(),
 ).subscribe(
    (user: UserInfo) => console.log(user.displayName)
 )
```

#### Sign out

```typescript
import {cfaSignOut} from 'capacitor-firebase-auth';

//[...]

cfaSignOut().subscribe()
```

#### Phone Verification

```typescript
import {cfaSignInPhone} from 'capacitor-firebase-auth';

cfaSignInPhone('+16505551234').subscribe((user) => {
  console.log(user.phoneNumber)
})
```

> On iOS platform the observable will complete without emit (like EMPTY), follow the notifications below to sign on Firebase on Web Layer.

#### Notification for Phone Verification step

```typescript
import {cfaSignInPhoneOnCodeSent, cfaSignInPhoneOnCodeReceived} from 'capacitor-firebase-auth';

// [...]

// Android and iOS
cfaSignInPhoneOnCodeSent()
  .subscribe((verificationId) => {
    console.log(verificationId)
  })

// Android Only
cfaSignInPhoneOnCodeReceived()
  .subscribe((event: {verificationId: string, verificationCode: string}) => {
    console.log(`${event.verificationId}:${event.verificationCode}`)
  })

```

Suggestion for web authentication code to iOS, the `verificationCode` must be provided by the user, please see [Firebase documentation](https://firebase.google.com/docs/auth/web/phone-auth#sign-in-the-user-with-the-verification-code) for more information.
```typescript

import firebase from 'firebase/app';

const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);

firebase.auth().signInWithCredential(credential);
```

## Alterantive use of Javascript facade

This implementations of the javascript facade calls, return in addition to the Firebase user 
the information returned by the plugin from the native layer. For example, in Twitter sign in
the token and secret are returned for use with Twitter User API. 

> Specials thanks for [@go-u](https://github.com/go-u), by this suggested improvement, more information please see issue [#23](https://github.com/baumblatt/capacitor-firebase-auth/issues/23)!

#### Sign in

```typescript
import firebase from 'firebase/app';
import {cfaSignIn, SignInResult} from 'capacitor-firebase-auth/alternative'; import {SignInResult} from './definitions';

cfaSignIn('twitter.com').subscribe(
	({userCredential, result}: {userCredential: firebase.auth.UserCredential, result: SignInResult}) => {
		console.log(userCredential.user.displayName);
		console.log(result) // will print (providerId, idToken and secret)
	}
)
```

#### Sign In using direct twitter method

```typescript
import firebase from 'firebase/app';
import {cfaSignInTwitter, TwitterSignInResult} from 'capacitor-firebase-auth/alternative'; import {SignInResult} from './definitions';

cfaSignInTwitter().subscribe(
	({userCredential, result}: {userCredential: firebase.auth.UserCredential, result: TwitterSignInResult}) => {
		console.log(userCredential.user.displayName);
		console.log(result.idToken)
	}
)
```

#### Sign In;  Use credentials for something; and map to UserInfo

```typescript
import {UserInfo} from 'firebase/app'; 
import {cfaSignInTwitter, TwitterSignInResult, mapUserCredentialToUserInfo} from 'capacitor-firebase-auth/alternative'; 
import {tap} from 'rxjs/operators';

cfaSignInTwitter().pipe(
    tap(({result}:{result: TwitterSignInResult}) => console.log(result.idToken)),
    mapUserCredentialToUserInfo(),
).subscribe(
	(user: UserInfo) => console.log(user.displayName)
)
```

## Known limitations

#### Phone Verification

The user will be **signed in** only in web layer. This limitation is due to the **verification code** only works once. So, there is no way to authenticate the user in both layers (native and web) with just one SMS Code.

## Buy me a beer

If you feel that project is useful, please, considered to buy me a beer through [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=GWR8QXSQ7TT8U&item_name=Capacitor+Firebase+Auth&currency_code=BRL&source=url)

Looking forward to enable FUNDING.yml soon.

## History
- Issue #112 - Request hostedDomain support for Google Sign-in
- Issue #63 - Support for Apple Sign In on iOS platform. Android platform maybe work, not tested yet.
- Fix the same issue as in PR #104 but now on 'twitter.provider.ts', maybe there was a change in firebase.js (be sure you are using at least 7.17.1).  
- PR #104 - Update 'facebook.provider.ts' (fix the grap of the access token), thanks to [hiepxanh](https://github.com/hiepxanh)
- PR #99 - Unify firebase imports to recommended syntax, thanks to [Luca Ban](https://github.com/mesqueeb).
- Remove the steps about `JavaVersion.VERSION_1_8` because the plugin does not use Twitter Toolkit anymore.
- Issue #90 - Information about `nativeAuth` feature on readme file.
- PR #82 - Fix  Google silentSignIn crash on Android, this should fix the issue [#69](https://github.com/baumblatt/capacitor-firebase-auth/issues/69)
- PR #95 - Fix version 2.2.1 not compiling: Update to the new Capacitor Config Class, thanks to [Sergio Milici](https://github.com/sergiomilici)
- Issue #84 - Upgrade to Capacitor 2.2.0 - braking changes on com.getcapacitor.Config
- Upgrade to Capacitor 2.0.0
- Issue #66 - Cannot convert value of type 'NSError' to expected argument type 'String?', thanks to [Greg McKelvey](https://github.com/mckelveygreg).
- Issue #38 -  interoperability with [Stencil](https://stenciljs.com), thanks to [Justin Rich](https://github.com/socalrunner).
- Issue #29 - plugin doesn't handle expired tokens
- Issue #23 - Alternative Facade for receive more information from the authentication providers. (fixed a little typo)
- Issue #26 - No callback when error/cancel in Google SignUp.
- Issue #16 - Support for Google Sign In Scopes.
- Issue #14 and Issue #15 - Update ios version to GoogleSignIn 5.0.0
- Issue #13 - Operator to map firebase.User to firebase.userInfo.
- Issue 9#: Support for language configurations (Phone Verification)
- Capacitor v1.1.1
- Better Facade code (Thanks for @trentcrockett contribution).
- Notifications for `On Code Sent` and `On Code Received` from Phone Verification process for Android Platform.
- Notifications for `On Code Sent` from Phone Verification process for iOS Platform (The Firebase does not read the SMS on iOS platform, so there is no way to notify `On Code Received`).
- Providers list in plugin configurations (braking changes - see How to Config - Capacitor Plugin Item 1)
- Dependency updates for android platform (Firebase 17 and Facebook 5)
- Configuration for when authenticate on native layer (default false to avoid double billing)
- Fix the issue 1#: Default FirebaseApp is not initialized on Android platform
- WIP: Phone verification sign in on iOS platform.
- Phone verification sign in on Android platform. 
- How to install and config on Google, Twitter and Facebook.
- Fix to work without Facebook configurations.
- Better sign out implementation.
- Better observable implementations on js facade.
- Facebook Provider authentication in iOS platform
- Facebook Provider authentication in Android platform
- Twitter Provider authentication in iOS platform
- Twitter Provider authentication in Android platform
- The Typescript facade for the plugin
- Google Provider authentication in iOS Platform
- Google Provider authentication in Android platform
- Scaffolding do plugin (npx @capacitor/cli plugin:generate)
