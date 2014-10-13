'use strict'
/*
 * app首页
 */
var app = {
  serverUrl: "http://112.124.122.107/Applications/web/?data=",
  models:[],
  currentModel:"",
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
    // alert('haha');
  	//app.loadNavigator();
    app.loadMap();
    app.getModels();
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
         app.addMaker(app.position.coords,true);    
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
 		app.map = new BMap.Map("allmap");

 		if (app.position) {
        var gpsPoint = new BMap.Point(app.position.coords.longitude, app.position.coords.latitude);
        // app.map.centerAndZoom(gpsPoint, 14);
        // var gpsPoint = new BMap.Point(app.position.coords.longitude, app.position.coords.latitude);
        setTimeout(function(){
          app.convertCoordsGPStoBaidu(app.position.coords,function(point) {
          alert(JSON.stringify(point));
          app.map.centerAndZoom(point, 14); 
          }); 
        },2000);
        
 		} else {
        //test
        var p = {longitude:31.2093913,latitude:121.5946826};
        app.convertCoordsGPStoBaidu(p,function(point) {
          app.map.centerAndZoom(point, 14); 
        });                  // 初始化地图,设置中心点坐标和地图级别。
        //this.map.addControl(new BMap.ZoomControl());      //添加地图缩放控件
        //var p = {longitude:31.209,latitude:121.595};
        app.addMaker(p);
    }

 	},

  //刷新地图
  refreshMap:function()
  {
    if (app.map) {
      if (app.position) {
          // var gpsPoint = new BMap.Point(this.position.coords.longitude, this.position.coords.latitude);
          app.convertCoordsGPStoBaidu(app.position.coords,function(point) {
            alert(JSON.stringify(point));
            app.map.centerAndZoom(point, 14); 
          }); 
      };
    };
  },

  addMaker:function(coords,isAnimated)  {
    if (!coords) { return;};
    if (app.map) {
      //var gpsPoint = new BMap.Point(coords.longitude, coords.latitude);
      app.convertCoordsGPStoBaidu(coords,function(point) {
          //alert('point.x:'+point.lat +'\n' +'point.y:'+point.lng);
          alert(JSON.stringify(point));
          var marker = new BMap.Marker(point);  //创建标注
          app.map.addOverlay(marker);    // 将标注添加到地图中
          var opts = {
            width : 100,    // 信息窗口宽度
            height: 60,     // 信息窗口高度
            title : "我的位置", // 信息窗口标题
            enableAutoPan : true //自动平移
          }
          var infoWindow = new BMap.InfoWindow("我的位置", opts);  // 创建信息窗口对象
          marker.addEventListener("click", function(){          
            app.map.openInfoWindow(infoWindow,point); //开启信息窗口
          });
          if (isAnimated) {
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
          };
      });
    }
  },
  convertCoordsGPStoBaidu : function(coords,callback) {
    var gpsPoint =  new BMap.Point(coords.longitude,coords.latitude);
    BMap.Convertor.translate(gpsPoint,0,callback); 
     
  },

  //获取车型
  getModels:function()  {
    var jsonStr = '{"Action":"getModels"}';
    var self = this;
    var url =  self.serverUrl + jsonStr;
    commonJS.get(url,function(data){ 
      alert(JSON.stringify(data));
      if(data.items)
      {
        for(var i in data.items)
        {
          var model = data.items[i];
          model.select = function()
          {
            var self = this;
            app.currentModel = self.id;
          }
        }
      }
      self.models = data.items;
      ko.applyBindings(self.models);
    });
  },
};
