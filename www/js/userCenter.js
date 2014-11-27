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
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
         if (!window.device) {
            $(document).ready(this.onDeviceReady);
        } else {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        }
        //document.addEventListener("backbutton", commonJS.goback(), false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      document.addEventListener('backbutton', commonJS.gotoHome, false);
      if(typeof localStorage === 'undefined' )
      {
        app.token = $.cookie("usrToken");
        app.usrName = $.cookie("usrName");
        app.usrImage = $.cookie("usrImage");
      }
      else
      {
        app.token = localStorage["usrToken"];
        app.usrName = localStorage["usrName"];
        app.usrImage = localStorage["usrImage"];
      }



      if (app.token) {
        //已登录
        $("#usr-name").text("您好,"+app.usrName);
      }
      else
      {
        //未登录
        $("#usr-name").text('您尚未登录');
      }
      if(app.usrImage){
        
        //$("#usr-image").src=app.usrImage;
        document.getElementById("usr-image").src=app.usrImage;
      }
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    }
};
