'use strict'
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
    newUser: {
            name:ko.observable(''),
            mobile:ko.observable(''),
            verificationCode:ko.observable(''),
            address:ko.observable('')          
        },

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
        if (window.device) {
            alert(device.model +"----"+device.cordova +"------"+ device.uuid +"-----"+device.version+"----"+device.platform);
        };
        
        
        ko.applyBindings(app.newUser);
        $('body').trigger("create");

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    },
    //获取验证码
    verificate:function()
    {
        // debugger;
        if(!app.newUser.mobile())
        {
            alert("请先输入手机号");
            return;
        }
        var request = {
            Action:"getcode",
            parameter:{
                mobile:app.newUser.mobile()
            }
        };

        var url = ABSApplication.ABSServer.url + JSON.stringify(request);
        commonJS.get(url,function(data){
           if (data.status === 0) {
                app.newUser.verificationCode(data.code);
           };
        });
    },
    //注册
    register:function()
    {
        if(!app.validate())
        {
            return;
        }
        var usr = app.newUser;
        var deviceId ="";
        if (window.device) {
            deviceId = window.device.uuid;

        };
        var request = {
            Action:"register",
            type:1,
            deviceId:deviceId,
            parameter:{
                mobile_number:usr.mobile(),
                mobile_number_code:usr.verificationCode(),
                name:usr.name(),
                location:usr.address(),
                image:""
            }
        }
        var url = ABSApplication.ABSServer.url + JSON.stringify(request);
        commonJS.get(url,function(data){
            // alert(JSON.stringify(data));
           if (data.status === 0) {
               $.cookie('usrToken', data.Token, { expires: 7, path: '/' });
               alert("恭喜您，注册成功！");
               window.location.href="homemap.html";
           };
        });

    },

    validate:function()
    {
        return true;
    }



};
