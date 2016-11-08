package com.commonTools;

import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/*import com.tcpaydls.BuildConfig;*/

public class RCTCommonTools extends ReactContextBaseJavaModule {

  public RCTCommonTools(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RCTCommonTools";
  }

  @ReactMethod
  public void onBackPressed() {
    Intent setIntent = new Intent(Intent.ACTION_MAIN);
    setIntent.addCategory(Intent.CATEGORY_HOME);
    setIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getCurrentActivity().startActivity(setIntent);

  }
}