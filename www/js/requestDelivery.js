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
  viewModel :{
    orderInfo:{
      send_address:{
        longitude:"经度",
        latitude:"纬度",
        city:"城市1",
        address:'123',
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
        city:"城市2",
        address:'',
      },
      delivery_floor: '',  
      additional_information: '',
      consignee_name:"",
      consignee_phone:"",  
      stars :"星级要求",
      bid_item:{ // 出价项 车型选择非卡车时才有
            freight:12,
            truckage:"13" ,
            tipping:"14"
      },
    },
    wenCengList :[],
    modelsList: [],
    selectedWenCeng:ko.observable(''),
    selectedModels:ko.observable(''),
    consignee_name:ko.observable(""),
    consignee_phone:ko.observable(""),  
    shipping_address:ko.observable(""),
    send_address:ko.observable(""),  
  },

  onLoad:function() {

      if (!window.device) {
          $(document).ready(this.onDeviceReady);
      } else {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      }

  },

    sendClick:function() {
    
        app.viewModel.orderInfo.wenCeng = app.viewModel.selectedWenCeng();
        app.viewModel.orderInfo.models = app.viewModel.selectedModels();
        app.viewModel.orderInfo.consignee_name =app.viewModel.consignee_name();
        app.viewModel.orderInfo.consignee_phone =app.viewModel.consignee_phone();

        if (app.viewModel.selectedModels() == '卡车'){
          
          var request = {
            Action:"HMSend",
            Token:app.token,
            parameter:app.viewModel.orderInfo
          };
          var url = app.serverUrl + JSON.stringify(request);
          commonJS.get(url,function(data_){
            if (data_.status===0) {
              //提示用户
              // alert("订单提交成功！");
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
          var request = {
            Action:"HMSend",
            Token:app.token,
            parameter:app.viewModel.orderInfo
          };
          var url = app.serverUrl + JSON.stringify(request);
          commonJS.get(url,function(data_){
            if (data_.status===0) {
              //提示用户
              // alert(JSON.stringify(data_));
              window.location.href="pushing.html?orderId="+data_.orderId;
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
        
        app.token = $.cookie("usrToken");
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

    },

};
