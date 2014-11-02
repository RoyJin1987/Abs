/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.aibangsong.abs;

import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaWebView;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.WebSettings;

import com.aibangsong.abs.push.MQTTService;

public class Abs extends CordovaActivity 
{
	public static Context context;
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
    	CookieManager.setAcceptFileSchemeCookies(true);
        super.onCreate(savedInstanceState);
        super.init();
//        super.setIntegerProperty("splashscreen",
//        		R.drawable.splash);
        // Set by <content src="index.html" /> in config.xml
        appView.getSettings().setJavaScriptEnabled(true);
        appView.addJavascriptInterface(new NotificationClient(this, appView), "notificationClient");
        super.loadUrl(Config.getStartUrl());

//        new AlertDialog.Builder(this).setTitle("复选框").setMultiChoiceItems(
//   		     new String[] { "Item1", "Item2" }, null, null)
//   		     .setPositiveButton("确定", null)
//   		     .setNegativeButton("取消", null).show();
        AppManager.getAppManager().addActivity(this);
        context = this;
//        super.loadUrl("file:///android_asset/www/BaiduJSPopMap.html");
    }
    
    @Override
	public void onDestroy() {
    	final Intent intent = new Intent(this, MQTTService.class);
        stopService(intent);
        super.onDestroy();
	}

}

