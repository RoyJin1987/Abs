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
 var waybills = {
            pushedOrders:ko.observableArray([]),
            cancelOrders:ko.observableArray([]),
            confirmOrders:ko.observableArray([]),
            completeOrders:ko.observableArray([])
        };

var app = {
    onLoad:function() {

        if (!window.device) {
            $(document).ready(this.onDeviceReady);
        } else {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }

    },

    // Application Constructor
    test: function(btn) {
        // var $orderblk = $(btn).parents(".order-info-block");
        // $orderblk.find(".brief").show();
        // $orderblk.find(".details").hide();
        // alert(orderId.id);
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
        app.receivedEvent('deviceready');
        //some test data
         
        var jsonStr = '{"Action":"OrderItems","status":0,"Token":"07b27a882cc721a9207250f1b6bd2868"}';
        var url = "http://112.124.122.107/Applications/web/?data=" + jsonStr;
        commonJS.get(url,function(text){        
            waybills.pushedOrders = text.items;
        });

        jsonStr = '{"Action":"OrderItems","status":1,"Token":"07b27a882cc721a9207250f1b6bd2868"}';
        url = "http://112.124.122.107/Applications/web/?data=" + jsonStr;
        commonJS.get(url,function(text){        
            waybills.cancelOrders = text.items;
        });

        jsonStr = '{"Action":"OrderItems","status":2,"Token":"07b27a882cc721a9207250f1b6bd2868"}';
        url = "http://112.124.122.107/Applications/web/?data=" + jsonStr;
        commonJS.get(url,function(text){        
            waybills.confirmOrders = text.items;
        });

        jsonStr = '{"Action":"OrderItems","status":3,"Token":"07b27a882cc721a9207250f1b6bd2868"}';
        url = "http://112.124.122.107/Applications/web/?data=" + jsonStr;  
        commonJS.get(url,function(text){        
            waybills.completeOrders = text.items;
        });

        for(var i in waybills.pushedOrders){
       
            var order = waybills.pushedOrders[i];
            order.responsers = ko.observableArray();
            jsonStr= {"Action":"HMList","Token":"07b27a882cc721a9207250f1b6bd2868","parameter":{"orderId":order.orderId,"page":1}};
            url = "http://112.124.122.107/Applications/web/?data=" + JSON.stringify(jsonStr);
            commonJS.get(url,function(text){  
                if (text.items!=null){
                    waybills.pushedOrders[i].responsers = text.items; 
                    waybills.pushedOrders[i].showModify = false;
                    waybills.pushedOrders[i].showCancel = true;
                }
            });
        }
            
        ko.applyBindings(waybills);
        $('body').trigger("create");

    },

    showDetails:function(btn){
        var $orderblk = $(btn).parents(".order-info-block");
        $orderblk.find(".brief").hide();
        $orderblk.find(".details").show();     
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    },
    
    hideDetails:function(btn){
        var $orderblk = $(btn).parents(".order-info-block");
        $orderblk.find(".brief").show();
        $orderblk.find(".details").hide();

    },
    toggleResponselist:function(btn){
        var $list = $(btn).parents(".details").find(".responser-list");
        if($list.find(".responser-list-item:visible").length>0) {
            $(btn).removeClass("ui-icon-carat-u").addClass("ui-icon-carat-d");
            $list.find(".responser-list-item:visible").hide();
        } else {
            $(btn).removeClass("ui-icon-carat-d").addClass("ui-icon-carat-u");
            $list.find(".responser-list-item").show();
        }  

    }
};
