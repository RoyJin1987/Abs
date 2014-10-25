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
    viewModel: {
            cars1:ko.observableArray([]),
            cars2:ko.observableArray([]),
            cars3:ko.observableArray([]),
            
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
        //some test data
        var jsonStr = '{"Action":"getPilots","Token":"07b27a882cc721a9207250f1b6bd2868"}';
        var url = "http://112.124.122.107/Applications/web/?data=" + jsonStr;
        commonJS.get(url,function(data){
                  
           app.viewModel.cars1 = data.items;
           app.viewModel.cars2 = data.items;
           app.viewModel.cars3 = data.items;
        });
            
        ko.applyBindings(app.viewModel);
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
};
