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
            submitOrders:ko.observableArray([]),
            confirmOrders:ko.observableArray([]),
            completeOrders:ko.observableArray([])
        };

var app = {
    serverUrl:"http://112.124.122.107/Applications/web/?data=",
    token:"",
  onLoad:function() {

        if (!window.device) {
            $(document).ready(this.onDeviceReady);
        } else {
            document.addEventListener('deviceready', this.onDeviceReady, false);
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
        app.token = $.cookie("usrToken");
        app.receivedEvent('deviceready');


        app.refresh(0);
        //  var request = {
        //         Action:"WaybillItems",
        //         status:0,
        //         Token:app.token
        //     };
        // var url = app.serverUrl + JSON.stringify(request);
        // commonJS.get(url,function(text){
        //     for(var i in text.items)
        //     {
        //         var order = text.items[i];
        //         order.responsers = ko.observableArray();
        //         waybills.pushedOrders.push(order);
        //     }        
        // });

        // request = {
        //         Action:"WaybillItems",
        //         status:1,
        //         Token:app.token
        //     };
        // url = app.serverUrl + JSON.stringify(request);
        // commonJS.get(url,function(text){
        //     for(var i in text.items)
        //     {
        //         var order = text.items[i];
        //         waybills.submitOrders.push(order);
        //     }            
        // });

        // request = {
        //         Action:"WaybillItems",
        //         status:2,
        //         Token:app.token
        //     };
        // url = app.serverUrl + JSON.stringify(request);
        // commonJS.get(url,function(text){
        //     for(var i in text.items)
        //     {
        //         var order = text.items[i];
        //         waybills.confirmOrders.push(order);
        //     }           
        // });

        // request = {
        //         Action:"WaybillItems",
        //         status:3,
        //         Token:app.token
        //     };
        // url = app.serverUrl + JSON.stringify(request);
        // commonJS.get(url,function(text){
        //     for(var i in text.items)
        //     {
        //         var order = text.items[i];
        //         waybills.completeOrders.push(order);
        //     }         
        // });

        // for(var i in waybills.pushedOrders){
       
        //     var order = waybills.pushedOrders[i];
        //     order.responsers = ko.observableArray();
        //     jsonStr= {"Action":"HMList","Token":"07b27a882cc721a9207250f1b6bd2868","parameter":{"orderId":order.orderId,"page":1}};
        //     url = "http://112.124.122.107/Applications/web/?data=" + JSON.stringify(jsonStr);
        //     commonJS.get(url,function(text){  
        //         if (text.items!=null){
        //             waybills.pushedOrders[i].responsers = text.items;
        //         }
        //     });
        // }
            
        ko.applyBindings(waybills);
        $('body').trigger("create");

    },

    refresh:function(status)
    {
        // alert(status);
        var request = {
                Action:"WaybillItems",
                status:status,
                Token:app.token
            };
        var url = app.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(data){   
            for(var i in data.items)
            {
                var waybill = data.items[i];
                waybill.canGrab = false;
                waybill.ship_date =commonJS.jsonDateFormat(data.items[i].ship_date);
                waybill.arrival_date =commonJS.jsonDateFormat(data.items[i].arrival_date);
                waybill.orderDate = commonJS.jsonDateFormat(data.items[i].orderDate);
                if (status === 0) {
                    // order.cancel = function()
                    // {
                    //     var index = i;
                    //     var self = this;
                    //     var request = {
                    //         Action:"OrderRevocation",
                    //         orderId:self.orderId,
                    //         Token:app.token
                    //     };
                    //     var url = app.serverUrl + JSON.stringify(request);
                    //     commonJS.get(url,function(result){
                    //         if(result.status !== 0)
                    //         {
                    //             alert(result.message);
                    //             return;
                    //         }
                    //         alert("订单"+self.orderId+"撤销成功.");
                    //         orders.pushedOrders.slice(index,1);
                    //     });   

                    // };
                    // order.responsers = ko.observableArray([]);
                    waybill.grab = function()
                    {
                        var self = this;
                        window.location.href="modifyWaybill.html?orderId="+self.orderId + "&pushType=0";
                    };
                    waybill.canGrab = true;
                    waybills.pushedOrders.push(waybill);
                };
                if (status === 1) {
                    // order.editOrder = function()
                    // {
                    //     var self = this;
                    //     window.location.href="editOrder.html?orderId="+self.orderId;
                        
                    // }
                    waybills.cancelOrders.push(waybill);
                };
                if (status === 2) {

                    waybills.confirmOrders.push(waybill);
                };
                if (status === 3) {
                    waybill.completeOrder = function()
                    {
                        var self = this;


                    };
                    waybills.completeOrders.push(waybill);
                };
            }  
           
        });

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
