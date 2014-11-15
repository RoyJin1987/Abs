package com.aibangsong.abs.push;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.internal.MemoryPersistence;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.telephony.TelephonyManager;
import android.widget.Toast;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;

/**
 * @author Dominik Obermaier
 */
public class MQTTService extends Service {

    public static final String BROKER_URL = "tcp://112.124.122.107:1883";
    //public static final String BROKER_URL = "tcp://test.mosquitto.org:1883";

    /* In a real application, you should get an Unique Client ID of the device and use this, see
    http://android-developers.blogspot.de/2011/03/identifying-app-installations.html */
    public static final String clientId = "android-client1";

    private String topic = "07b27a882cc721a9207250f1b6bd2868";
    private MqttClient mqttClient;
    private String token;
    private boolean ifReportPos = false;
    private LocationClient mLocationClient = null; 
    private static final int REQUEST_TIMEOUT = 10*1000;//设置请求超时10秒钟  
	private static final int SO_TIMEOUT = 10*1000;  //设置等待数据超时时间10秒钟  
	
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onStart(Intent intent, int startId) {
    	topic = intent.getStringExtra("identity");
    	token = intent.getStringExtra("token");
    	ifReportPos = intent.getBooleanExtra("reportPos", false);
        super.onStart(intent, startId);
        new Thread(runnable).start();
        
        if (ifReportPos){
//        	new Thread(reportPosRunnable).start();
        	try {

        		LocationClient mLocationClient = new LocationClient(MQTTService.this.getApplicationContext()); 
        	        LocationClientOption option = new LocationClientOption(); 
        	        option.setOpenGps(true);                                //打开gps 
        	        option.setCoorType("bd09ll");                           //设置坐标类型为bd09ll 
        	        option.setPriority(LocationClientOption.NetWorkFirst);  //设置网络优先 
        	        option.setProdName("locSDKDemo2");                      //设置产品线名称 
        	        option.setScanSpan(1000*60*10);                        
        	        mLocationClient.setLocOption(option); 
        	        mLocationClient.setAK("tUoYt61wcnunrkdGksApMwQt");
        	        mLocationClient.start();
        	        mLocationClient.requestLocation();
        	        mLocationClient.registerLocationListener(new BDLocationListener() { 
        	            @Override 
        	            public void onReceiveLocation(final BDLocation location) { 
        	                if (location == null) 
        	                    return ; 
        	            	new Thread(new Runnable() {
        	        			@Override
        	        			public void run() {
        	        				String longitude =String.valueOf(location.getLongitude());
        	        				String latitude =String.valueOf(location.getLatitude());
        	        				String address =location.getAddrStr()==null? "":location.getAddrStr();
        	        				String strurl = "http://112.124.122.107/Applications/web/?data={\"Action\":\"updateLocation\",\"Token\":\"" + token
        	        							+ "\",\"parameter\":{\"longitude\":\""+  longitude
        	        							+ "\",\"latitude\":\"" + latitude
        	        							+ "\",\"address\":\"" + address + "\"}}";
        	        		        
        	                        URI uri = null;
        	        				try {
        	        					URL url = new URL(strurl);
        	        					uri = new URI(url.getProtocol(), url.getHost(), url.getPath(), url.getQuery(), null);
        	        				} catch (MalformedURLException e1) {
        	        					// TODO Auto-generated catch block
        	        					e1.printStackTrace();
        	        				} catch (URISyntaxException e) {
        	        					// TODO Auto-generated catch block
        	        					e.printStackTrace();
        	        				}
        	                        
        	            			HttpPost httpPost = new HttpPost(uri);

        	            			List<NameValuePair> params = new ArrayList<NameValuePair>();
//        	            			params.add(new BasicNameValuePair("longitude", String.valueOf(location.getLongitude())));
//        	            			params.add(new BasicNameValuePair("latitude", String.valueOf(location.getLatitude())));
//        	            			params.add(new BasicNameValuePair("address", location.getAddrStr()==null? "":location.getAddrStr()));
        	            			HttpClient httpclient = null;
        	            			try {
        	            				httpPost.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
        	            				
        	            				BasicHttpParams httpParams = new BasicHttpParams();  
        	            			    HttpConnectionParams.setConnectionTimeout(httpParams, REQUEST_TIMEOUT);  
        	            			    HttpConnectionParams.setSoTimeout(httpParams, SO_TIMEOUT);  
        	            				httpclient = new DefaultHttpClient(httpParams);
        	            				HttpResponse httpResponse = httpclient.execute(httpPost);
        	            				HttpEntity resEntity = httpResponse.getEntity();
        	            				String result = EntityUtils.toString(resEntity);
        	            				
        	            				resEntity.consumeContent();
        	            			} catch (UnsupportedEncodingException e) {
        	            				e.printStackTrace();
        	            			} catch (ClientProtocolException e) {
        	            				e.printStackTrace();
        	            			} catch (IOException e) {
        	            				e.printStackTrace();
        	            			} finally {
        	            				if (httpclient!=null){
        	            					httpclient.getConnectionManager().shutdown();
        	            				}
        	            			}
        	        			}
        	        		}).start();	
        	    		
        	            } 
        	             
        	            public void onReceivePoi(BDLocation location){ 
        	                //return ; 
        	            } 
        	        }); 
         
        	}catch (Exception e) {
                Toast.makeText(getApplicationContext(), "Something went wrong!" + e.getMessage(), Toast.LENGTH_LONG).show();
                e.printStackTrace();
            }
        }
    }

    Runnable runnable = new Runnable(){
        @Override
        public void run() {
        	try {
        		String deviceIdStr = ((TelephonyManager) getSystemService(TELEPHONY_SERVICE)).getDeviceId();
                mqttClient = new MqttClient(BROKER_URL, deviceIdStr, new MemoryPersistence());

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
            
            e.printStackTrace();
        }
        super.onDestroy();
    }
}
