package com.aibangsong.abs;

import org.apache.cordova.CordovaWebView;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.aibangsong.abs.push.MQTTService;
import com.aibangsong.abs.push.Thermometer;

public class NotificationClient {
	private static final String TAG ="NotificationClient";

    private Context context = null;
    private CordovaWebView view = null;
    private String callback = "";

    public NotificationClient(Context context, CordovaWebView view) {

		  this.context = context;
		  this.view = view;

    }

    @JavascriptInterface
    public void notify(String recevierIdentity,String message) {

          Log.d(TAG, "register(message: " + message + ", callback:" + callback + " )");
          Toast.makeText(context, message, Toast.LENGTH_LONG)
			.show();
          Thermometer thermometer = new Thermometer(message,recevierIdentity);
          thermometer.start();
    }
    
    @JavascriptInterface
    public void startService(String identity) {

    	Intent intent = new Intent(context, MQTTService.class);
    	intent.putExtra("identity", identity);
    	
    	context.startService(intent);
  }

    public void checkMessage() {
        new Handler().post(new Runnable() {
			public void run() {
			     view.sendJavascript(callback);
			}
        });
    }
}
