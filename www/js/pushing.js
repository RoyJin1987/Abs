'use strict'
/*
 * 推送页
 */
var app = {
  serverUrl: "http://112.124.122.107/Applications/web/?data=",
  nVehicles:[],//附近车辆
	position:null,//当前Gps位置
  baiduPosition:null,//当前百度坐标
  map:null,//百度地图对象
  orderId:"",
  usrToken:"",
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
    if(typeof localStorage === 'undefined' )
    {
      app.token = $.cookie("usrToken");
      app.usrName = $.cookie("usrName");
    }
    else
    {
      app.token = localStorage["usrToken"];
      app.usrName = localStorage["usrName"];
    }
    
    // app.orderId = app.getUrlParam("orderId");
    // app.getPendingPushVehicle();
    // app.loadMap();

    app.orderId = app.getUrlParam("orderId");
    app.getPendingPushVehicle();

    var screenWidth = $(document).width();
    var screenHeight = $(document).height();

    alert(screenWidth + "x" +screenHeight);
    // var screenWidth = screen.availWidth;
    // var screenHeight = screen.availHeight;

    // alert($("#progress-bar-container").css("left"));
    // alert($("#progress-bar-container").css("top"));
    // alert($("#progress-bar-container").width());
    // alert($("#progress-bar-container").height());

    var left = (screenWidth - $("#progress-bar-container").width())/2/screenWidth*100;
    var top = (screenHeight - $("#progress-bar-container").height())/2/screenHeight*100;
    alert(left + "," + top);
    $("#progress-bar-container").css("left",left+"%");
    $("#progress-bar-container").css("top",top+"%");
    $("#progress-bar-container").show();
    // 
    // app.push();
  },

 	//加载定位
 	loadNavigator : function() {
    	// onSuccess Callback
    	//   This method accepts a `Position` object, which contains
    	//   the current GPS coordinates
    	//
    	var succ = function onSuccess(position) {
    	   app.position = position;
         if (app.map) {
            app.refreshMap();
         } else {
            app.loadMap();
         };
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
 		app.map = new BMap.Map("map");

 		if (app.position) {
        var gpsPoint = new BMap.Point(app.position.coords.longitude, app.position.coords.latitude);
        // app.map.centerAndZoom(gpsPoint, 14);
        // var gpsPoint = new BMap.Point(app.position.coords.longitude, app.position.coords.latitude);
        setTimeout(function(){
          app.convertCoordsGPStoBaidu(app.position.coords,function(point) {
            app.map.centerAndZoom(point, 14); 
            app.baiduPosition = point;
          }); 
        },1000);
        
 		} else {
        //test
        var p = {longitude:31.2093913,latitude:121.5946826};
        app.convertCoordsGPStoBaidu(p,function(point) {
          app.map.centerAndZoom(point, 14); 
          app.baiduPosition = point;
        });                  // 初始化地图,设置中心点坐标和地图级别。
    }

 	},

  //刷新地图
  refreshMap:function()
  {
    if (app.map) {
      if (app.position) {
          // var gpsPoint = new BMap.Point(this.position.coords.longitude, this.position.coords.latitude);
          app.convertCoordsGPStoBaidu(app.position.coords,function(point) {
            app.map.centerAndZoom(point, 14);
            app.baiduPosition = point; 
          }); 
      };
    };
  },

  convertCoordsGPStoBaidu : function(coords,callback) {
    var gpsPoint =  new BMap.Point(coords.longitude,coords.latitude);
    BMap.Convertor.translate(gpsPoint,0,callback); 
     
  },


  getPendingPushVehicle:function() {
   
    var param = {
      Action:"POSTList",
      parameter:{
        orderId:app.orderId,
        page:1
      },
      Token:app.usrToken
    }
    var jsonStr = JSON.stringify(param);
    var self = this;
    var url =  self.serverUrl + jsonStr;
    commonJS.get(url,function(data){ 
      self.nVehicles = data.items;
      app.push(self);
    });
  },

  //推送订单
  push:function(self)
  {
    
    setTimeout(function(){
       for(var i in self.nVehicles)
      {
        var vehicle = self.nVehicles[i];

        var message = { 
          type:"newOrder",
          orderId:app.orderId
        };
        window.notificationClient.notify(vehicle.identity,JSON.stringify(message));           
      }
    },100);
   
      // // $("body").trigger("create");
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
        progress+=1;
        if (progress>100) {
          clearInterval(timer);
          window.location.href="myOrder.html";
        };
    },1000);
  },
  
  getUrlParam : function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    } 

};
$(document).ready(function()
{
  app.onLoad();

});

