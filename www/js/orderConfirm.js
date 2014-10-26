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
    viewModel: {
        consignee_name:ko.observable(''),
        consignee_phone:ko.observable(''),
        // bid_item:{
        //     freight:ko.observable('')
        // }
    },
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
        app.token = $.cookie("usrToken");
        alert("token:"+ app.token );
        //请求正在修改运单
        var orderId = app.getUrlParam("orderId");
        var key = app.getUrlParam("key");
        // debugger;
        if (orderId) {
           var request = {
                Action:"getOrderById",
                orderId:orderId,
                Token:app.token
            };
            alert("请求订单："+JSON.stringify(request));
            var url = app.serverUrl + JSON.stringify(request);
            commonJS.get(url,function(data){
                alert(JSON.stringify(data));
                // 参数：
                // POST|GET data={Action: "OrderConfirm",orderId: “订单编号”,key:”抢单标识”, Token:”身份令牌”} 
                // 返回
                // JSON { Action:"OrderConfirm","status":0}

                app.viewModel = data.item;
                app.viewModel.pilot = {};
                app.viewModel.confirm = function (){
                    var request = {
                        Action:"OrderConfirm",
                        orderId:app.viewModel.orderId,
                        key:key,
                        Token:app.token,
                    };
                    alert("确认订单:"+JSON.stringify(request));
                    var url = app.serverUrl + JSON.stringify(request);
                    commonJS.get(url,function(data_){
                        alert(JSON.stringify(data_));
                        // debugger;
                        if (data_.status===0) {
                            //提示用户
                            alert("您已经确认订单"+app.viewModel.orderId);
                        }
                        else
                        {
                            //提示用户
                            alert(data_.message);
                        }
                    });
                };
                app.viewModel.modify = function (){
                    var request = {
                        Action:"OrderEdit",
                        orderId:app.viewModel.orderId,
                        Token:app.token,
                        parameter:JSON.stringify(app.viewModel)
                    };
                    alert("修改订单:"+JSON.stringify(request));
                    var url = app.serverUrl + JSON.stringify(request);
                    commonJS.get(url,function(data_){
                        alert(JSON.stringify(data_))
                        // debugger;
                        if (data_.status===0) {
                            //提示用户
                            alert("订单"+app.viewModel.orderId+"修改成功");
                        }
                        else
                        {
                            //提示用户
                            alert(data_.message);
                        }
                    });
                };
                var request = {
                    Action:"HMList",
                    parameter:{
                        orderId:app.viewModel.orderId,
                        page:1
                    },
                    Token:app.token
                };
                var url = app.serverUrl + JSON.stringify(request);
                alert("获取抢单者："+ JSON.stringify(request))
                commonJS.get(url,function(data_){
                    alert(JSON.stringify(data_));
                    for(var i in data_.items)
                    {
                        var pilot =  data.items[i];
                        if (pilot.key === key) {
                            app.viewModel.pilot = pilot;
                            break;
                        };
                    }
                    ko.applyBindings(app.viewModel);
                    $('body').trigger("create");
                });
               
            });
        };
    
    },

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

$(document).ready(function(){
    app.onLoad();
});
