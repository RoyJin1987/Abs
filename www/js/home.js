/*
 * app首页
 */
var app = {
	position:null,//当前位置
  map:null,//百度地图对象
	map:{},
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
  	app.loadNavigator();
    //app.loadMap();
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
         if (this.map) {
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

      var option = { maximumAge: 10*60*1000, timeout: 2*60*1000, enableHighAccuracy: false }
      navigator.geolocation.getCurrentPosition(succ, err, option);

    	// Options: throw an error if no update is received every 30 seconds.
    	//
    	var watchID = navigator.geolocation.watchPosition(succ, err, {maximumAge: 10000, timeout: 10000, enableHighAccuracy: false});
 	},

 	//加载地图
 	loadMap : function() {
 		this.map = new BMap.Map("allmap");

 		if (app.position) {
 			  this.map.centerAndZoom(new BMap.Point(app.position.coords.longitude, app.position.coords.latitude), 14);  
 		} else {
        //test
        var point = new BMap.Point(31.209,121.595);
        this.map.centerAndZoom(point,15);                 // 初始化地图,设置中心点坐标和地图级别。
        //this.map.addControl(new BMap.ZoomControl());      //添加地图缩放控件
        var position = {longitude:31.209,latitude:121.595};
        this.addMaker(position);
    }

 	},

  //刷新地图
  refreshMap:function()
  {
    if (this.map) {
      if (this.position) {
          var point = new BMap.Point(position.coords.longitude, position.coords.latitude);// 创建点坐标
          this.map.centerAndZoom(point,15);
      };
    };
  },

  addMaker:function(coords)
  {
    if (!coords) { return;};
    if (this.map) {
      var point = new BMap.Point(coords.longitude, coords.latitude);
      var marker = new BMap.Marker(point);  //创建标注
      this.map.addOverlay(marker);    // 将标注添加到地图中
      var opts = {
        width : 100,    // 信息窗口宽度
        height: 60,     // 信息窗口高度
        title : "我的位置", // 信息窗口标题
        enableAutoPan : true //自动平移
      }
      var infoWindow = new BMap.InfoWindow("我的位置", opts);  // 创建信息窗口对象
      marker.addEventListener("click", function(){          
        this.map.openInfoWindow(infoWindow,point); //开启信息窗口
      });
    };

  }

};
