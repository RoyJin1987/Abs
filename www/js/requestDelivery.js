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
  viewModel :{
    orderInfo:{
      send_address:{
        longitude:"经度",
        latitude:"纬度",
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
        longitude:"经度",
        latitude:"纬度",
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
    },
    bid_item_tuijian:{ // 出价项 车型选择非卡车时才有
          freight:60,
          truckage:74,
          tipping:80,
    },
    wenCengList :[],
    modelsList: [],
    selectedWenCeng:ko.observable(''),
    selectedModels:ko.observable(''),
    consignee_name:ko.observable(""),
    consignee_phone:ko.observable(""),  
    shipping_address:ko.observable(""),
    send_address:ko.observable(""),  
    send_city:"请点击选择城市", 
    shipping_city:"请点击选择城市", 
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
      if (app.viewModel.selectedModels() == '8'){
        var request;
        if (app.id){
          request = {
            Action:"CalledTA",
            Token:app.token,
            id:app.id
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
            }else{
              window.location.href="pushing.html?orderId="+data_.orderId;
            }
            
          }
          else{
            //提示用户
            alert(data_.message);
          }
        });
          
      }else{
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
      var request;
      if (app.id){
        request = {
          Action:"CalledTA",
          Token:app.token,
          id:app.id
        };
      }else{
        request = {
          Action:"HMSend",
          Token:app.token,
          parameter:order
        };
      }
      //alert("订单创建:"+ JSON.stringify(request));
      var url = app.serverUrl + JSON.stringify(request);
      commonJS.get(url,function(data_){
        if (data_.status===0) {
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
            }else{
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
      app.viewModel.orderInfo.type = ko.observable(app.viewModel.orderInfo.type);
      app.viewModel.orderInfo.weight = ko.observable(app.viewModel.orderInfo.weight);
      app.viewModel.orderInfo.volume = ko.observable(app.viewModel.orderInfo.volume);
      app.viewModel.orderInfo.ship_date_ = ko.observable( Date.parse(new Date())/1000);
      app.viewModel.orderInfo.arrival_date_ = ko.observable( Date.parse(new Date())/1000);
      app.viewModel.orderInfo.consignee_name = ko.observable(app.viewModel.orderInfo.consignee_name);
      app.viewModel.orderInfo.consignee_phone = ko.observable(app.viewModel.orderInfo.consignee_phone);
      app.viewModel.orderInfo.shipping_address.address = ko.observable(app.viewModel.orderInfo.shipping_address.address);
      app.viewModel.orderInfo.delivery_floor = ko.observable(app.viewModel.orderInfo.delivery_floor);
      app.viewModel.orderInfo.additional_information = ko.observable(app.viewModel.orderInfo.additional_information);
      // app.viewModel.orderInfo.selectedModels = ko.observable(app.viewModel.orderInfo.selectedModels);
      app.viewModel.orderInfo.bid_item.freight = ko.observable(app.viewModel.orderInfo.bid_item.freight);
      app.viewModel.orderInfo.bid_item.truckage = ko.observable(app.viewModel.orderInfo.bid_item.truckage);
      app.viewModel.orderInfo.bid_item.tipping = ko.observable(app.viewModel.orderInfo.bid_item.tipping);

       app.viewModel.orderInfo.ship_date =  ko.pureComputed({
        read:function() {
         return commonJS.jsonDateFormat(app.viewModel.orderInfo.ship_date_());
        },
        write:function(value)
        {
          app.viewModel.orderInfo.ship_date_(value);
        },
        owner:app.viewModel.orderInfo
      });
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

      if(typeof localStorage === 'undefined' )
      {
          app.baiduPosition = {lng:121.654443,lat:31.653235};
      }
      else
      {
           app.baiduPosition = localStorage['baiduPosition'];
      }

      var jsonStr = '{"Action":"getWenceng"}';
      var url = app.serverUrl +  jsonStr;
      commonJS.get(url,function(text){ 
        app.viewModel.wenCengList = text.items;
      });

      jsonStr = '{"Action":"getModels"}';
      url = app.serverUrl + jsonStr;
      commonJS.get(url,function(text){      
        app.viewModel.modelsList = text.items;
      });
 
      ko.applyBindings(app.viewModel);
      $('body').trigger("create");
      if (defaultModel){
        //$("#modelsList").val(defaultModel);
        app.viewModel.selectedModels(defaultModel);
        $("#modelsList").selectmenu("refresh"); 
      }
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
  
      order.type = app.viewModel.orderInfo.type();
      order.weight = app.viewModel.orderInfo.weight();
      order.volume = app.viewModel.orderInfo.volume();
      order.ship_date = formatDate(app.viewModel.orderInfo.ship_date_());
      order.arrival_date = formatDate(app.viewModel.orderInfo.arrival_date_());
      order.consignee_name = app.viewModel.orderInfo.consignee_name();
      order.consignee_phone = app.viewModel.orderInfo.consignee_phone();
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
      
      order.send_address.longitude = app.baiduPosition.lng;
      order.send_address.latitude = app.baiduPosition.lat;
      order.wenceng = app.viewModel.selectedWenCeng();
      order.models = app.viewModel.selectedModels();
      var cityCounty = $("#send_city_county_hidden").text().split(",");
      if (cityCounty){
        order.send_address.address = cityCounty[1] + app.viewModel.orderInfo.send_address.address();
        order.send_address.city = cityCounty[0];
      }else{
        order.send_address.address = app.viewModel.orderInfo.send_address.address();
      }
      
      var shipCityCounty = $("#shipping_city_county_hidden").text().split(",");
      if (shipCityCounty){
        order.shipping_address.city = shipCityCounty[0];
        order.shipping_address.address = shipCityCounty[1] + app.viewModel.orderInfo.shipping_address.address();
      }else{
        order.shipping_address.address = app.viewModel.orderInfo.shipping_address.address();
      }
      
      //alert("order info:"+JSON.stringify(order));
      return order;
  },

};
