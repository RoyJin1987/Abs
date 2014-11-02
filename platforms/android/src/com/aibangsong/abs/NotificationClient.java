package com.aibangsong.abs;

import java.io.IOException;
import java.io.InputStream;

import org.apache.cordova.CordovaWebView;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.Display;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.aibangsong.abs.push.MQTTService;
import com.aibangsong.abs.push.Thermometer;

public class NotificationClient {
	private static final String TAG ="NotificationClient";

    private Context context = null;
    private CordovaWebView view = null;
    private static String callback = "";
    
    
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
    public void selectCity(String callback) {
    	this.callback =callback;
    	AppManager.getAppManager().currentActivity().runOnUiThread(new Runnable() {
            public void run() {
        		Dialog dialog = new AddressPickerDialog(context,
    					dialogListener,"","","",Abs.country);
    			dialog.setTitle("请选择地区");
    			
    			dialog.show();
    			WindowManager m = AppManager.getAppManager().currentActivity().getWindowManager();
    			Display d = m.getDefaultDisplay(); // 获取屏幕宽、高用
    			Window dialogWindow = dialog.getWindow();
    			WindowManager.LayoutParams p = dialogWindow.getAttributes(); // 获取对话框当前的参数值
    			//p.height = (int) (d.getHeight() * 0.5); // 高度设置为屏幕的0.6
    			p.width = (int) (d.getWidth()); // 宽度设置为屏幕的0.65
    			p.x = 0;
    			p.y = 0;
    			dialogWindow.setAttributes(p);
            }
        });
    }
    
    
	
	Handler addressHandler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			//pd.dismiss();
			// 初始化一个自定义的Dialog
			
			 
			
		
			
		}
	};
    
	DialogListener dialogListener = new DialogListener() {

		@Override
		public void setAddress(String provinceCode, String province,
				String cityCode, String city, String countyCode, String county) {
			String address = province+ " " + city+ " "+ county;
			view.sendJavascript(callback+ "(" +city + "," +  county + ")");
		}
	};
	
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
