package com.example.myapplication;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends Activity {
    /** Called when the activity is first created. */
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1212;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    public void openRNActivity(View view) {
        Intent intent = new Intent(this, MyReactActivity.class);
        intent.putExtra("USER_NAME", "Gaurav Singh");
        startActivity(intent);
    }
}