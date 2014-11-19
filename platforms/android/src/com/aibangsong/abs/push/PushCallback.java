package com.aibangsong.abs.push;

import java.text.DecimalFormat;

import org.apache.cordova.CordovaActivity;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttTopic;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Dialog;
import android.content.Context;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

import com.aibangsong.abs.Abs;
import com.aibangsong.abs.AppManager;
import com.aibangsong.abs.R;

public class PushCallback implements MqttCallback {

    private Context context;

    public PushCallback(Context context) {

        this.context = context;

    }

    @Override
    public void connectionLost(Throwable cause) {
        //We should reconnect here
    }

    @Override
    public void messageArrived(MqttTopic topic, MqttMessage message) throws Exception {

//        final NotificationManager notificationManager = (NotificationManager)
//                context.getSystemService(Context.NOTIFICATION_SERVICE);
//
//        final Notification notification = new Notification(R.drawable.icon,
//                "Black Ice Warning!", System.currentTimeMillis());
//
//        // Hide the notification after its selected
//        notification.flags |= Notification.FLAG_AUTO_CANCEL;
//
//        final Intent intent = new Intent(context, Abs.class);
//        final PendingIntent activity = PendingIntent.getActivity(context, 0, intent, 0);
//        notification.setLatestEventInfo(context, "order", 
//                new String(message.getPayload()), activity);
//        notification.number += 1;
//        notificationManager.notify(0, notification);
    	final String messageStr = new String(message.getPayload());
        //((CordovaActivity)Abs.context).loadUrl("file:///android_asset/www/userCenter.html");
        //Abs.context.sendJavascript("window.alert(aaaa)");
//        Abs.context.sendJavascript("alert("+ "'aaaa'" + ")");
    	//dialog();
        
        AppManager.getAppManager().currentActivity().runOnUiThread(new Runnable() {
            public void run() {
            	try {
					dialog(messageStr);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
            }
        });
    	
    }
    
    private void dialog(String message) throws JSONException {

    	JSONObject json= new JSONObject(message);  
    	String type = json.getString("type");
    	
		final Dialog dialog = new Dialog(Abs.context, R.style.JHDialog);
		//设置它的ContentView
		dialog.setContentView(R.layout.dialog_general);
		Button buttonOK = (Button) dialog.findViewById(R.id.dialog_button_ok);
		Button buttonCancel = (Button) dialog.findViewById(R.id.dialog_button_cancel);

		TextView dialogTitle = (TextView) dialog.findViewById(R.id.dialog_title);
		TextView dialogMessage = (TextView) dialog.findViewById(R.id.dialog_message);

		buttonOK.setBackgroundResource(R.drawable.green_style);
		buttonCancel.setBackgroundResource(R.drawable.grey_style);
		
		if ("OrderCompleted".equals(type)){
			final String orderId = json.getString("orderId");
			buttonOK.setText("确定");
			dialogTitle.setText("送货完成");
			dialogMessage.setText("您的订单："+ orderId +"已送货完成。");
			buttonOK.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
				}
			});
		}else if ("OrderConfirmed".equals(type)){
			final String orderId = json.getString("orderId");
			buttonOK.setText("查看我的运单");
			buttonCancel.setText("取消");
			dialogTitle.setText("运单被确定");
			dialogMessage.setText("您的运单："+ orderId +"已被货主确定，请准备送货。");
			buttonOK.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
					((CordovaActivity)Abs.context).loadUrl("file:///android_asset/www/mywaybill.html");
				}
			});
		}else if ("OrderGrabed".equals(type)){
			final String orderId = json.getString("orderId");
			buttonOK.setText("确定");
			buttonCancel.setText("取消");
			dialogTitle.setText("有新的抢单者");
			dialogMessage.setText("您的订单："+ orderId +"有新的抢单者，去我的订单查看？");
			buttonOK.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
					((CordovaActivity)Abs.context).loadUrl("file:///android_asset/www/myOrder.html");
				}
			});
		}else if ("AcceptInviteTeam".equals(type)){
			final String usrName = json.getString("usrName");
			buttonOK.setText("确定");
			buttonCancel.setText("取消");
			dialogTitle.setText("消息提醒");
			dialogMessage.setText(usrName +"已同意加入您的车队，去我的车队查看？");
			buttonOK.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
					((CordovaActivity)Abs.context).loadUrl("file:///android_asset/www/myCarList.html");
				}
			});
		}else if ("InviteTeam".equals(type)){
			final String usrName = json.getString("usrName");
			buttonOK.setText("确定");
			buttonCancel.setText("取消");
			dialogTitle.setText("消息提醒");
			dialogMessage.setText(usrName +"邀请您加入他的车队，去消息中心查看？");
			buttonOK.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
					((CordovaActivity)Abs.context).loadUrl("file:///android_asset/www/messageCenter.html");
				}
			});
		}else{
			final String orderId = json.getString("orderId");
			buttonOK.setText("抢单");
			buttonCancel.setText("取消");
			dialogTitle.setText("有新的订单");
			dialogMessage.setText("是否抢单？");
			buttonOK.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {
					dialog.dismiss();
					((CordovaActivity)Abs.context).loadUrl("file:///android_asset/www/modifyWaybill.html?orderId=" + orderId);
				}
			});
		}
		DecimalFormat df = new DecimalFormat();
		df.setMaximumFractionDigits(2);
		dialog.setCanceledOnTouchOutside(false);
		dialog.show();
		buttonCancel.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				dialog.dismiss();
			}
		});
    }
    
    @Override
    public void deliveryComplete(MqttDeliveryToken token) {
        //We do not need this because we do not publish
    }
}
