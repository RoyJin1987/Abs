/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
  id:"",
  identity:"",
  position:{},
  baiduPosition:{},
  serverUrl:"http://112.124.122.107/Applications/web/?data=",
  token:"",
  map:{},
  loacalSearch:{},
  $addressList :{},
  viewModel :{
    orderInfo:{
      send_address:{
        longitude:"",
        latitude:"",
        city:"上海市",
        address:'',
      },
      consignor:"测试人",
      type:'',
      weight: '',
      volume: '',
      ship_date: '',
      arrival_date: '',
      shipping_address:{
        longitude:"",
        latitude:"",
        city:"上海市",
        address:'',
      },
      delivery_floor: '',  
      additional_information: '',
      consignee_name:"",
      consignee_phone:"",  
      stars :"0",
      bid_item:{ // 出价项 车型选择非卡车时才有
          freight:60,
          truckage:74,
          tipping:80,
      },
      distance:ko.observable(-1),
    },
    bid_item_tuijian:{ // 出价项 车型选择非卡车时才有
          freight:ko.observable(0),
          truckage:ko.observable(0),
          tipping:ko.observable(0),
    },
    wenCengList :[],
    modelsList: [],
    selectedWenCeng:ko.observable(''),
    selectedModels:ko.observable(''),
    consignee_name:ko.observable(""),
    consignee_phone:ko.observable(""),  
    shipping_address:ko.observable(""),
    send_address:ko.observable(""),  
    send_city:"请选择城市", 
    shipping_city:"请选择城市", 
  },

  onLoad:function() {

      if (!window.device) {
          $(document).ready(this.onDeviceReady);
      } else {
          document.addEventListener('deviceready', this.onDeviceReady, false);
          //document.addEventListener("backbutton", commonJS.goback(), false);
      }
      // document.addEventListener('deviceready', this.onDeviceReady, false);

  },

  sendClick:function() {
  
      // app.viewModel.orderInfo.wenCeng = app.viewModel.selectedWenCeng();
      // app.viewModel.orderInfo.models = app.viewModel.selectedModels();
      // app.viewModel.orderInfo.consignee_name =app.viewModel.consignee_name();
      // app.viewModel.orderInfo.consignee_phone =app.viewModel.consignee_phone();
      // app.viewModel.orderInfo.bid_item.freight = app.viewModel.freight();
      // app.viewModel.orderInfo.bid_item.truckage = app.viewModel.truckage();
      // app.viewModel.orderInfo.bid_item.tipping =app.viewModel.tipping();
      // app.viewModel.orderInfo.send_address.longitude = app.baiduPosition.lng;
      // app.viewModel.orderInfo.send_address.latitude = app.baiduPosition.lat;
      // app.viewModel.orderInfo.shipping_address.longitude = app.baiduPosition.lng;
      // app.viewModel.orderInfo.shipping_address.latitude = app.baiduPosition.lat;
      // app.viewModel.orderInfo.send_address.city = $("#send_city_hidden").text();
      // app.viewModel.orderInfo.send_address.address = $("#send_county_hidden").text() + app.viewModel.send_address();
      // app.viewModel.orderInfo.shipping_address.city = $("#shipping_city_hidden").text();
      // app.viewModel.orderInfo.shipping_address.address = $("#shipping_county_hidden").text() + app.viewModel.shipping_address();
      // app.viewModel.orderInfo.consignor = $.cookie("usrName");

      var order = app.extractOrder(false);
      if(order==null){
        return;
      }

      if (app.viewModel.selectedModels() == '8'){
        var request;
        if (app.id){
          request = {
            Action:"CalledTA",
            Token:app.token,
            ID:app.id,
            parameter:order
          };
        }else{
          request = {
            Action:"HMSend",
            Token:app.token,
            parameter:order
          };
        }
        var url = app.serverUrl + JSON.stringify(request);
        
        commonJS.get(url,function(data_){
          //alert(JSON.stringify(data_));
          if (data_.status===0) {
            //提示用户
            // alert("订单提交成功！");
            if (app.id){
              alert("下单成功");
              var message = { 
                  type:"newOrder",
                  orderId:data_.orderId
              };
              //alert(app.identity);
              if (window.notificationClient){
                window.notificationClient.notify(app.identity,JSON.stringify(message));  
              }
               window.location.href="myOrder.html";
              // $("#confirm-succ-dialog").find(".confirm-btn").attr("href","myOrder.html");
              // $.mobile.changePage("#confirm-succ-dialog");
            }else{
              // $("#confirm-succ-dialog").find(".confirm-btn").attr("href","pushing.html?orderId="+data_.orderId);
              // $.mobile.changePage("#confirm-succ-dialog");
              window.location.href="pushing.html?orderId="+data_.orderId;
            }
            
          }
          else{
            //提示用户
            alert(data_.message);
          }
        });
          
      }else{
        if(app.viewModel.orderInfo.distance() >0)
        {
          app.viewModel.bid_item_tuijian.freight((app.viewModel.orderInfo.distance() * 0.005).toFixed(0));
          app.viewModel.bid_item_tuijian.truckage((app.viewModel.orderInfo.distance() * 0.003).toFixed(0));
          app.viewModel.bid_item_tuijian.tipping ((app.viewModel.orderInfo.distance() * 0.0005).toFixed(0));


          app.viewModel.orderInfo.bid_item.freight(app.viewModel.bid_item_tuijian.freight());
          app.viewModel.orderInfo.bid_item.truckage(app.viewModel.bid_item_tuijian.truckage());
          app.viewModel.orderInfo.bid_item.tipping(app.viewModel.bid_item_tuijian.tipping());
        }


        $.mobile.changePage("#offer");
        // alert(app.viewModel.orderInfo.bid_item.freight());
        $("#slider1").val(app.viewModel.orderInfo.bid_item.freight()*1).slider("refresh");
        $("#slider2").val(app.viewModel.orderInfo.bid_item.truckage()*1).slider("refresh");
        $("#slider3").val(app.viewModel.orderInfo.bid_item.tipping()*1).slider("refresh");
        $("#carType").text($("#modelsList").find("option:selected").text());
      }

  },

    selectCity:function(type){
      window.notificationClient.selectCity(type);
    },
    sendOrderClick:function() {
      var order = app.extractOrder(true);
      if(order==null){
        return;
      }
      var request;
      if (app.id){
        request = {
          Action:"CalledTA",
          Token:app.token,
          ID:app.id,
          parameter:order
        };
      }else{
        request = {
          Action:"HMSend",
          Token:app.token,
          parameter:order
        };
      }
      var url = app.serverUrl + JSON.stringify(request);
      commonJS.get(url,function(data_){
        if (data_.status===0) {
          //alert(JSON.stringify(data_));
            if (app.id){
              alert("下单成功");
              var message = { 
                  type:"newOrder",
                  orderId:data_.orderId
              };
              //alert(app.identity);

              if (window.notificationClient){
                //alert(app.identity);
                window.notificationClient.notify(app.identity,JSON.stringify(message));  
              }
              //$("#confirm-succ-dialog").find(".confirm-btn").attr("href","myOrder.html");
              //$.mobile.changePage("#confirm-succ-dialog");
              window.location.href="myOrder.html";
            }else{
              //$("#confirm-succ-dialog").find(".confirm-btn").attr("href","pushing.html?orderId="+data_.orderId);
              //$.mobile.changePage("#confirm-succ-dialog");
              window.location.href="pushing.html?orderId="+data_.orderId;
            }
        }
        else{
     
           //提示用户
          alert(data_.message);
        }
      });
            
    },
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
      document.addEventListener('backbutton', commonJS.goback, false);
      var date = new Date();
      date.setMinutes(date.getMinutes()+30);
    
      $('#deliveryDate').mobiscroll().datetime({
          theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
          mode: "scroller",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
          display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
          lang: "zh",       // Specify language like: lang: 'pl' or omit setting to use default
          minDate: new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()),  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
          maxDate: new Date(date.getFullYear()+1,date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()),   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
          stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
      });

      //app.loadNavigator();
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

      if(!app.token)
      {
        alert("请先登录");
        window.location.href= "login.html";
      }

      var defaultModel = commonJS.getUrlParam("model");
      app.id = commonJS.getUrlParam("id");
      app.identity =commonJS.getUrlParam("identity");
      //双向绑定可编辑字段
      app.viewModel.orderInfo.send_address.address = ko.observable(app.viewModel.orderInfo.send_address.address);
      app.viewModel.orderInfo.send_address.longitude = ko.observable(app.viewModel.orderInfo.send_address.longitude);
      app.viewModel.orderInfo.send_address.latitude = ko.observable(app.viewModel.orderInfo.send_address.latitude);


      app.viewModel.orderInfo.type = ko.observable(app.viewModel.orderInfo.type);
      app.viewModel.orderInfo.weight = ko.observable(app.viewModel.orderInfo.weight);
      app.viewModel.orderInfo.volume = ko.observable(app.viewModel.orderInfo.volume);
      
      app.viewModel.orderInfo.ship_date_ = ko.observable( commonJS.jsonDateFormat(Date.parse(date)/1000));
      app.viewModel.orderInfo.arrival_date_ = ko.observable( Date.parse(new Date())/1000);
      app.viewModel.orderInfo.consignee_name = ko.observable(app.viewModel.orderInfo.consignee_name);
      app.viewModel.orderInfo.consignee_phone = ko.observable(app.viewModel.orderInfo.consignee_phone);

      app.viewModel.orderInfo.shipping_address.address = ko.observable(app.viewModel.orderInfo.shipping_address.address);
      app.viewModel.orderInfo.shipping_address.longitude = ko.observable(app.viewModel.orderInfo.shipping_address.longitude);
      app.viewModel.orderInfo.shipping_address.latitude = ko.observable(app.viewModel.orderInfo.shipping_address.latitude);
      app.viewModel.orderInfo.distance = ko.observable(-1);

      app.viewModel.orderInfo.delivery_floor = ko.observable(app.viewModel.orderInfo.delivery_floor);
      app.viewModel.orderInfo.additional_information = ko.observable(app.viewModel.orderInfo.additional_information);
      // app.viewModel.orderInfo.selectedModels = ko.observable(app.viewModel.orderInfo.selectedModels);
      app.viewModel.orderInfo.bid_item.freight = ko.observable(app.viewModel.orderInfo.bid_item.freight);
      app.viewModel.orderInfo.bid_item.truckage = ko.observable(app.viewModel.orderInfo.bid_item.truckage);
      app.viewModel.orderInfo.bid_item.tipping = ko.observable(app.viewModel.orderInfo.bid_item.tipping);

      //  app.viewModel.orderInfo.ship_date =  ko.pureComputed({
      //   read:function() {
      //    return commonJS.jsonDateFormat(app.viewModel.orderInfo.ship_date_());
      //   },
      //   write:function(value)
      //   {
      //     app.viewModel.orderInfo.ship_date_(value);
      //   },
      //   owner:app.viewModel.orderInfo
      // });
      app.viewModel.orderInfo.arrival_date =  ko.pureComputed({
        read:function() {
          return commonJS.jsonDateFormat(app.viewModel.orderInfo.arrival_date_());
        },
        write:function(value)
        {
          app.viewModel.orderInfo.arrival_date_(value);
        },
        owner:app.viewModel.orderInfo
      });
      app.viewModel.selectedWenCeng ("3");
      // app.viewModel.orderInfo.bid_item.total = 200;
      app.viewModel.orderInfo.bid_item.total = ko.pureComputed(function() {
          return app.viewModel.orderInfo.bid_item.freight()*1+app.viewModel.orderInfo.bid_item.tipping()*1+app.viewModel.orderInfo.bid_item.truckage()*1;
      });

      if(typeof localStorage === 'undefined' || typeof locationService === 'undefined' )
      {
          app.baiduPosition = {lng:121.608557,lat:31.209932};
      }
      else
      {
        if(localStorage['baiduPosition'])
        {
          app.baiduPosition = JSON.parse(localStorage['baiduPosition']);
          //alert(localStorage['baiduPosition']);
        }
        if (!app.baiduPosition){
            var callback = function(pos){
                app.baiduPosition = new BMap.Point(pos.coords.longitude,pos.coords.latitude);
                 // $.cookie('baiduPosition', JSON.stringify(app.baiduPosition), { expires: 1, path: '/' });
                localStorage.setItem('baiduPosition',JSON.stringify(app.baiduPosition));
                //alert(localStorage['baiduPosition']);
                //alert(localStorage['baiduPosition']);
                window.locationService.stop(noop,noop);
            }
            if(window.locationService)
            {
              window.locationService.getCurrentPosition(callback,function(e){
                window.locationService.stop(noop,noop);
              });
            }

        }else{
          //alert(JSON.stringify(app.baiduPosition));
        }
      }
      app.map = new BMap.Map("abs-map");        
      app.map.centerAndZoom(app.baiduPosition, 11);

      var jsonStr = '{"Action":"getWenceng"}';
      var url = app.serverUrl +  jsonStr;
      commonJS.get(url,function(text){ 
        app.viewModel.wenCengList = text.items;
      });

      jsonStr = '{"Action":"getModels"}';
      url = app.serverUrl + jsonStr;
      commonJS.get(url,function(text){      
        if (defaultModel && app.id){
          for (var i in text.items){
            var model = text.items[i];
            //alert(JSON.stringify(model));
            if(model.id ==defaultModel){
              app.viewModel.modelsList =[model];
              break;
            }
          }
        }else{
          app.viewModel.modelsList = text.items;
        }
        
      });
      //alert(JSON.stringify(app.viewModel.modelsList ));
      ko.applyBindings(app.viewModel);
      $('body').trigger("create");
      if (defaultModel){
        //$("#modelsList").val(defaultModel);
        app.viewModel.selectedModels(defaultModel);
        $("#modelsList").selectmenu("refresh"); 
      }

      var options = {
        onSearchComplete: function(results){
          // 判断状态是否正确
          if (app.loacalSearch.getStatus() == BMAP_STATUS_SUCCESS){
            // var s = [];
            var html = "";
            for (var i = 0; i < results.getCurrentNumPois(); i ++){
              // s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
               html += "<li><a href='#' onclick='app.bindAdrress(this)' lat="+results.getPoi(i).point.lat+" lng="+results.getPoi(i).point.lng+">" +  results.getPoi(i).title + "</a></li>";
            }
            var $ul = app.$addressList;
            $ul.html( html );
            $ul.listview( "refresh" );
            $ul.trigger( "updatelayout");
          }
        },
        pageCapacity:20

      };
      app.loacalSearch = new BMap.LocalSearch(app.map, options);

     $( "#send_address" ).on("filterablebeforefilter", function ( e, data ) {
      var $ul = $( this ),
          $input = $( data.input ),
          value = $input.val(),
          html = "";
          $ul.html( "" );
          if ( value && value.length > 2 ) {
              $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
              $ul.listview( "refresh" );
              app.$addressList = $ul;
              app.loacalSearch.search($input.val());
          }
     });

     $( "#shipping_address" ).on("filterablebeforefilter", function ( e, data ) {
      var $ul = $( this ),
          $input = $( data.input ),
          value = $input.val(),
          html = "";
          $ul.html( "" );
          if ( value && value.length > 2 ) {
              $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
              $ul.listview( "refresh" );
              app.$addressList = $ul;
              app.loacalSearch.search($input.val());
          }
     });

     $("a.plus-expense").on("click", function ( e, data ){
        var $self = $(this);
        var $input = $self.parents(".form-line-wrapper").find("input");
        if (($input.val()*1 + 10)>100000) {
          return;
        }else{
          $input.val($input.val()*1+10);
        }
     });
     $("a.minus-expense").on("click", function ( e, data ){
        var $self = $(this);
        var $input = $self.parents(".form-line-wrapper").find("input");
        if (($input.val()*1 - 10)<0) {
          return;
        }else{
          $input.val($input.val()*1-10);
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
         // if (app.map) {
         //    app.refreshMap();
         // } else {
         //    app.loadMap();
         // };
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

  extractOrder:function(isInCity)
  { 
      var clone = function clone(myObj){ 
        if(typeof(myObj) != 'object') return myObj; 
        if(myObj == null) return myObj; 
        var myNewObj = new Object(); 
        for(var i in myObj) 
        myNewObj[i] = clone(myObj[i]); 
        return myNewObj; 
      } 

      var formatDate = function (timetick) {  
          var   d=new Date(timetick);    
          var   year=d.getFullYear();     
          var   month=d.getMonth()+1;     
          var   date=d.getDate();     
          var   hour=d.getHours();     
          var   minute=d.getMinutes();     
          var   second=d.getSeconds();     
          return   year+"-"+month+"-"+date+" "+hour+":"+minute;     
      }     
      
      var order = clone(app.viewModel.orderInfo);

      var selectCity = "sh pd option";//document.getElementById('txt_send_city').innerText;
      if ( selectCity=="请选择城市"){
          if (window.notificationClient){
              window.notificationClient.showToast("请选择发货城市");  
              window.notificationClient.selectCity(0);
          }
          return null;
      }

      var cityCounty = ["上海","浦东"];//$("#send_city_county_hidden").text().split(",");
      if (!app.viewModel.orderInfo.send_address.address()
        ||app.viewModel.orderInfo.send_address.address() !== $("#send_address").prev().find("input").val() ) {
        app.viewModel.orderInfo.send_address.address($("#send_address").prev().find("input").val());
        app.viewModel.orderInfo.send_address.longitude("");
        app.viewModel.orderInfo.send_address.latitude("");
        app.viewModel.orderInfo.distance(-1);
      };

     
      if (app.viewModel.orderInfo.send_address.address()){
        order.send_address.address = app.viewModel.orderInfo.send_address.address();
        order.send_address.city = selectCity;
        order.send_address.longitude = app.viewModel.orderInfo.send_address.longitude();
        order.send_address.latitude = app.viewModel.orderInfo.send_address.latitude();

      }else{
        if (window.notificationClient){
          window.notificationClient.showToast("请输入发货地址");  
        }
        return null;
      }
      
      
      if (app.viewModel.orderInfo.consignee_name()){
          order.consignee_name = app.viewModel.orderInfo.consignee_name();
      }else{
          if (window.notificationClient){
            window.notificationClient.showToast("请输入收货人姓名");  
            $("#receiver").focus();
          }
          return null;
      }
      if (app.viewModel.orderInfo.consignee_phone()){
          var regPartton=/1[3-8]+\d{9}/;
          if(!regPartton.test(app.viewModel.orderInfo.consignee_phone())){
            window.notificationClient.showToast("手机号码格式不正确！");  
            $("#tel").focus();
            return null;
          }
          order.consignee_phone = app.viewModel.orderInfo.consignee_phone();
      }else{
          if (window.notificationClient){
            window.notificationClient.showToast("请输入收货人电话");  
            $("#tel").focus();
          }
          return null;
      }

      //selectCity = document.getElementById('txt_shipping_city').innerText;
      if ( selectCity=="请选择城市"){
          if (window.notificationClient){
              window.notificationClient.showToast("请选择收货城市");  
              window.notificationClient.selectCity(1);
          }
          return null;
      }
      //var shipCityCounty = ["上海","浦东"];//$("#shipping_city_county_hidden").text().split(",");
      if (!app.viewModel.orderInfo.shipping_address.address() 
      ||app.viewModel.orderInfo.shipping_address.address() !== $("#shipping_address").prev().find("input").val() ) {
        app.viewModel.orderInfo.shipping_address.address($("#shipping_address").prev().find("input").val());
        app.viewModel.orderInfo.shipping_address.longitude("");
        app.viewModel.orderInfo.shipping_address.latitude("");
        app.viewModel.orderInfo.distance (-1);
      };
   
      if (app.viewModel.orderInfo.shipping_address.address()){
        order.shipping_address.address = app.viewModel.orderInfo.shipping_address.address();
        order.shipping_address.city = selectCity;
        order.shipping_address.longitude = app.viewModel.orderInfo.shipping_address.longitude();
        order.shipping_address.latitude = app.viewModel.orderInfo.shipping_address.latitude();
      }else{
        if (window.notificationClient){
          window.notificationClient.showToast("请输入收货地址");  
          $("#shipping_address").focus();
        }
        return null;
      }

      order.type = app.viewModel.orderInfo.type();
      if ( app.viewModel.orderInfo.weight() <= 10000 && app.viewModel.orderInfo.weight()>0) {
        order.weight = app.viewModel.orderInfo.weight();
      }else{
         if (window.notificationClient){
            window.notificationClient.showToast("货物重量应在1~10000之间");  
            $("#weight").focus();
          }
          return null;
      }
      
      if ( app.viewModel.orderInfo.volume() <= 1000 &&app.viewModel.orderInfo.volume() >0) {
         order.volume = app.viewModel.orderInfo.volume();
      }else{
         if (window.notificationClient){
            window.notificationClient.showToast("货物体积应在1~1000");  
            $("#weight").focus();
          }
          return null;
      }
     
      order.ship_date = formatDate(app.viewModel.orderInfo.ship_date_());
      order.arrival_date = formatDate(app.viewModel.orderInfo.arrival_date_());
      
      order.delivery_floor = app.viewModel.orderInfo.delivery_floor();
      order.additional_information = app.viewModel.orderInfo.additional_information();
      // order.selectedModels = app.viewModel.orderInfo.selectedModels();
      if (isInCity){
        order.bid_item.freight = app.viewModel.orderInfo.bid_item.freight();
        order.bid_item.truckage = app.viewModel.orderInfo.bid_item.truckage();
        order.bid_item.tipping = app.viewModel.orderInfo.bid_item.tipping();
      }else{
        order.bid_item.freight = '';
        order.bid_item.truckage = '';
        order.bid_item.tipping = '';
      }
      
      if(typeof localStorage === 'undefined' )
      {
          order.consignor = $.cookie("usrName");
      }
      else
      {
          order.consignor = localStorage['usrName'];
      }
      
      
      order.wenceng = app.viewModel.selectedWenCeng();
      order.models = app.viewModel.selectedModels();
      
      //alert("order info:"+JSON.stringify(order));
      return order;
  },

  bindAdrress:function(btn)
  {
    var $li = $(btn).parent();
    var $ul = $li.parent();
    $ul.prev().find("input").val($(btn).text());
    $ul.html( "" );
    $ul.listview( "refresh" );
    $ul.trigger( "updatelayout");
    var point =  {
      lng:$(btn).attr("lng"),
      lat:$(btn).attr("lat")
    }
    if ($ul.attr("id") === "send_address") {
      app.viewModel.orderInfo.send_address.address ($(btn).text());
      app.viewModel.orderInfo.send_address.longitude(point.lng);
      app.viewModel.orderInfo.send_address.latitude (point.lat);
    }
    else if($ul.attr("id") === "shipping_address")
    {
      app.viewModel.orderInfo.shipping_address.address ($(btn).text());
      app.viewModel.orderInfo.shipping_address.longitude(point.lng);
      app.viewModel.orderInfo.shipping_address.latitude(point.lat);
    }
    if (app.viewModel.orderInfo.send_address.longitude() 
       && app.viewModel.orderInfo.send_address.latitude() 
        && app.viewModel.orderInfo.shipping_address.longitude() 
        && app.viewModel.orderInfo.shipping_address.latitude()) {
      var start = {
        lng:app.viewModel.orderInfo.send_address.longitude() ,
        lat:app.viewModel.orderInfo.send_address.latitude() 
      };
      var destination = {
        lng:app.viewModel.orderInfo.shipping_address.longitude(),
        lat:app.viewModel.orderInfo.shipping_address.latitude()
      }
      app.viewModel.orderInfo.distance(app.getDistance(start,destination).toFixed(0));
    };
  },

  getDistance:function(p1,p2)
  {
      var pk = 180 / 3.1415927;
      a1 = p1.lat / pk;
      a2 = p1.lng / pk;
      b1 = p2.lat / pk;
      b2 = p2.lng / pk;
      t1 = Math.cos(a1) * Math.cos(a2) * Math.cos(b1) * Math.cos(b2);
      t2 = Math.cos(a1) * Math.sin(a2) * Math.cos(b1) * Math.sin(b2);
      t3 = Math.sin(a1) * Math.sin(b1);
      tt = Math.acos(t1 + t2 + t3);
      return 6366000 * tt;
  }

};
