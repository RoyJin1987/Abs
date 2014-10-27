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
    token:"",
    viewModel: {},
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
        app.token = $.cookie("usrToken");
        app.receivedEvent('deviceready');
        //请求正在修改运单
        var orderId = app.getUrlParam("orderId");
        // debugger;
        if (orderId) {
           var request = {
                Action:"getOrderById",
                orderId:orderId,
                Token:app.token
            };
            var url = app.serverUrl + JSON.stringify(request);
            // debugger;
            commonJS.get(url,function(data){
                
                app.viewModel = data.item;
                
                app.viewModel.confirm = function (){
                   
                    var request = {
                        Action:"OrderGrab",
                        confirmType:1,
                        Token:app.token,
                        param:{
                            orderId:app.viewModel.orderId,
                            freight: app.viewModel.bid_item.freight, 
                            pilot_uid:app.viewModel.selectedPilot.identity 
                        }
                    };
                    
                    var url = app.serverUrl + JSON.stringify(request);

                    commonJS.get(url,function(data_){
                        // debugger;
                        if (data_.status===0) {

                            //删除该单
                            waybills.orders.splice(i,1);

                            //提示用户
                            alert("您已经抢到运单"+app.viewModel.orderId);

                        }
                        else
                        {
                             //提示用户
                            alert(data_.message);
                        }
                    });


                };
                var request = {
                    Action:"getPilots",
                    Token:app.token
                };
                var url = app.serverUrl + JSON.stringify(request);
                commonJS.get(url,function(data_){
                    // alert(JSON.stringify(data_));
                    app.viewModel.pilots = data_.items
                    app.viewModel.selectedPilot = {};
                    ko.applyBindings(app.viewModel);
                    $('body').trigger("create");
                });
               
            });
        };
    
    },

    // showDetails:function(btn){
    //     var $orderblk = $(btn).parents(".order-info-block");
    //     $orderblk.find(".brief").hide();
    //     $orderblk.find(".details").show();     
    // },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    },

    getUrlParam : function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    } 
};
