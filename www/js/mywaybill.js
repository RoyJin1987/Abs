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
        app.receivedEvent('deviceready');

        app.refresh(0);
            
        ko.applyBindings(waybills);
        $('body').trigger("create");

    },

    refresh:function(status)
    {
        var request = {
                Action:"WaybillItems",
                status:status,
                Token:app.token
            };
        var url = app.serverUrl + JSON.stringify(request);

        waybills.pushedOrders.removeAll();
        waybills.submitOrders.removeAll();
        waybills.confirmOrders.removeAll();
        waybills.completeOrders.removeAll();

        commonJS.get(url,function(data){   
            
            for(var i in data.items)
            {
                var waybill = data.items[i];
                var sendcity = waybill.send_address.city.split(" ");
                if (sendcity[1]){
                     waybill.send_address.city = sendcity[1];
                }

                var shipcity = waybill.shipping_address.city.split(" ");
                if (shipcity[1]){
                     waybill.shipping_address.city = shipcity[1];
                }

                waybill.canGrab = false;
                // waybill.ship_date =commonJS.jsonDateFormat(data.items[i].ship_date);
                // waybill.arrival_date =commonJS.jsonDateFormat(data.items[i].arrival_date);
                // waybill.orderDate = commonJS.jsonDateFormat(data.items[i].orderDate);
                if (status === 0) {
                    waybill.grab = function()
                    {
                        var self = this;
                        window.location.href="modifyWaybill.html?orderId="+self.orderId;
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
                    waybill.grab = function(){};
                    waybills.submitOrders.push(waybill);
                };
                if (status === 2) {
                    waybill.completeOrder = function()
                    {

                        var self = this;
                        var request = {
                            Action:"OrderComplete",
                            orderId:self.orderId,
                            Token:app.token
                        };
                        var url = app.serverUrl + JSON.stringify(request);
                        commonJS.get(url,function(data){  
                            if(data.status !== 0)
                            {
                                alert(result.message);
                                return;
                            }
                            alert("运单已完成.");
                            waybills.confirmOrders.remove(self);
                            var request = {
                                Action:"getOrderById",
                                orderId:self.orderId,
                                Token:app.token
                            };
                            var url = app.serverUrl + JSON.stringify(request);
                            commonJS.get(url,function(data){
                                app.viewModel = data.item;
                                var message = { 
                                    type:"OrderCompleted",
                                    orderId:self.orderId
                                };
                                window.notificationClient.notify(data.item.identity,JSON.stringify(message));  
                                });
                        });

                    };
                    
                    waybills.confirmOrders.push(waybill);
                };
                if (status === 3) {
                    // waybill.canGrab = true;
                    waybill.grab = function(){};
                    waybills.completeOrders.push(waybill);
                };
            }  
           
        });
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
