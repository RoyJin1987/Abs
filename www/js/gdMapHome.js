'use strict'
/*
 * app首页
 */
var app = {
	position:null,//当前位置
  map:null,//百度地图对象
  onLoad:function() {
    	if (!window.device) {
    		$(document).ready(this.onDeviceReady);
    	} else {
    		document.addEventListener('deviceready', this.onDeviceReady, false);
    	}

  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
  	//app.loadNavigator();
    app.loadMap();
  },

 	//加载定位
 	loadNavigator : function() {
    	// onSuccess Callback
    	//   This method accepts a `Position` object, which contains
    	//   the current GPS coordinates
    	//
    	var succ = function onSuccess(position) {
    	   alert('Latitude: '          + position.coords.latitude          + '\n' +
    	          'Longitude: '         + position.coords.longitude         + '\n' +
    	          'Altitude: '          + position.coords.altitude          + '\n' +
    	          'Accuracy: '          + position.coords.accuracy          + '\n' +
    	          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    	          'Heading: '           + position.coords.heading           + '\n' +
    	          'Speed: '             + position.coords.speed             + '\n' +
    	          'Timestamp: '         + position.timestamp                + '\n');
    	   app.position = position;
         if (app.map) {
            app.refreshMap();
         } else {
            app.loadMap();
         };
         app.addMaker(app.position.coords);
         
      }

    	// onError Callback receives a PositionError object
    	//
    	var err = function onError(error) {
    	    alert('code: '    + error.code    + '\n' +
    	          'message: ' + error.message + '\n');
    	}

      // var option = { maximumAge: 10*60*1000, timeout: 2*60*1000, enableHighAccuracy: false }
      // navigator.geolocation.getCurrentPosition(succ, err, option);

    	// Options: throw an error if no update is received every 30 seconds.
    	//
    	var watchID = navigator.geolocation.watchPosition(succ, err, {maximumAge: 10000, timeout: 10000, enableHighAccuracy: false});
 	},

 	//加载地图
 	loadMap : function() {
    var mapCenter;
    var marker;
    if (app.position) {
       mapCenter =  new AMap.LngLat(app.position.coords.longitude,app.position.coords.latitude);
    } else {
       mapCenter = new AMap.LngLat(121.5946893,31.2093899);
       marker = new AMap.Marker({               
        icon:"http://webapi.amap.com/images/marker_sprite.png",
        position:mapCenter
      });
    };
    //alert(JSON.stringify(mapCenter));
 		app.map = new AMap.Map("allmap",{
        rotateEnable:true,
        dragEnable:true,
        zoomEnable:true,
        zooms:[2,18],
        //二维地图显示视口
        view: new AMap.View2D({ 
            center:mapCenter,
            zoom:16 //地图显示的缩放级别
        })
    });  
    if (marker) { marker.setMap(app.map)};
 	},

  //刷新地图
  refreshMap:function()
  {
    if (app.map) {
      if (app.position) {
        var coords =  app.position.coords;
        var mapCenter = new AMap.LngLat(coords.longitude,coords.latitude);
        app.map.panTo(mapCenter);
      };
    };
  },

  //标注坐标
  addMaker:function (coords){
    var marker = new AMap.Marker({               
        icon:"http://webapi.amap.com/images/marker_sprite.png",
        position:new AMap.LngLat(coords.longitude,coords.latitude)
    });
    marker.setMap(app.map);  //在地图上添加点
}
}