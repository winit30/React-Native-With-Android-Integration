# React-Native-With-Android-Integration

## Key Concepts

1. Set up React Native dependencies and directory structure.
2. Develop your React Native components in JavaScript.
3. Add a ```ReactRootView``` to your Android app. This view will serve as the container for your React Native component.
4. Start the React Native server and run your native application.
5. Verify that the React Native aspect of your application works as expected.

## Pre-requisite

1. React Native setup in your system. 
2. Android Studio setup with the latest version of JDK.
3. An existing Android project ( for this article we will be using **AwesomeApp** ).

## Step 1 : Re-structuring the existing project

Create a folder **/android** inside the root directory of the existing project ( in AwesomeApp folder).

Now move everything to the android folder using cut and paste. So the existing project files will live at the path **/AwesomeApp/android/<project files>**.

Now, you can open **/AwesomeApp/android** in Android Studio to write the Android Native code.

## Step 2 : Install JavaScript dependencies

Now, move back to root directory **/AwesomeApp** and create a file named **package.json** and paste the following code inside it.

```
{
  "name": "AwesomeReactApp",  //name of your react app
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start"
  }
}
```

It’s time to install the react and react-native packages in our project. So, open a terminal inside the root directory **/AwesomeApp** and run the following command.

```
npm install --save react react-native
```

This will create a new **/node_modules** folder inside the root directory. This folder contains all the javascript packages required to run the app.

## Step 3 : Integrating React Native in the project

Open the **AwesomeApp/android** folder in Android Studio.

### Configuring Maven 

Add the following dependency to the **/app/build.gradle** of the existing project.

```
compile "com.facebook.react:react-native:+"
```

Add an entry for the local React Native maven directory to build.gradle. Be sure to add it to the "allprojects" block and add it to **android/build.gradle**, not to **android/app/build.gradle**.

```
maven {
    url "<PATH TO YOUR ROOT DIRECTORY>/AwesomeApp/node_modules/react-native/android"
}
```

So, the **android/build.gradle** looks like this now.

```
allprojects {
    repositories {
        jcenter()
        maven { url 'https://maven.google.com' }
        maven {
            url "$rootDir/../node_modules/react-native/android"
        }
    }
}
```

Now, sync the project in Android Studio. If you get any error please resolve it before proceeding to next step.

### Adding permissions

Open **AndroidManifest.xml** in Android Studio which can be located at path **android/app/src/main/AndroidManifest.xml**. Add the following permission to it.

```
<uses-permission android:name="android.permission.INTERNET" />
```

### Code Integration

Create **index.android.js** file inside the root directory **/AwesomeApp**. This is the entry point of the React Native app.

Add the following code inside ```index.android.js```

```
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

class HelloUser extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.hello}>Hey! How are you?</Text>
      </View>
    )
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  hello: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

AppRegistry.registerComponent('AwesomeReactApp', () => HelloUser);
```

Make sure you write the same project name in AppRegistry.registerComponent() as written in package.json.

Now, we will write the **MyReactActivity** which will render the React Native App. So, create a new Activity MyReactActivity using Android Studio and add the following code inside it.

```
package com.example.myapplication;

import android.annotation.TargetApi;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.bridge.Callback;

import org.reactnative.camera.RNCameraPackage;
import javax.annotation.Nullable;

public class MyReactActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler, PermissionAwareActivity {
    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    private @Nullable   Callback mPermissionsCallback;
    private @Nullable PermissionListener mPermissionListener;
    @Nullable
    private PermissionListener permissionListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        SoLoader.init(this, /* native exopackage */ false);
        String userName = getIntent().getStringExtra("USER_NAME");
        Bundle initialProps = new Bundle();
        initialProps.putString("userName", userName);
        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index.android")
                .addPackage(new MainReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.BEFORE_CREATE)
                .build();
        mReactRootView.startReactApplication(mReactInstanceManager, "AwesomeReactApp", initialProps);

        setContentView(mReactRootView);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
    }

    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }


    @Override
    @TargetApi(Build.VERSION_CODES.M)
    public void requestPermissions(String[] permissions, int requestCode, PermissionListener listener) {
        mPermissionListener = listener;
        requestPermissions(permissions, requestCode);
    }
    @Override
    public void onRequestPermissionsResult(final int requestCode, @NonNull final String[] permissions, @NonNull final int[] grantResults) {
        mPermissionsCallback = new Callback() {
            @Override
            public void invoke(Object... args) {
                if (mPermissionListener != null && mPermissionListener.onRequestPermissionsResult(requestCode, permissions, grantResults)) {
                    mPermissionListener = null;
                }
            }
        };
    }

}
```

Also, change the theme of this activity as some of the components use this special theme. So, inside the **AndroidManifest.xml** update/add the following code.

```
<activity
  android:name=”.MyReactActivity” 
  android:label=”My React Activity”  
  android:theme=”@style/Theme.AppCompat.Light.NoActionBar”></activity>
```

### Opening React App

For opening our React Native page, we will create a button on the MainActivity page and onclick on that button we will navigate user to the React Native Page.
For creating a button on the MainActivity, open **activity_main.xml** form **android/app/src/main/res/layout/activity_main.xml** and paste the following code in it.

```
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <Button
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Open React Native Activity"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        android:onClick="openRNActivity" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

In your **MainActivity.java**, add the following code below **onCreate** method to open the React Native page.

```
public void openRNActivity(View view) {
    Intent intent = new Intent(this, MyReactActivity.class);
    intent.putExtra("USER_NAME", "Gaurav Singh");
    startActivity(intent);
}
```

Create an **/assets** folder inside **/android/app/src/main** and open terminal inside the root directory /AwesomeApp and run the following command.

```
react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

Congratulations! You are done with the setup. Now open your emulator and run the app from android studio.

## Adding a plugin (For Example ```react-native-camera```)

**Note** : Automatic Linking will not work with this setup. We always have to do manual linking if a plugin requires.

The manual linking for all the plugin (which requires linking) will be same except one step. We do not have MainApplication.java file here,
so we will adding the plugin package in our MyReactActivity.java file inside our **onCreate** method.

For example, we will be adding ```react-native-camera``` package in our **MyReactActivity.java** below **MainReactPackage()** which will look like

```
protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        SoLoader.init(this, /* native exopackage */ false);
        String userName = getIntent().getStringExtra("USER_NAME");
        Bundle initialProps = new Bundle();
        initialProps.putString("userName", userName);
        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index.android")
                .addPackage(new MainReactPackage())
                
                .addPackage(new RNCameraPackage()) // This is where your packageName will be mentioned. Make sure to import it above.
                
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.BEFORE_CREATE)
                .build();
        mReactRootView.startReactApplication(mReactInstanceManager, "AwesomeReactApp", initialProps);

        setContentView(mReactRootView);
    }
```

Rest all manual linking steps will be same as given on the plugin documentation page and you will easily find the corresponding files in the android folder which we have created.

Happy Coding!



