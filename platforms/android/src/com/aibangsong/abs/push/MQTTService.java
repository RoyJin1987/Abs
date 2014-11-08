package com.aibangsong.abs.push;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.internal.MemoryPersistence;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.widget.Toast;

/**
 * @author Dominik Obermaier
 */
public class MQTTService extends Service {

    public static final String BROKER_URL = "tcp://112.124.122.107:1883";
    //public static final String BROKER_URL = "tcp://test.mosquitto.org:1883";

    /* In a real application, you should get an Unique Client ID of the device and use this, see
    http://android-developers.blogspot.de/2011/03/identifying-app-installations.html */
    public static final String clientId = "android-client";

    private String topic = "07b27a882cc721a9207250f1b6bd2868";
    private MqttClient mqttClient;


    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onStart(Intent intent, int startId) {
    	topic = intent.getStringExtra("identity");
        super.onStart(intent, startId);
        new Thread(runnable).start();
    }

    Runnable runnable = new Runnable(){
        @Override
        public void run() {
        	try {
                mqttClient = new MqttClient(BROKER_URL, clientId, new MemoryPersistence());

                mqttClient.setCallback(new PushCallback(getApplicationContext()));
                mqttClient.connect();

                //Subscribe to all subtopics of homeautomation
                mqttClient.subscribe(topic);
                
                
            } catch (MqttException e) {
                //Toast.makeText(getApplicationContext(), "Something went wrong!" + e.getMessage(), Toast.LENGTH_LONG).show();
                e.printStackTrace();
            }catch (Exception e) {
                //Toast.makeText(getApplicationContext(), "Something went wrong!" + e.getMessage(), Toast.LENGTH_LONG).show();
                e.printStackTrace();
            }

        }
    };
    
    @Override
    public void onDestroy() {
        try {
            mqttClient.disconnect(0);
        } catch (MqttException e) {
            Toast.makeText(getApplicationContext(), "Something went wrong!" + e.getMessage(), Toast.LENGTH_LONG).show();
            e.printStackTrace();
        }
        super.onDestroy();
    }
}
