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
    newUser:{
        mobile_number:ko.observable(''),
        mobile_number_code:ko.observable(''),
        name:ko.observable(''),
        location:ko.observable(''),
        company_description:ko.observable(''),
        distribution_range:ko.observable(''),
        license_plate_number:ko.observable(''),
        vehicle_description:ko.observable(''),
        company_name:ko.observable(''),
        company_address:ko.observable(''),
        company_tel:ko.observable(''),
        business_license:ko.observable(''),
        //mobile_number:'',
        type: ko.observable("2"),
        model: ko.observable("7"),
        showPersonal: ko.observable(true), 
        showAgency: ko.observable(false), 
        showCompany: ko.observable(false),  
        hasStandard: ko.observable(false), 
        hasRefrigerate: ko.observable(false), 
        hasFrozen: ko.observable(false), 
        typeRadioClick: function () {
            if (app.newUser.type() == "2") {
                app.newUser.showPersonal(true);
                app.newUser.showAgency(false);
                app.newUser.showCompany(false);
            }
            else  if (app.newUser.type() == "3") {
                app.newUser.showAgency(true);
                app.newUser.showCompany(false);
                app.newUser.showPersonal(false);
            }else{
                app.newUser.showCompany(true);
                app.newUser.showPersonal(false);
                app.newUser.showAgency(false);
            }
            return true;
        }     
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
        if(app.newUser.mobile_number()=="")
        {
            alert("请先输入手机号");
            return;
        }
        var request = {
            Action:"getcode",
            parameter:{
                mobile:app.newUser.mobile_number()
            }
        };

        var url = ABSApplication.ABSServer.url + JSON.stringify(request);
        commonJS.get(url,function(data){
           if (data.status === 0) {
                app.newUser.mobile_number_code(data.code);
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
            type:usr.type(),
            deviceId:deviceId,
            parameter:{
                image:"",
                mobile_number:usr.mobile_number(),
                mobile_number_code:usr.mobile_number_code(),
                name:usr.name(),
                location:"",
                id_card:"",
                company_description:usr.company_description(),
                wenceng:[],
                medels:usr.model(),
                distribution_range:usr.distribution_range()
            }
        }

        if (usr.hasStandard()){
            request.parameter.wenceng.push("2");
        }
        if (usr.hasRefrigerate()){
            request.parameter.wenceng.push("3");
        }
        if (usr.hasFrozen()){
            request.parameter.wenceng.push("4");
        }

        if (usr.type() =="2"){
            request.parameter.driving_license ="";
            request.parameter.driving_permits ="";
            request.parameter.license_plate_number =usr.license_plate_number();
            request.parameter.vehicle_description =usr.vehicle_description();
        }else{
            request.parameter.company_name =usr.company_name();
            request.parameter.company_address =usr.company_address();
            request.parameter.company_tel =usr.company_tel();
            request.parameter.business_license ="";
        }
        var url = ABSApplication.ABSServer.url + JSON.stringify(request);

        commonJS.get(url,function(data){
           if (data.status === 0) {
               $.cookie('usrToken', data.Token, { expires: 7, path: '/' });
               window.location.href="homemap.html";
           }else{
                alert(data.message);
           }
        });

    },

    validate:function()
    {
        return true;
    }



};
