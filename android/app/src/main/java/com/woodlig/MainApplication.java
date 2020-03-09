package com.woodlig;

import android.app.Application;

import com.arttitude360.reactnative.rnpaystack.RNPaystackPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.smarkets.paypal.RNPaypalPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
        // packages.add(new MainReactPackage(),
        //  packages.add(new FBSDKPackage());
         packages.add(new RNFirebaseFirestorePackage());
         packages.add(new RNFirebaseMessagingPackage());
         packages.add(new RNFirebaseNotificationsPackage());
        return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
