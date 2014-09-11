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
        app.receivedEvent('deviceready');
        //some test data
        var orders = {
            pushedOrders:[{
                code:"BX79873934",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"上海",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            },{
                code:"BX79873935",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"上海",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            }],
            cancelOrders:[{
                code:"BX79873934",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"无锡",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            },{
                code:"BX79873935",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"杭州",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            }],
            confirmOrders:[{
                code:"BX79873934",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"上海",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            },{
                code:"BX79873935",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"上海",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            }],
            completeOrders:[{
                code:"BX79873934",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"上海",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            },{
                code:"BX79873935",
                consignor:"张三",
                cargotype:"食品",
                fromcity:"上海",
                tocity:"苏州",
                shipdate:"2014/10/04",
                deliverydate:"2014/10/06",
                weight:"500",
                volume:"1.5",
                shippingaddress:"上海外高桥保税区",
                deliveryaddress:"苏州科技园",
                responsers:[{
                    platenum:"苏ES7873",
                    driver:"Roy",
                    price:"500",
                    level:"4.5",
                    img:""
                },{
                    platenum:"沪A78979",
                    driver:"Kevin",
                    price:"480",
                    level:"3.5",
                    img:""
                }]
            }]
        };
        ko.applyBindings(orders);
        $('body').trigger("create");

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    },
    showDetails:function(btn){
        var $orderblk = $(btn).parents(".order-info-block");
        $orderblk.find(".brief").hide();
        $orderblk.find(".details").show();

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
