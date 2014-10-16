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

  var viewModel = {
         wenCeng : ko.observableArray([]),
         models: ko.observableArray([]),
         send_address:ko.observable(''),
         goodsType:ko.observable(''),
         weight: ko.observable(''),
         volume: ko.observable(''),
         ship_date: ko.observable(''),
         arrival_date: ko.observable(''),
         shipping_address: ko.observable(''),
         delivery_floor: ko.observable(''),
         additional_information: ko.observable(''),
         selectedWenCeng:ko.observable(),
         selectedModel:ko.observable(''),
    };

var app = {
    onLoad:function() {

        if (!window.device) {
            $(document).ready(this.onDeviceReady);
        } else {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }

    },

    sendClick:function() {

        if (viewModel.selectedModel() == '8'){
            // 提交
            var jsonStr= {"Action":"HMSend","Token":"07b27a882cc721a9207250f1b6bd2868","parameter":{"send_address":{"address":viewModel.send_address()}，
            "consignor":"小王","type":viewModel.goodsType(),"wenceng":viewModel.selectedWenCeng(),"weight":models.weight(),
            "volume":viewModel.volume(),"ship_date":viewModel.ship_date(),"arrival_date":viewModel.arrival_date(),"shipping_address":{"address":viewModel.shipping_address()}，
            "delivery_floor":viewModel.delivery_floor(),"additional_information":viewModel.additional_information()}};
            var url = "http://112.124.122.107/Applications/web/?data=" + JSON.stringify(jsonStr);
            commonJS.get(url,function(text){  
                
                    alert(JSON.stringify(text));
                
            });
        }else{
            // 出价页
        }

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
        
        var jsonStr = '{"Action":"getWenceng"}';
        var url = "http://112.124.122.107/Applications/web/?data=" + jsonStr;
        commonJS.get(url,function(text){ 
            viewModel.wenCeng = text.items;
        });

        jsonStr = '{"Action":"getModels"}';
        url = "http://112.124.122.107/Applications/web/?data=" + jsonStr;
        commonJS.get(url,function(text){       
            for(var i in text.items){
                viewModel.models = text.items;
            }
        });
            
        ko.applyBindings(viewModel);
        $('body').trigger("create");

    },

};
