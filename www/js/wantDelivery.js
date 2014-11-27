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
            intercityOrders:ko.observableArray([]),
            orders:ko.observableArray([])
        };

var app = {
    serverUrl:"http://112.124.122.107/Applications/web/?data=",
    token:"",
    onLoad:function() {

        if (!window.device) {
            $(document).ready(this.onDeviceReady);
        } else {
            document.addEventListener('deviceready', this.onDeviceReady, false);
            //document.addEventListener("backbutton", commonJS.goback(), false);
        }
        // document.addEventListener('deviceready', this.onDeviceReady, false);

    },


    // grabOrder: function(orderId) {
    //     alert(orderId);
    // },

    // grabintercityOrder: function(orderId) {
    //     alert(orderId);
    // },

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
        //some test data
        var request = {
                Action:"PushItems",
                Token:app.token,
                parameter:{"pushType":1,"page":1}
            };
        var url = app.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(data){      
            
            // waybills.intercityOrders = data.items;
            for(var i in data.items)
            {
                var order = data.items[i];
                // order.ship_date =commonJS.jsonDateFormat(data.items[i].ship_date);
                // order.arrival_date =commonJS.jsonDateFormat(data.items[i].arrival_date);
                // order.orderDate = commonJS.jsonDateFormat(data.items[i].orderDate);

                order.grabIntercity = function()
                {
                    var self = this;
                    if (window.notificationClient){
                        window.notificationClient.call(self.mobile);
                    }
                    
                    //Ìøµ½ÐÞ¸ÄÔËµ¥
                    setTimeout(function(){
                        window.location.href="modifyWaybill.html?orderId="+self.orderId+ "&pushType=1";
                    },1000);

                }
                waybills.intercityOrders.push(order);

            }
        });

        request = {
                Action:"PushItems",
                Token:app.token,
                parameter:{"pushType":0,"page":1}
            };
        url = app.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(data){      
            // waybills.orders = data.items;
            if (data.status === 0) {
                for(var i in data.items)
                {
                    var order = data.items[i];
                    // order.ship_date =commonJS.jsonDateFormat(data.items[i].ship_date);
                    // order.arrival_date =commonJS.jsonDateFormat(data.items[i].arrival_date);
                    // order.orderDate = commonJS.jsonDateFormat(data.items[i].orderDate);
                    order.grab = function()
                    {
                        var self = this;
                        //Ìøµ½ÐÞ¸ÄÔËµ¥
                        setTimeout(function(){
                            window.location.href="modifyWaybill.html?orderId="+self.orderId + "&pushType=0";
                        },1000);

                    }
                    waybills.orders.push(order);
                }
            }else{
                alert(data.message);
            }
        });
            
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
