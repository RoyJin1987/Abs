'use strict'
/*
 * app首页
 */
var app = {
  serverUrl: "http://112.124.122.107/Applications/web/?data=",
  token:"",
  motorcadeKey:"",
  orderId:"",
  model:"",
  usrName:"",
  usrImage:"",
  models:[],//车型
  nVehicles:[],//附近车辆
  vehicleMarkers:[],//附近车辆地图覆盖物
  currentModel:"",
	position:null,//当前Gps位置
  baiduPosition:null,//当前百度坐标
  vehiclePosition:null,//当前百度坐标
  map:null,//百度地图对象
  order:null,
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
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
      //app.receivedEvent('deviceready');
      if(typeof localStorage === 'undefined' )
      {
        app.token = $.cookie("usrToken");
        app.usrName = $.cookie("usrName");
        app.usrImage = $.cookie("usrImage");
      }
      else
      {
        app.token = localStorage["usrToken"];
        app.usrName = localStorage["usrName"];
        app.usrImage = localStorage["usrImage"];
      }

      if(!app.token)
      {
        alert("请先登录");
        window.location.href= "login.html";
      }

      app.orderId =commonJS.getUrlParam("orderId");
      app.motorcadeKey =commonJS.getUrlParam("motorcadeKey");
      app.model =commonJS.getUrlParam("model");
      var longitude = commonJS.getUrlParam("longitude");
      var latitude = commonJS.getUrlParam("latitude");
      
      if (app.motorcadeKey){
        document.getElementById("carTypeSelector").style.visibility="hidden";
        app.vehiclePosition = new BMap.Point(longitude,latitude);
      }else if (app.orderId){
        document.getElementById("carTypeSelector").style.visibility="hidden";
        document.getElementById("showTypeSelector").style.visibility="hidden";

        var request = {
          Action:"getOrderById",
          orderId:app.orderId,
          Token:app.token
        };
        var url = app.serverUrl + JSON.stringify(request);
        // debugger;
        commonJS.get(url,function(data){
          //alert(JSON.stringify(data));
          app.order = data.item;
        });
        
        request = {
          Action:"SHDetails",
          orderId:app.orderId,
          Token:app.token
        };
        url = app.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(data){
          if (data.status == 0) {
              app.order.SHDetails = data;
              //alert(JSON.stringify(data));
              app.model = data.motorcade.models;
              app.vehiclePosition = new BMap.Point(data.motorcade.address.longitude,data.motorcade.address.latitude);
          };  
        });
      }
      // if (app.token) {
      //   //已登录
      //   $("#usr-name").text("您好,"+app.usrName);
      // }
      // else
      // {
      //   //未登录
      //   $("#usr-name").text('您尚未登录');
      // }
      // if(app.usrImage){
        
      //   //$("#usr-image").src=app.usrImage;
      //   document.getElementById("usr-image").src = app.usrImage;
      // }
     
      // alert("screen height:"+screen.availHeight);
      // alert("screen height:"+$(".ui-page").first().height());
      $("#allmap").css("height",$(".ui-page").first().height()+"px");

      app.getModels(function(){
        if (app.model){
          app.currentModel = app.model;
        }else{
          app.currentModel = $("input[name='car-type'][checked='checked']").first().val();
        }
          
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

 	//加载地图
 	loadMap : function() {
 		app.map = new BMap.Map("allmap");
 		if (app.baiduPosition) {
      if (app.vehiclePosition){
        app.map.centerAndZoom(app.vehiclePosition, 14); 
      }else{
        app.map.centerAndZoom(app.baiduPosition, 14); 
      }
        
      // app.addMyLocMaker(app.baiduPosition); 
      //alert("loadmap-->>current model:"+app.currentModel);
      app.getNVehicles(app.currentModel);
 		} else {
        //test
       var point = new BMap.Point(121.605368,31.203069);
       if (app.vehiclePosition){
        app.map.centerAndZoom(app.vehiclePosition, 14); 
      }else{
        app.map.centerAndZoom(point, 14); 
      }
       
       app.baiduPosition = point;
       // app.addMyLocMaker(point);
       app.getNVehicles(app.currentModel);           
    }

    if (app.vehiclePosition){
      app.map.centerAndZoom(app.vehiclePosition, 14); 
    }

 	},

  // //刷新地图
  // refreshMap:function()
  // {
  //   if (app.map) {
  //     if (app.baiduPosition) {
  //        app.map.centerAndZoom(app.baiduPosition, 14);
  //        app.getNVehicles(app.currentModel);//默认获取两轮车
  //     };
  //   };
  // },

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

  addOrderMaker:function(BMapPoint,isAnimated,opts)  {
    if (!BMapPoint) { return;};
    if (app.map) {
      var vehicleImg = $("input[name='car-type'][value='"+app.currentModel+"']").attr('icon-path');
      // switch(vehicle.gid)
      // {
      //   case 1
      //   vehicleImg = "img/map/gid_1.png";
      //   break;
      //   case 2:
      //   vehicleImg = "img/map/gid_2.png";
      //   break;
      //   case 3:
      //   vehicleImg = "img/map/gid_3.png";
      //   break;
      //   default:
      //   vehicleImg = "img/map/gid_1.png";
      //   break;

      // }
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
      var statusDesc = "";
      switch(app.order.SHDetails.motorcade.current_status)
      {
        case 0:
        statusDesc = "未审核";
        break;
        case 1:
        statusDesc = "空闲";
        break;
        case 2:
        statusDesc = "运输中";
        break;
        case 3:
        statusDesc = "停运";
        break;
        default:
        statusDesc = "未审核";
        break;
      }

      //构造车辆信息窗口
      var content = "<div style='padding:2px 5px;font-size:.8em'>"
                     + "<div></div>"
                     +"<div style='position:relative;padding-right:55px'>"
                     +"<div style='position:absolute;right:0px;top:10px'>"
                     +"<a href=''><img style='width:80px;height:80px' src='img/map/xclx.png'></img></a></div>"
                     +"<div>订单信息</div>"
                     +"<div>姓名:"+app.order.SHDetails.user.name+"</div>"
                     +"<div>离我距离:"+1.5+"公里</div>"
                     +"<div>状态:"+statusDesc+"</div>"
                     +"<div>发货时间:"+app.order.ship_date+"</div></div>"
                     +"<div>发货地址:"+app.order.send_address.city+app.order.send_address.address+"</div>"
                     +"<div>送货地址:"+app.order.shipping_address.city+app.order.shipping_address.address+"</div>"
                     +"<div>车辆信息:</div></div>";
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

  addVehicleMaker:function(BMapPoint,isAnimated,opts,vehicle)  {
    if (!BMapPoint) { return;};
    if (app.map) {
      var vehicleImg = $("input[name='car-type'][value='"+app.currentModel+"']").attr('icon-path');
      // switch(vehicle.gid)
      // {
      //   case 1:
      //   vehicleImg = "img/map/gid_1.png";
      //   break;
      //   case 2:
      //   vehicleImg = "img/map/gid_2.png";
      //   break;
      //   case 3:
      //   vehicleImg = "img/map/gid_3.png";
      //   break;
      //   default:
      //   vehicleImg = "img/map/gid_1.png";
      //   break;

      // }
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
      var statusDesc = "";
      switch(vehicle.motorcade.status)
      {
        case 0:
        statusDesc = "未审核";
        break;
        case 1:
        statusDesc = "空闲";
        break;
        case 2:
        statusDesc = "运输中";
        break;
        case 3:
        statusDesc = "停运";
        break;
        default:
        statusDesc = "未审核";
        break;
      }

      //构造车辆信息窗口
      var content = "<div style='padding:2px 5px;font-size:.8em'>"
                     + "<div></div>"
                     +"<div style='position:relative;padding-right:55px'>"
                     +"<div style='position:absolute;right:0px;top:10px'>"
                     +"<a href=''><img style='width:80px;height:80px' src='img/map/xclx.png'></img></a></div>"
                     +"<div>订单信息</div>"
                     +"<div>姓名:"+vehicle.user.name+"</div>"
                     +"<div>离我距离:"+1.5+"公里</div>"
                     +"<div>状态:"+statusDesc+"</div>"
                     +"<div>发货时间:</div></div>"
                     +"<div>发货地址:</div>"
                     +"<div>送货地址:</div>"
                     +"<div>车辆信息:</div></div>";
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
    //清除车辆覆盖物
    // for(var i in app.vehicleMarkers)
    // {
    //   var marker = app.vehicleMarkers[i]
    //   app.map.removeOverlay(maker);
    // }
    // app.vehicleMarkers = [];
    app.map.clearOverlays();
    //alert("overlays count:"+app.map.getOverlays().length);
    // app.addMyLocMaker(app.baiduPosition); 
    if (app.order){
      var opts = {
        width : 100,    // 信息窗口宽度
        height: 60,     // 信息窗口高度
        title : "车牌号："+app.order.SHDetails.motorcade.license_plate_number, // 信息窗口标题
        enableAutoPan : true //自动平移
      };
      var point ={};
      if(app.order.SHDetails.motorcade.address.longitude === 0|| app.order.SHDetails.motorcade.address.latitude===0)
      {
        //车辆位置为0,随机取一点
        var bounds = app.map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var lngSpan = Math.abs(sw.lng - ne.lng);
        var latSpan = Math.abs(ne.lat - sw.lat);
        point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
      }else{
        point = new BMap.Point(app.order.SHDetails.motorcade.address.longitude,app.order.SHDetails.motorcade.address.latitude);
      }

      app.vehiclePosition= point;
      //app.map.panTo(point); 
      app.addOrderMaker(point,false,opts);  
      return;
    }
    //请求附近车辆
    var param = {
      Action:"TeamItems",
      models:model,
      // parameter:{
      //   latitude:app.baiduPosition.lat,
      //   longitude:app.baiduPosition.lng,
      //   page:1
      // }
      Token:app.token
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
        //alert(JSON.stringify(vehicle));
        if (app.motorcadeKey){
          if (app.motorcadeKey != vehicle.motorcade.motorcadeKey){
            continue;
          }
        }
        var opts = {
              width : 100,    // 信息窗口宽度
              height: 60,     // 信息窗口高度
              title : "车牌号："+vehicle.license_plate_number, // 信息窗口标题
              enableAutoPan : true //自动平移
        };
        var point ={};
        //alert(vehicle.motorcade.longitude);
        if(vehicle.motorcade.longitude*1 === 0|| vehicle.motorcade.latitude*1=== 0)
        {
          //continue;
          //alert("0");
         //车辆位置为0,随机取一点
          var bounds = app.map.getBounds();
          var sw = bounds.getSouthWest();
          var ne = bounds.getNorthEast();
          var lngSpan = Math.abs(sw.lng - ne.lng);
          var latSpan = Math.abs(ne.lat - sw.lat);
          point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
          //alert(JSON.stringify(point));
        }
        else
        {
           point = new BMap.Point(vehicle.motorcade.longitude,vehicle.motorcade.latitude);
           //alert(JSON.stringify(point));
        }

        if(i === 0)
        {
          app.vehiclePosition= point;
          app.map.panTo(point); 
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
      alert("个人设置部分正在加班加点，敬请期待！");
    }
    else
    {
      //alert("请先登录");
      window.location.href = "login.html";
    }
  }

};
