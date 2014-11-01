package com.aibangsong.abs.push;

import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttTopic;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.Intent;

import com.aibangsong.abs.Abs;
import com.aibangsong.abs.R;

public class PushCallback implements MqttCallback {

    private ContextWrapper context;

    public PushCallback(ContextWrapper context) {

        this.context = context;

    }

    @Override
    public void connectionLost(Throwable cause) {
        //We should reconnect here
    }

    @Override
    public void messageArrived(MqttTopic topic, MqttMessage message) throws Exception {

        final NotificationManager notificationManager = (NotificationManager)
                context.getSystemService(Context.NOTIFICATION_SERVICE);

        final Notification notification = new Notification(R.drawable.icon,
                "Black Ice Warning!", System.currentTimeMillis());

        // Hide the notification after its selected
        notification.flags |= Notification.FLAG_AUTO_CANCEL;

        final Intent intent = new Intent(context, Abs.class);
        final PendingIntent activity = PendingIntent.getActivity(context, 0, intent, 0);
        notification.setLatestEventInfo(context, "new order", 
                new String(message.getPayload()), activity);
        notification.number += 1;
        notificationManager.notify(0, notification);
        
    }
    
//    private void dialog() {
//
//		final Dialog dialog = new Dialog(context, R.style.JHDialog);
//		//设置它的ContentView
//		dialog.setContentView(R.layout.dialog_general);
//		Button buttonOK = (Button) dialog.findViewById(R.id.dialog_button_ok);
//		Button buttonCancel = (Button) dialog.findViewById(R.id.dialog_button_cancel);
//
//		TextView dialogTitle = (TextView) dialog.findViewById(R.id.dialog_title);
//		TextView dialogMessage = (TextView) dialog.findViewById(R.id.dialog_message);
//
//		buttonOK.setBackgroundResource(R.drawable.green_style);
//		buttonCancel.setBackgroundResource(R.drawable.grey_style);
//		buttonOK.setText("抢单");
//		buttonCancel.setText("取消");
//		dialogTitle.setText("有新的订单");
//		DecimalFormat df = new DecimalFormat();
//		df.setMaximumFractionDigits(2);
//		dialogMessage.setText("是否抢单？");
//		dialog.setCanceledOnTouchOutside(false);
//		
//		buttonOK.setOnClickListener(new OnClickListener() {
//			@Override
//			public void onClick(View v) {
//				dialog.dismiss();
//				// 绑定Service
//				Intent sIntent = new Intent();
//				ComponentName cn = new ComponentName(context, "com.jihox.pbandroid.uploader.UploadService");  
//				sIntent.setComponent(cn); 
//				sIntent.putExtra("UploadFirst", true);
//				sIntent.putExtra("UploadWithWifi", false);
//				Bundle bundle = new Bundle();
//				
//				bundle.putSerializable("UploadTask", uploadTask);
//				int dialogWidth = (int)(getWindowManager().getDefaultDisplay().getWidth() * 0.8);
//				bundle.putInt("DialogWidth", dialogWidth);
//				sIntent.putExtras(bundle);
//				startService(sIntent);
//				bindService(sIntent, conn, Context.BIND_AUTO_CREATE);
//				unbindServiceWhenDestroy =true;
//			}
//		});
//		buttonCancel.setOnClickListener(new OnClickListener() {
//			@Override
//			public void onClick(View v) {
//				dialog.dismiss();
//				// 绑定Service
//				Intent sIntent = new Intent();
//				ComponentName cn = new ComponentName(PaySuccessActivity.this, "com.jihox.pbandroid.uploader.UploadService");  
//				sIntent.setComponent(cn);  
//				Bundle bundle = new Bundle();
//				uploadTask.setUploadNextTime(true);
//				bundle.putSerializable("UploadTask", uploadTask);
//				int dialogWidth = (int)(getWindowManager().getDefaultDisplay().getWidth() * 0.8);
//				bundle.putInt("DialogWidth", dialogWidth);
//				sIntent.putExtras(bundle);
//				startService(sIntent);
//				unbindServiceWhenDestroy =false;
//				Intent intent = new Intent();
//				if (project!=null && project.getBook().getProduct().getCategory()==2){
//					intent.putExtra("AblumHome", false);
//				}
//				intent.setClass(PaySuccessActivity.this, HomeActivity.class);
//				PaySuccessActivity.this.startActivity(intent);
//				finish();
//			}
//		});

    @Override
    public void deliveryComplete(MqttDeliveryToken token) {
        //We do not need this because we do not publish
    }
}
