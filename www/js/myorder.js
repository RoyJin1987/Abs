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
 var orders = {
            pushedOrders:ko.observableArray([]),
            cancelOrders:ko.observableArray([]),
            confirmOrders:ko.observableArray([]),
            completeOrders:ko.observableArray([])
        };

var appMyOrder = {
    serverUrl:"http://112.124.122.107/Applications/web/?data=",
    token:"07b27a882cc721a9207250f1b6bd2868",
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
        appMyOrder.token = $.cookie("usrToken");
        appMyOrder.receivedEvent('deviceready');
        //some test data
        var request = {
                Action:"OrderItems",
                status:0,
                Token:appMyOrder.token
            };
        var url = appMyOrder.serverUrl + JSON.stringify(request);

        commonJS.get(url,function(text){        
            orders.pushedOrders = text.items;
  
            for(var i in orders.pushedOrders)
            {
                
                var order = orders.pushedOrders[i];
                order.ship_date =commonJS.jsonDateFormat(orders.pushedOrders[i].ship_date);
                order.arrival_date =commonJS.jsonDateFormat(orders.pushedOrders[i].arrival_date);
                order.orderDate = commonJS.jsonDateFormat(orders.pushedOrders[i].orderDate);
                order.editOrder = function()
                {
                    var self = this;
                    window.location.href="editOrder.html?orderId="+self.orderId;
                    
                }
                order.responsers = ko.observableArray();
            }
        });

        request = {
                Action:"OrderItems",
                status:1,
                Token:appMyOrder.token
            };
        url = appMyOrder.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(text){        
            orders.cancelOrders = text.items;
        });

        request = {
                Action:"OrderItems",
                status:0,
                Token:appMyOrder.token
            };
        url = appMyOrder.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(text){      
            orders.confirmOrders = text.items;
             for(var i in orders.confirmOrders)
            {
                var order = orders.confirmOrders[i];
                order.isCompleted = false;
                order.carrier = {};
            }

        });

        request = {
                Action:"OrderItems",
                status:0,
                Token:appMyOrder.token
            };
        url = appMyOrder.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(text){        
            orders.completeOrders = text.items;
            for(var i in orders.completeOrders)
            {
                var order = orders.completeOrders[i];
                order.isCompleted = true;
                order.carrier = {};
            }
        });

        ko.applyBindings(orders);
        $('body').trigger("create");

    },

    showDetails:function(btn,action,order){
        var $orderblk = $(btn).parents(".order-info-block");
        $orderblk.find(".brief").hide();
        $orderblk.find(".details").show();   

        //展开时查询抢单者或接单者
        if(action && order)
        {
            var request = {
                Action:action,
                orderId:order.orderId,
                Token:appMyOrder.token
            };
       
            var url = appMyOrder.serverUrl + JSON.stringify(request);
    
            commonJS.get(url,function(data){  
                //抢单者
                if (data.items){
                    order.responsers = data.items; 
                    order.showModify = false;
                    order.showCancel = true;
                    for(var j in order.responsers)
                    {
                        var responser = order.responsers[j];
                        responser.orderId= order.orderId;
                        responser.confirmToResponse = function()
                        {
                            var self = this;
                            window.location.href = "orderConfirm.html?orderId="+self.orderId+"&key="+self.key;
                        };
                    }
                }
                //接单者
                else if (data.motorcade && data.pilot && data.user) {
                    order.carrier = {
                        motorcade:data.motorcade,
                        user:data.user,
                        pilot:data.pilot
                    }

                };
                //刷新界面
                $('body').trigger("create");

            }); 
        }
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
