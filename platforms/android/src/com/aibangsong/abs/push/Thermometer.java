package com.aibangsong.abs.push;

import java.util.Random;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttTopic;
import org.eclipse.paho.client.mqttv3.internal.MemoryPersistence;

public class Thermometer {

	public static final String BROKER_URL = "tcp://112.124.122.107:1883";
	public static final String TOPIC = "web_1414821604291";
	private MqttClient client;
	private String message;
	private String recevierIdentity;

	public Thermometer(String message,String recevierIdentity) {
		try {
			this.message = message;
			this.recevierIdentity =recevierIdentity;
			client = new MqttClient(BROKER_URL, "mytestid",
					new MemoryPersistence());
		} catch (MqttException e) {
			e.printStackTrace();
			System.exit(1);
		}
	}

	Runnable runnable = new Runnable() {
		@Override
		public void run() {
			try {
				client.connect();
				publishMessage();
				client.disconnect();

			} catch (MqttException e) {
				// Toast.makeText(getApplicationContext(),
				// "Something went wrong!" + e.getMessage(),
				// Toast.LENGTH_LONG).show();
				e.printStackTrace();
			} catch (Exception e) {
				// Toast.makeText(getApplicationContext(),
				// "Something went wrong!" + e.getMessage(),
				// Toast.LENGTH_LONG).show();
				e.printStackTrace();
			}

		}
	};

	public void start() {
		try {
			new Thread(runnable).start();
		} catch (Exception e) {
			e.printStackTrace();
			System.exit(1);
		}
	}

	private void publishMessage() throws MqttException {
		final MqttTopic topic = client.getTopic(recevierIdentity);
		final MqttMessage mqttMessage = new MqttMessage(String.valueOf(message)
				.getBytes());
		topic.publish(mqttMessage);
	}

	public static int createRandomNumberBetween(int min, int max) {

		return new Random().nextInt(max - min + 1) + min;
	}
}
