'use strict'
/*
 * app首页
 */
var app = {
  serverUrl: "http://112.124.122.107/Applications/web/?data=",
  nVehicles:[],//附近车辆
	position:null,//当前Gps位置
  baiduPosition:null,//当前百度坐标
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
    /**
     * 接口处理功能准备就绪
     */
    LL.addEventListener(LL.Events.onInterfacesLoadedEvent,function(){
        //alert("LL.Events.onInterfacesLoadedEvent");
        var user=LL.Interfaces.userTypes.create(LL.Interfaces.userTypes.proxy);
        LL.Interfaces.register(user,function(data){
            alert(data.status);
        });
    });
    /**
     * 消息处理系统准备就绪
     */
    LL.addEventListener(LL.Events.onMessageLoadedEvent,function(){
        LL.Message.onMessage=function(message){
            app.push();
        };
        // $("#meid").html(LL.Message.deviceId);
        // $("#uidvalue").val(LL.Message.deviceId);
    });
    var model = "6";
    app.loadMap();
    app.getNVehicles(model)
    if ($.cookie("usrToken")) {
      alert("current user:"+$.cookie("usrToken"));
    };
    app.push();
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
         // app.addMaker(app.position.coords,true,null,"我的位置");    
      }

    	// onError Callback receives a PositionError object
    	//
    	var err = function onError(error) {
    	    alert('code: '    + error.code    + '\n' +
    	          'message: ' + error.message + '\n');
    	}

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
            app.baiduPosition = point;
            app.addMaker(point,true,null,"我的位置"); 
          }); 
        },1000);
        
 		} else {
        //test
        var p = {longitude:31.2093913,latitude:121.5946826};
        app.convertCoordsGPStoBaidu(p,function(point) {
          app.map.centerAndZoom(point, 14); 
          app.baiduPosition = point;
          app.addMaker(point,true,null,"我的位置");
          app.getNVehicles("6");//默认获取两轮车  
        });                  // 初始化地图,设置中心点坐标和地图级别。
        //this.map.addControl(new BMap.ZoomControl());      //添加地图缩放控件
        //var p = {longitude:31.209,latitude:121.595};
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
            app.baiduPosition = point; 
            app.getNVehicles("6");//默认获取两轮车
          }); 
      };
    };
  },
  convertCoordsGPStoBaidu : function(coords,callback) {
    var gpsPoint =  new BMap.Point(coords.longitude,coords.latitude);
    BMap.Convertor.translate(gpsPoint,0,callback); 
     
  },


  getNVehicles:function(model) {
    if (!app.baiduPosition) return;
    var param = {
      Action:"NVehicles",
      models:model,
      parameter:{
        latitude:app.baiduPosition.latitude,
        longitude:app.baiduPosition.latitude,
        page:1
      }
    }
    var jsonStr = JSON.stringify(param);
    var self = this;
    var url =  self.serverUrl + jsonStr;
    debugger;
    commonJS.get(url,function(data){ 
      alert(JSON.stringify(data));
      self.nVehicles = data.items;
      // for(var i in self.nVehicles)
      // {
              
      // }
      // // $("body").trigger("create");
    });
  },
  push:function()
  {
    var progress = 0;
    var timer = setInterval(function(){
        $("#progress-bar").find('#progress').text(progress);
        var num = progress * 3.6;
        if (num<=180) {
            $("#progress-bar").find('.right').css('transform', "rotate(" + num + "deg)");
        } else {
            $("#progress-bar").find('.right').css('transform', "rotate(180deg)");
            $("#progress-bar").find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
        };
        progress+=5;
        if (progress>100) {
          clearInterval(timer);
        };
    },50);


  }
};
