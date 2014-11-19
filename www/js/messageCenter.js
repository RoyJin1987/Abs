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
 var viewModel = {
            invites:ko.observableArray([])
        };

var app = {
    serverUrl:"http://112.124.122.107/Applications/web/?data=",
    token:"",
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
        app.refresh();
            
        ko.applyBindings(viewModel);
        $('body').trigger("create");

    },

    refresh: function() {

        //some test data
        var request = {
                Action:"TeamInvitedMe",
                Token:app.token
            };
        var url = app.serverUrl + JSON.stringify(request);
        commonJS.get(url,function(data){      
            //alert(JSON.stringify(data));
            // waybills.intercityOrders = data.items;
            for(var i in data.items)
            {
                var invite = data.items[i];
                //invite.date =commonJS.jsonDateFormat(data.items[i].date);
                invite.title = invite.name + "邀请您加入他的车队";
                invite.accept = function()
                {
                    var self = this;
                    request = {
                        Action:"AcceptInviteTeam",
                        accept:1,
                        Token:app.token,    
                        key:self.key
                    };
                    url = app.serverUrl + JSON.stringify(request);
                    commonJS.get(url,function(data){  
                        if (data.status===0){
                            if (window.notificationClient){
                                var message = { 
                                    type:"AcceptInviteTeam",
                                    usrName:appMyOrder.usrName
                                };
                                window.notificationClient.notify(self.identity,JSON.stringify(message));  
                            }
                            alert("已加入车队");
                            app.refresh();
                        }else{
                            alert(data.message);
                            window.location.href = url;
                        }
                    });
                }
                viewModel.invites.push(invite);

            }
        });

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
