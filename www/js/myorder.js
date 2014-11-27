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
        document.addEventListener('backbutton', commonJS.gotoUesrCenter, false);
        if(typeof localStorage === 'undefined' )
        {
          appMyOrder.token = $.cookie("usrToken");
          appMyOrder.usrName = $.cookie("usrName");
        }
        else
        {
          appMyOrder.token = localStorage["usrToken"];
          appMyOrder.usrName = localStorage["usrName"];
        }
        appMyOrder.receivedEvent('deviceready');
        
        appMyOrder.refresh(0);
        // var request = {
        //         Action:"OrderItems",
        //         status:0,
        //         Token:appMyOrder.token
        //     };
        // var url = appMyOrder.serverUrl + JSON.stringify(request);

        // commonJS.get(url,function(text){        
        //     // orders.pushedOrders = text.items;
        //     for(var i in text.items)
        //     {          
        //         var order = text.items[i];
        //         order.ship_date =commonJS.jsonDateFormat(text.items[i].ship_date);
        //         order.arrival_date =commonJS.jsonDateFormat(text.items[i].arrival_date);
        //         order.orderDate = commonJS.jsonDateFormat(text.items[i].orderDate);
        //         order.cancel = function()
        //         {
        //             var index = i;
        //             var self = this;
        //             var request = {
        //                 Action:"OrderRevocation",
        //                 orderId:self.orderId,
        //                 Token:appMyOrder.token
        //             };
        //             var url = appMyOrder.serverUrl + JSON.stringify(request);
        //             commonJS.get(url,function(result){
        //                 if(result.status !== 0)
        //                 {
        //                     alert(result.message);
        //                     return;
        //                 }
        //                 alert("订单"+self.orderId+"撤销成功.");
        //                 orders.pushedOrders.slice(index,1);
        //             });   

        //         };
        //         order.responsers = ko.observableArray([]);
        //         orders.pushedOrders.push(order);
        //     }
        // });

        // request = {
        //         Action:"OrderItems",
        //         status:1,
        //         Token:appMyOrder.token
        //     };
        // url = appMyOrder.serverUrl + JSON.stringify(request);
        // commonJS.get(url,function(text){   
        //     for(var i in text.items)
        //     {
        //         var order = text.items[i];
        //         order.editOrder = function()
        //         {
        //             var self = this;
        //             window.location.href="editOrder.html?orderId="+self.orderId;
                    
        //         }
               
        //         orders.cancelOrders.push(order);
        //     }  
           
        // });

        // request = {
        //         Action:"OrderItems",
        //         status:0,
        //         Token:appMyOrder.token
        //     };
        // url = appMyOrder.serverUrl + JSON.stringify(request);
        // commonJS.get(url,function(text){      
        //     // orders.confirmOrders = text.items;
        //      for(var i in text.items)
        //     {
        //         var order = text.items[i];
        //         order.isCompleted = false;
        //         order.carrier = ko.observable({
        //             freight:'',
        //             motorcade:{},
        //             user:{},
        //             pilot:{}
        //         });
        //         orders.confirmOrders.push(order);
        //     }

        // });

        // request = {
        //         Action:"OrderItems",
        //         status:0,
        //         Token:appMyOrder.token
        //     };
        // url = appMyOrder.serverUrl + JSON.stringify(request);
        // commonJS.get(url,function(text){        
        //     // orders.completeOrders = text.items;
        //     for(var i in text.items)
        //     {
        //         var order = text.items[i];
        //         order.isCompleted = true;
        //         order.carrier = ko.observable({
        //             freight:'',
        //             motorcade:{},
        //             user:{},
        //             pilot:{}
        //         });
        //         orders.completeOrders.push(order);
        //     }
        // });

        ko.applyBindings(orders);
        $('body').trigger("create");

    },

    refresh:function(status)
    {
        if (status === 0) {
            orders.pushedOrders.removeAll();
        }else if (status === 1) {
            orders.cancelOrders.removeAll();
        }else if (status === 2) {
            orders.confirmOrders.removeAll();
        }else{
            orders.completeOrders.removeAll();
        };
        // alert(status);
        var request = {
                Action:"OrderItems",
                status:status,
                Token:appMyOrder.token
            };
        var url = appMyOrder.serverUrl + JSON.stringify(request);
        
        commonJS.get(url,function(data){  
        
            for(var i in data.items)
            {
                var order = data.items[i];
                // order.ship_date =commonJS.jsonDateFormat(data.items[i].ship_date);
                // order.arrival_date =commonJS.jsonDateFormat(data.items[i].arrival_date);
                // order.orderDate = commonJS.jsonDateFormat(data.items[i].orderDate);
                if (status === 0) {
                    order.cancel = function()
                    {
                        var index = i;
                        var self = this;
                        var request = {
                            Action:"OrderRevocation",
                            orderId:self.orderId,
                            Token:appMyOrder.token
                        };
                        var url = appMyOrder.serverUrl + JSON.stringify(request);
                        commonJS.get(url,function(result){
                            if(result.status !== 0)
                            {
                                alert(result.message);
                                return;
                            }
                            alert("订单"+self.orderId+"撤销成功.");
                            
                            appMyOrder.refresh(0);
                            
                        });   

                    };

                    order.responsers = ko.observableArray([]);
                    orders.pushedOrders.push(order);
                };
                if (status === 1) {
                    order.editOrder = function()
                    {
                        var self = this;
                        window.location.href="editOrder.html?orderId="+self.orderId;
                        
                    }
                    orders.cancelOrders.push(order);
                };
                 if (status === 2 || status === 3) {
                    order.isCompleted = (status === 3);
                    if (status===2){
                        order.checkPosition =function(){
                            var self = this;
                            window.location.href = "myTeamMap.html?orderId="+self.orderId;
                        }
                    }
                    order.carrier = ko.observable({
                        freight:'',
                        motorcade:{},
                        user:{},
                        pilot:{},
                        callHim :function()
                        {
                            // var self = this;
                            // alert(JSON.stringify(self));
                            // if (self.pilot.mobile_number) {
                            //     window.notificationClient.call(self.pilot.mobile_number);
                            // };
                            
                        },
                        inviteHim :function()
                        {
                            // var self = this;
                            // alert(JSON.stringify(self));
                            // if (self.pilot.mobile_number) {
                            //     window.notificationClient.call(self.pilot.mobile_number);
                            // };
                            
                        }
                    });
                   
                    var arrary = (status===2?orders.confirmOrders:orders.completeOrders);
                    arrary.push(order);
                };
            }  
           
        });
        $('body').trigger("create");
    },

    showDetails:function(btn,action){
        var $orderblk = $(btn).parents(".order-info-block");
        $orderblk.find(".brief").hide();
        $orderblk.find(".details").show();   
        var orderId = $(btn).attr('id');
        var order = appMyOrder.findOrder(orderId);

        //展开时查询抢单者或接单者
        if(action && order)
        {
            var request = {
                Action:action,
                orderId:order.orderId,
                Token:appMyOrder.token
            };
       
            var url = appMyOrder.serverUrl + JSON.stringify(request);
             if(order.responsers)
             {
                order.responsers.removeAll();
             }
            //order.responsers.removeAll();
            commonJS.get(url,function(data){
                if (data.status !== 0) {
                    alert(data.message);
                };  
                //alert(JSON.stringify(data));
                //抢单者
                if (data.items){
                    
                    for(var i in data.items)
                    {
                        var responser = data.items[i];
                        responser.orderId= order.orderId;
                        responser.confirmToResponse = function()
                        {
                            var self = this;
                            window.location.href = "orderConfirm.html?orderId="+self.orderId+"&key="+self.key;
                        };
                        responser.callHim = function()
                        {
                            var self = this;
                            window.notificationClient.call(self.pilot.mobile_number);
                        };
                        order.responsers.push(responser);
                    }
                    order.showModify = false;
                    order.showCancel = true;

                }
                //接单者
                else if (data.motorcade && data.pilot && data.user) {
                    // order.carrier = {
                    //     motorcade:data.motorcade,
                    //     user:data.user,
                    //     pilot:data.pilot
                    // }alert()
                    
                    var carrier = order.carrier();
                    carrier.motorcade = data.motorcade;
                    carrier.user = data.user;
                    carrier.pilot = data.pilot;
                    order.carrier(carrier);
                    //alert(JSON.stringify(order.carrier()));
                    carrier.callHim = function()
                    {
                        var self = this;
                        // alert(JSON.stringify(self));
                        if (self.pilot.mobile_number) {
                            window.notificationClient.call(self.pilot.mobile_number);
                        }
                    }

                    carrier.inviteHim = function()
                    {
                        var self = this;
                        var request = {
                            Action:"InviteTeam",
                            motorcadeKey:self.motorcade.motorcadekey,
                            Token:appMyOrder.token
                        };
                        var url = appMyOrder.serverUrl + JSON.stringify(request);
                        //alert(url);
                        commonJS.get(url,function(result){
                            if(result.status !== 0)
                            {
                                alert(result.message);
                                return;
                            }
                            var message = { 
                              type:"InviteTeam",
                              usrName:appMyOrder.usrName
                            };
                            if (window.notificationClient){
                                window.notificationClient.notify(self.user.identity,JSON.stringify(message));  
                            }
                            
                            alert("邀请成功，等待对方确认.");
                            
                        });   
                    }

                };
                //刷新界面
                $('body').trigger("create");

            }); 
        }
    },

    findOrder:function(id)
    {
        for(var i in orders.pushedOrders())
        {
            var order = orders.pushedOrders()[i];
            if (order.orderId === id) {
                return order;
            };
        }
         for(var i in orders.cancelOrders())
        {
            var order = orders.cancelOrders()[i];
            if (order.orderId === id) {
                return order;
            };
        }
         for(var i in orders.confirmOrders())
        {
            var order = orders.confirmOrders()[i];
            if (order.orderId === id) {
                return order;
            };
        }
         for(var i in orders.completeOrders())
        {
            var order = orders.completeOrders()[i];
            if (order.orderId === id) {
                return order;
            };
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
