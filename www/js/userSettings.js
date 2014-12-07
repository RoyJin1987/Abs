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
    viewModel: {
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
    onDeviceReady: function(model) {
        // document.addEventListener('backbutton', commonJS.gotoUesrCenter, false);
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

        var request = {
                Action:"UserInformation",
                Token:app.token
            };
        var url = app.serverUrl + JSON.stringify(request);
        
        commonJS.get(url,function(data){
            // alert(JSON.stringify(data));
           if(data.status !== 0)
            {
                alert(data.message);
                return;
            }
            app.viewModel={
                canBeLocated : data.switch.location_stars,
                canBeCalled : data.switch.phone_stars,
                canGrabOrder :  data.switch.orders_stars,
                personalInfo:data.parameter
            };
            if (data.switch.location_stars) {
                $("#locator-switch").parent().addClass("ui-flipswitch-active");
            };
            if (data.switch.phone_stars) {
                $("#calling-switch").parent().addClass("ui-flipswitch-active");
            };
            if (data.switch.orders_stars) {
                $("#order-switch").parent().addClass("ui-flipswitch-active");
            };
             ko.applyBindings(app.viewModel);
            $('body').trigger("create");


        });  
        app.receivedEvent('deviceready');
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

    togglePersonalInfo:function(btn){
        if($("#personal-info:visible").length >0) {
            $(btn).removeClass("ui-icon-carat-u").addClass("ui-icon-carat-d");
            $("#personal-info").hide();
        } else {
            $(btn).removeClass("ui-icon-carat-d").addClass("ui-icon-carat-u");
             $("#personal-info").show();
        }  

    }
};
