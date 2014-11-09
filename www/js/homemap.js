'use strict'
/*
 * app首页
 */
var app = {
  serverUrl: "http://112.124.122.107/Applications/web/?data=",
  models:[],//车型
  nVehicles:[],//附近车辆
  currentModel:"",
	position:null,//当前Gps位置
  baiduPosition:null,//当前百度坐标
  map:null,//百度地图对象
  // Application Constructor
  initialize: function() {
      this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
      //app.receivedEvent('deviceready');
      $("#allmap").css("width",$(document).width());
      $("#allmap").css("height",$(document).height());

     //通过百度sdk来获取经纬度,并且alert出经纬度信息
      var noop = function(){};
      var callback = function(pos){
            app.baiduPosition = new BMap.Point(pos.coords.longitude,pos.coords.latitude);
             $.cookie('baiduPosition', JSON.stringify(app.baiduPosition), { expires: 1, path: '/' });
            app.loadMap();
            window.locationService.stop(noop,noop);
        }
      window.locationService.getCurrentPosition(callback,function(e){
          window.locationService.stop(noop,noop);
      });
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
         // app.addMaker(app.position.coords,true,null,"我的位置");    
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
 		if (app.baiduPosition) {
        app.map.centerAndZoom(app.baiduPosition, 14); 
        app.addMaker(app.baiduPosition,true,null,"我的位置"); 
        app.getNVehicles("6");
 		} else {
        //test
       var point = new BMap.Point(121.605368,31.203069);
       app.map.centerAndZoom(point, 14); 
       app.addMaker(point,true,null,"我的位置");
       app.getNVehicles("6");             
    }

 	},

  //刷新地图
  refreshMap:function()
  {
    if (app.map) {
      if (app.baiduPosition) {
         app.map.centerAndZoom(app.baiduPosition, 14);
         app.getNVehicles("6");//默认获取两轮车
      };
    };
  },


  addMaker:function(BMapPoint,isAnimated,opts,title)  {
    if (!BMapPoint) { return;};
    if (app.map) {
       var marker = new BMap.Marker(BMapPoint);  //创建标注
          app.map.addOverlay(marker);    // 将标注添加到地图中
          if (!opts) {
              opts = {
              width : 100,    // 信息窗口宽度
              height: 60,     // 信息窗口高度
              title : title?title:"车辆位置", // 信息窗口标题
              enableAutoPan : true //自动平移
            }

          };
          var infoWindow = new BMap.InfoWindow(title?title:"车辆位置", opts);  // 创建信息窗口对象
          marker.addEventListener("click", function(){          
            app.map.openInfoWindow(infoWindow,BMapPoint); //开启信息窗口
          });
          if (isAnimated) {
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
          };
    }
  },

  //获取车型
  getModels:function()  {
    var jsonStr = '{"Action":"getModels"}';
    var self = this;
    var url =  self.serverUrl + jsonStr;
    commonJS.get(url,function(data){ 
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
      $("body").trigger("create");
    });
  },

  getNVehicles:function(model) {
    if (!app.baiduPosition) return;
    var param = {
      Action:"NVehicles",
      models:model,
      parameter:{
        latitude:app.baiduPosition.latitude,
        longitude:app.baiduPosition.longitude,
        page:1
      }
    }
    var jsonStr = JSON.stringify(param);
    var self = this;
    var url =  self.serverUrl + jsonStr;
    commonJS.get(url,function(data){ 

      self.nVehicles = data.items;
      for(var i in self.nVehicles)
      {
        var vehicle = self.nVehicles[i];
        var opts = {
              width : 100,    // 信息窗口宽度
              height: 60,     // 信息窗口高度
              title : "车牌号："+vehicle.license_plate_number, // 信息窗口标题
              enableAutoPan : true //自动平移
            };
         //车辆位置为0,随机取一点
          var bounds = app.map.getBounds();
          var sw = bounds.getSouthWest();
          var ne = bounds.getNorthEast();
          var lngSpan = Math.abs(sw.lng - ne.lng);
          var latSpan = Math.abs(ne.lat - sw.lat);
          var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
          app.addMaker(point,false,opts,vehicle.name);  
              
      }
      // $("body").trigger("create");
    });

  }
};
