'use strict'
/*
 * app首页
 */
var app = {
  serverUrl: "http://112.124.122.107/Applications/web/?data=",
  token:"",
  identity:"",
  usrName:"",
  usrImage:"",
  models:[],//车型
  nVehicles:[],//附近车辆
  vehicleMarkers:[],//附近车辆地图覆盖物
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
     if (!window.device) {
          $(document).ready(this.onDeviceReady);
      } else {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      }
  },

  eventBackButton:function() {
        app.myAlert('再点击一次退出!');
        document.removeEventListener("backbutton", app.eventBackButton, false); // 注销返回键
        document.addEventListener("backbutton", app.exitApp, false);// 绑定退出事件
        // 3秒后重新注册
        var intervalID = window.setTimeout(function() {
          window.clearTimeout(intervalID);
          document.removeEventListener("backbutton", app.exitApp, false); // 注销返回键
          document.addEventListener("backbutton", app.eventBackButton, false); // 返回键
        }, 3000);
  },
        
  //退出app
  exitApp:function () {
    navigator.app.exitApp();
  },

  // showMyAlert:function (text) {
  //   $.mobile.loadingMessageTextVisible = true;
  //   $.mobile.showPageLoadingMsg("a", text);
  // },
  myAlert:function (text) {
    app.showMyAlert(text);
    setTimeout(app.hideLoading, 2000);
  },
  // hideLoading:function () {
  //   $.mobile.hidePageLoadingMsg();
  // },
  showMyAlert:function () {
        //显示加载器.for jQuery Mobile 1.2.0
        $.mobile.loading('show', {
            text: '再点击一次退出', //加载器中显示的文字
            textVisible: true, //是否显示文字
            theme: 'a',        //加载器主题样式a-e
            textonly: true,   //是否只显示文字
            html: ""           //要显示的html内容，如图片等
        });
    },

    //隐藏加载器.for jQuery Mobile 1.2.0
    hideLoading:function ()
    {
        //隐藏加载器
        $.mobile.loading('hide');
    },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
      document.addEventListener('backbutton', app.eventBackButton, false);
      //app.receivedEvent('deviceready');
      if(typeof localStorage === 'undefined' )
      {
        app.token = $.cookie("usrToken");
        app.usrName = $.cookie("usrName");
        app.usrImage = $.cookie("usrImage");
        app.identity = $.cookie("usrIdentity");
      }
      else
      {
        app.token = localStorage["usrToken"];
        app.usrName = localStorage["usrName"];
        app.usrImage = localStorage["usrImage"];
        app.identity = localStorage["usrIdentity"];
      }



      if (app.token) {
        //已登录
        $("#usr-name").text("您好,"+app.usrName);
         if (window.notificationClient) {
             window.notificationClient.startService(app.identity,app.token,true);
         };
      }
      else
      {
        //未登录
        $("#usr-name").text('您尚未登录');
      }
      if(app.usrImage){
        
        //$("#usr-image").src=app.usrImage;
        document.getElementById("usr-image").src = app.usrImage;
      }
     
      // alert("screen height:"+screen.availHeight);
      // alert("screen height:"+$(".ui-page").first().height());
      $("#allmap").css("height",$(".ui-page").first().height()+"px");

      app.getModels(function(){
          app.currentModel = $("input[name='car-type'][checked='checked']").first().val();
          //alert("initmodels-->>current model:"+app.currentModel);
          //绑定页面事件
          $("input[name='car-type']").on('click',function()
          {
            //alert($(this).val());
            var selectedModel = $(this).val();
            if (app.currentModel != selectedModel) {
              app.currentModel =  selectedModel;
              app.getNVehicles(selectedModel);
            };

          });

          // $(document).delegate(".vehicle-calling","click",function(){
          //   //alert("clicked");
          //   app.navigatorTo("requestDelivery.html");
          // });
          // alert("got locationService");
          //通过百度sdk来获取经纬度,并且alert出经纬度信息
          var noop = function(){};

          var callback = function(pos){
                app.baiduPosition = new BMap.Point(pos.coords.longitude,pos.coords.latitude);
                 // $.cookie('baiduPosition', JSON.stringify(app.baiduPosition), { expires: 1, path: '/' });
                localStorage.setItem('baiduPosition',JSON.stringify(app.baiduPosition));
                // var location = JSON.parse(localStorage["baiduPosition"]);
                // alert("baiduPosition："+ JSON.stringify(location));
                app.loadMap();
                window.locationService.stop(noop,noop);
          }
          setTimeout(function()
          {
            if(window.locationService)
            {
              window.locationService.getCurrentPosition(callback,function(e){
                window.locationService.stop(noop,noop);
              });
            }
            //每60秒获取一次坐标
            setInterval(function(){
              if(window.locationService)
              {
                window.locationService.getCurrentPosition(callback,function(e){
                  window.locationService.stop(noop,noop);
                });
              }
            },60000);
          },3000);
          
          if(!window.locationService || typeof locationService == "undefined")
          {
            app.loadMap();
          }
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
         // app.addVehicleMaker(app.position.coords,true,null,"我的位置");    
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
        // app.addMyLocMaker(app.baiduPosition); 
        //alert("loadmap-->>current model:"+app.currentModel);
        app.getNVehicles(app.currentModel);
 		} else {
        //test
       var point = new BMap.Point(121.605368,31.203069);
       app.map.centerAndZoom(point, 14); 
       app.baiduPosition = point;
       // app.addMyLocMaker(point);
       app.getNVehicles(app.currentModel);             
    }

 	},

  //刷新地图
  refreshMap:function()
  {
    if (app.map) {
      if (app.baiduPosition) {
         app.map.centerAndZoom(app.baiduPosition, 14);
         app.getNVehicles(app.currentModel);//默认获取两轮车
      };
    };
  },

  addMyLocMaker:function(BMapPoint)
  {
    if (!BMapPoint) { return;};
    if (app.map) {
       var myIcon = new BMap.Icon("img/map/myloc.png",   
          new BMap.Size(50, 50), {      
           // 指定定位位置。     
           // 当标注显示在地图上时，其所指向的地理位置距离图标左上      
           // 角各偏移7像素和25像素。您可以看到在本例中该位置即是     
           // 图标中央下端的尖角位置。      
           anchor: new BMap.Size(25, 25),        
          });        
     // 创建标注对象并添加到地图     
      var marker = new BMap.Marker(BMapPoint,{icon:myIcon});      
      app.map.addOverlay(marker);           
    }
  },


  addVehicleMaker:function(BMapPoint,isAnimated,opts,vehicle)  {
    if (!BMapPoint) { return;};
    if (app.map) {
      var vehicleImg = "";//$("input[name='car-type'][value='"+app.currentModel+"']").attr('icon-path');
      switch(vehicle.gid)
      {
        case 1:
        vehicleImg = "img/map/gid_1.png";
        break;
        case 2:
        vehicleImg = "img/map/gid_2.png";
        break;
        case 3:
        vehicleImg = "img/map/gid_3.png";
        break;
        default:
        vehicleImg = "img/map/gid_1.png";
        break;

      }
      var vIcon = new BMap.Icon(vehicleImg,   
      new BMap.Size(50, 50), {      
       // 指定定位位置。     
       // 当标注显示在地图上时，其所指向的地理位置距离图标左上      
       // 角各偏移7像素和25像素。您可以看到在本例中该位置即是     
       // 图标中央下端的尖角位置。      
       anchor: new BMap.Size(25, 51),        
      });       
      var marker = new BMap.Marker(BMapPoint,{icon:vIcon});  //创建标注
      app.map.addOverlay(marker);    // 将标注添加到地图中
      if (!opts) {
          opts = {
          width : 100,    // 信息窗口宽度
          height: 60,     // 信息窗口高度
          title : title?title:"车辆位置", // 信息窗口标题
          enableAutoPan : true //自动平移
        }

      };
      // var infoWindow = new BMap.InfoWindow(title?title:"车辆位置", opts);  // 创建信息窗口对象

      //构造车辆信息窗口
      var content = "<div style='padding:2px 5px;font-size:.8em'>"
                     + "<div><img style='width:38px;height:38px' src='"+vehicle.image+"' alt=''></img></div>"
                     +"<div style='position:relative;padding-right:55px'>"
                     +"<div style='position:absolute;right:0px;top:10px'>"
                     +"<a href='callHim.html?model="+app.currentModel+"&id="+vehicle.item.motorcadeKey+"&identity="+vehicle.identity+"'><img style='width:80px;height:80px' src='img/map/jiujiaota_gr.png'></img></a></div>"
                     +"<div>车牌号:"+vehicle.item.license_plate_number+"</div>"
                     +"<div>联系人:"+vehicle.name+"</div>"
                     +"<div>距离我:"+1.5+"公里</div>"
                     +"<div>类型:"+vehicle.usertype+"</div>"
                     +"<div>成交单数:"+vehicle.waybill_items+"</div>"
                     +"<div>好评/差评次数:"+vehicle.haoping+"/"+vehicle.chaping+"</div></div></div>";
      // var html = [];
       

      var infoWindow = new BMap.InfoWindow(content,{offset:new BMap.Size(0,-50)});            
      marker.addEventListener("click", function(){          
        app.map.openInfoWindow(infoWindow,BMapPoint); //开启信息窗口
      });
      if (isAnimated) {
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); 
      };
      //保存maker
      // app.vehicleMarkers.push(marker);
    }
  },

  //获取车型
  getModels:function(callback)  {
    var jsonStr = '{"Action":"getModels"}';
    var self = this;
    var url =  self.serverUrl + jsonStr;
    commonJS.get(url,function(data){ 
      if(data.items)
      {
        for(var i in data.items)
        {
          var model = data.items[i];
          // model.select = function()
          // {
          //   var self = this;
          //   app.currentModel = self.id;
          // }

          //绑定界面
          $("input[name='car-type']")[i].value = model.id;
          $("label[for^='car-type']")[i].innerHtml = model.name;
        }
        callback();
      }
      // self.models = data.items;
      // ko.applyBindings(self.models);
      // $("body").trigger("create");
    });
  },

  //获取对应类型附近车辆
  getNVehicles:function(model) {
    if (!app.baiduPosition) return;
    //清除车辆覆盖物
    // for(var i in app.vehicleMarkers)
    // {
    //   var marker = app.vehicleMarkers[i]
    //   app.map.removeOverlay(maker);
    // }
    // app.vehicleMarkers = [];
    app.map.clearOverlays();
    //alert("overlays count:"+app.map.getOverlays().length);
    app.addMyLocMaker(app.baiduPosition); 

    //请求附近车辆
    var param = {
      Action:"NVehicles",
      models:model,
      parameter:{
        latitude:app.baiduPosition.lat,
        longitude:app.baiduPosition.lng,
        page:1
      }
    }
    var jsonStr = JSON.stringify(param);
    var self = this;
    var url =  self.serverUrl + jsonStr;
    commonJS.get(url,function(data){ 
      //alert(JSON.stringify(data));
      self.nVehicles = data.items;
      // alert("Got nVehicles count:"+self.nVehicles.length);
      for(var i in self.nVehicles)
      {
        var vehicle = self.nVehicles[i];
        var opts = {
              width : 100,    // 信息窗口宽度
              height: 60,     // 信息窗口高度
              title : "车牌号："+vehicle.license_plate_number, // 信息窗口标题
              enableAutoPan : true //自动平移
            };
            var point ={};
            if(vehicle.distance.longitude === 0|| vehicle.distance.latitude===0)
            {
             //车辆位置为0,随机取一点
              var bounds = app.map.getBounds();
              var sw = bounds.getSouthWest();
              var ne = bounds.getNorthEast();
              var lngSpan = Math.abs(sw.lng - ne.lng);
              var latSpan = Math.abs(ne.lat - sw.lat);
              point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            }
            else
            {
               point = new BMap.Point(vehicle.distance.longitude,vehicle.distance.latitude);
            }
            app.addVehicleMaker(point,false,opts,vehicle);  
              
      }
      // $("body").trigger("create");
    });

  },
  navigatorTo:function(url)
  {
    //alert("navigatorTo "+url);
    if(app.token)
    {
      window.location.href = url+"?model="+app.currentModel;
    }
    else
    {
      alert("请先登录");
      window.location.href = "login.html";
    }
  },

  goto:function(url)
  {
    //alert("navigatorTo "+url);
    if(app.token)
    {
      window.location.href = "userSettings.html";
    }
    else
    {
      //alert("请先登录");
      window.location.href = "login.html";
    }
  }

};
