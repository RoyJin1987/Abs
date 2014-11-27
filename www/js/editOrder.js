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
  serverUrl:"http://112.124.122.107/Applications/web/?data=",
  token:"07b27a882cc721a9207250f1b6bd2868",
  orderId:"",
  baiduPosition:"",
  viewModel :{
    orderInfo:{},
    wenCengList :ko.observableArray(),
    modelsList: ko.observableArray(),
    selectedWenCeng:ko.observable(''),
    selectedModels:ko.observable(''),
    shipping_address:ko.observable(""),
    send_address:ko.observable(""), 
    send_city:"请点击选择城市", 
    shipping_city:"请点击选择城市",
    bid_item_tuijian:{ // 出价项 车型选择非卡车时才有
          freight:60,
          truckage:74,
          tipping:80,
    },  
  },


  onLoad:function() {

      if (!window.device) {
          $(document).ready(this.onDeviceReady);
      } else {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      }

  },

    sendClick:function() {
    
        app.viewModel.orderInfo.wenCeng = app.viewModel.selectedWenCeng;
        app.viewModel.orderInfo.models = app.viewModel.selectedModels();
        
        if (app.viewModel.selectedModels() == '8'){
          var order = app.extractOrder();
          var request = {
            Action:"OrderEdit",
            orderId:app.orderId,
            Token:app.token,
            parameter:order
          };
          //alert(JSON.stringify(app.viewModel.orderInfo));
          var url = app.serverUrl + JSON.stringify(request);
          window.location.href = url;
          commonJS.get(url,function(data_){
            if (data_.status===0) {
              //提示用户
              alert("订单提交成功！");
              window.location.href="pushing.html?orderId="+data_.orderId;
            }
            else{
              //提示用户
              alert(data_.message);
            }
          });
            
        }else{
          $.mobile.changePage("#offer");
        }

    },

    sendOrderClick:function() {
      //alert(app.viewModel.selectedModels());

      var order = app.extractOrder();

      var request = {
        Action:"OrderEdit",
        orderId:app.orderId,
        Token:app.token,
        parameter:order
      };
      var url = app.serverUrl + JSON.stringify(request);
      window.location.href = url;
      //alert(url);
      commonJS.get(url,function(data_){
        //alert(JSON.stringify(data_));
        if (data_.status===0) {
          //提示用户
          // alert("订单提交成功！");
          window.location.href="pushing.html?orderId="+app.orderId;
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
        if($.cookie('baiduPosition')){
          var position = $.cookie('baiduPosition');
          
          app.baiduPosition = JSON.parse(position);
          // alert(JSON.stringify(app.baiduPosition));
        }
        app.orderId = app.getUrlParam("orderId");
         if (app.orderId) {

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

          if(typeof localStorage === 'undefined' )
          {
              app.baiduPosition = {lng:121.654443,lat:31.653235};
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
   
           var request = {
                Action:"getOrderById",
                orderId:app.orderId,
                Token:app.token
            };
            url = app.serverUrl + JSON.stringify(request);
            // debugger;
            commonJS.get(url,function(data){
                //alert(JSON.stringify(data));
                app.viewModel.orderInfo = data.item;

                app.viewModel.orderInfo.send_address.address = ko.observable(data.item.send_address.address);
                app.viewModel.orderInfo.type = ko.observable(data.item.type);
                app.viewModel.orderInfo.weight = ko.observable(data.item.weight);
                app.viewModel.orderInfo.volume = ko.observable(data.item.volume);
                app.viewModel.orderInfo.ship_date_ = ko.observable(data.item.ship_date);
                app.viewModel.orderInfo.arrival_date_ = ko.observable(data.item.arrival_date);
                app.viewModel.orderInfo.consignee_name = ko.observable(data.item.consignee_name);
                app.viewModel.orderInfo.consignee_phone = ko.observable(data.item.consignee_phone);
                app.viewModel.orderInfo.shipping_address.address = ko.observable(data.item.shipping_address.address);
                app.viewModel.orderInfo.delivery_floor = ko.observable(data.item.delivery_floor);
                app.viewModel.orderInfo.additional_information = ko.observable(data.item.additional_information);
                app.viewModel.orderInfo.selectedModels = ko.observable(data.item.models);
                app.viewModel.orderInfo.bid_item.freight = ko.observable(data.item.bid_item.freight);
                app.viewModel.orderInfo.bid_item.truckage = ko.observable(data.item.bid_item.truckage);
                app.viewModel.orderInfo.bid_item.tipping = ko.observable(data.item.bid_item.tipping);
                app.viewModel.send_city = data.item.send_address.city;
                app.viewModel.shipping_city = data.item.shipping_address.city;

                // app.viewModel.orderInfo.ship_date =  ko.pureComputed(function() {
                //    return commonJS.jsonDateFormat(data.item.ship_date_());
                // });

                // app.viewModel.orderInfo.arrival_date =  ko.pureComputed(function() {
                //     return commonJS.jsonDateFormat(data.item.arrival_date_());
                // });

                app.viewModel.orderInfo.ship_date =  data.item.ship_date_();
                app.viewModel.orderInfo.arrival_date =  data.item.arrival_date_();
            
                // app.viewModel.orderInfo.bid_item.total = 200;
                app.viewModel.orderInfo.bid_item.total = ko.pureComputed(function() {
                    return app.viewModel.orderInfo.bid_item.freight()*1+app.viewModel.orderInfo.bid_item.tipping()*1+app.viewModel.orderInfo.bid_item.truckage()*1;
                });

                ko.applyBindings(app.viewModel);
                $('body').trigger("create");

                if (data.item.selectedModels){
                  //$("#modelsList").val(data.item.selectedModels);
                  app.viewModel.selectedModels(data.item.models);
                  //alert(app.viewModel.selectedModels());
                  $("#modelsList").selectmenu("refresh"); 
                }
                if (data.item.selectedModels){
                  app.viewModel.selectedWenCeng(data.item.wenceng);
                  $("#wencengList").selectmenu("refresh"); 
                }
                // setTimeout(function(){
                //   app.viewModel.orderInfo.bid_item.freight(100);
                // },5000);
                //app.viewModel.selectedModels = ko.observable("8");
                // alert(JSON.stringify(app.viewModel));
                // app.viewModel.consignee_name = app.viewModel.orderInfo.consignee_name();
                // app.viewModel.consignee_phone = app.viewModel.orderInfo.consignee_phone();
            });
        }
       

    },

    extractOrder:function()
    { 
        var clone = function clone(myObj){ 
          if(typeof(myObj) != 'object') return myObj; 
          if(myObj == null) return myObj; 
          var myNewObj = new Object(); 
          for(var i in myObj) 
          myNewObj[i] = clone(myObj[i]); 
          return myNewObj; 
        } 


        var order = clone(app.viewModel.orderInfo);
        order.send_address.address = app.viewModel.orderInfo.send_address.address();
        order.type = app.viewModel.orderInfo.type();
        order.weight = app.viewModel.orderInfo.weight();
        order.volume = app.viewModel.orderInfo.volume();
        order.ship_date = app.viewModel.orderInfo.ship_date_();
        order.arrival_date = app.viewModel.orderInfo.arrival_date_();
        order.consignee_name = app.viewModel.orderInfo.consignee_name();
        order.consignee_phone = app.viewModel.orderInfo.consignee_phone();
        order.shipping_address.address = app.viewModel.orderInfo.shipping_address.address();
        order.delivery_floor = app.viewModel.orderInfo.delivery_floor();
        order.additional_information = app.viewModel.orderInfo.additional_information();
        order.selectedModels = app.viewModel.orderInfo.selectedModels();
        order.bid_item.freight = app.viewModel.orderInfo.bid_item.freight();
        order.bid_item.truckage = app.viewModel.orderInfo.bid_item.truckage();
        order.bid_item.tipping = app.viewModel.orderInfo.bid_item.tipping();
        order.consignor = $.cookie("usrName");
        order.send_address.longitude = app.baiduPosition.lng;
        order.send_address.latitude = app.baiduPosition.lat;

        return order;
    },

    getUrlParam : function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    }
};
