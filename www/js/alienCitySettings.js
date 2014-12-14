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
    gid:"",
    viewModel: {
        city:ko.observable("请选择城市"),
        dateFrom:"",
        dateTo:"",   
    },
    settings:[],

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

    addSetting:function() {
        var selectCity = document.getElementById('txtCity').innerText;
        if ( selectCity=="请选择城市"){
            if (window.notificationClient){
                window.notificationClient.showToast("请选择城市");  
                window.notificationClient.selectCity(1);
            }
            return;
        }
        var arr1 = app.viewModel.dateFrom().split("/");
        var starttime = new Date(arr1[0], arr1[1], arr1[2]);
        var starttimes = starttime.getTime();

        var arr2 = app.viewModel.dateTo().split("/");
        var endtime = new Date(arr2[0], arr2[1], arr2[2]);
        var endtimes = endtime.getTime();
      
        if (starttimes > endtimes) {
            if (window.notificationClient){
                window.notificationClient.showToast("开始日期不能大于结束日期");  
                //$("#dateFrom").focus();
            }
            return;
        }

        var cityExist = false;
        for(var i in app.settings){
            if (app.settings[i].city == selectCity){
                for(var j in app.settings[i].dates){
                    var arrTmp = app.settings[i].dates[j].dateFrom.split("/");
                    var starttimeTmp = new Date(arrTmp[0], arrTmp[1], arrTmp[2]);
                    var starttimesTmp = starttimeTmp.getTime();
                    var arrTmp2 = app.settings[i].dates[j].dateTo.split("/");
                    var endtimeTmp = new Date(arrTmp2[0], arrTmp2[1], arrTmp2[2]);
                    var endtimesTmp = endtimeTmp.getTime();
                    if (starttimes >=starttimesTmp && starttimes <= endtimesTmp){
                        if (window.notificationClient){
                            window.notificationClient.showToast("日期有重复");  
                            //$("#dateFrom").focus();
                        }
                        return;
                    }
                    if (endtimes >=starttimesTmp && endtimes <= endtimesTmp){
                        if (window.notificationClient){
                            window.notificationClient.showToast("日期有重复");  
                            //$("#dateTo").focus();
                        }
                        return;
                    }
                    if (starttimesTmp >=starttimes && starttimesTmp <= endtimes){
                        if (window.notificationClient){
                            window.notificationClient.showToast("日期有重复");  
                            //$("#dateFrom").focus();
                        }
                        return;
                    }
                    if (endtimesTmp >=starttimes && endtimesTmp <= endtimes){
                        if (window.notificationClient){
                            window.notificationClient.showToast("日期有重复");  
                            //$("#dateFrom").focus();
                        }
                        return;
                    }
                }
                app.settings[i].dates.push({"dateFrom":app.viewModel.dateFrom(),"dateTo":app.viewModel.dateTo()});
                cityExist = true;
                break;
            }
        }
        var cityarr = selectCity.split(" ");
        var request = {
                Action:"SetPlacesOrdersStatus",
                Token:app.token,
                parameter:{province:cityarr[0],
                        city:cityarr[1],
                        district:cityarr[2],
                        datefrom:app.viewModel.dateFrom(),
                        dateto:app.viewModel.dateTo(),
                        status:0}
            };
        // var url = app.serverUrl + JSON.stringify(request);
        // window.location.href = url;
        // commonJS.get(url,function(data){
        //      alert(JSON.stringify(data));
        //    if(data.status !== 0)
        //     {
        //         alert(data.message);
        //         return;
        //     }else{
        //         //alert("添加成功");
        //         if (!cityExist){
        //             var setting = {"city": selectCity,"dates": [{"dateFrom":app.viewModel.dateFrom(),"dateTo":app.viewModel.dateTo()}]};
        //             app.settings.push(setting);
        //         }

        //         var testdiv = document.getElementById("settings");
        //         var innerHtml="";

        //         for(var i in app.settings){

        //             innerHtml = innerHtml+"<div data-role='collapsible' data-collapsed-icon='flat-time' data-expanded-icon='flat-time' data-collapsed='false'>";
        //             innerHtml = innerHtml + "<h3>" +app.settings[i].city + "</h3>";
           
        //             for (var j in app.settings[i].dates){
        //                 innerHtml= innerHtml + "<p>" +app.settings[i].dates[j].dateFrom + "-" + app.settings[i].dates[j].dateTo + "</p>";
                        
        //             }
        //             innerHtml = innerHtml + "</div>";
        //         }

        //         testdiv.innerHTML=innerHtml;
        //         $('body').trigger("create");
        //     }
        // });  
        if (!cityExist){
            var setting = {"city": selectCity,"dates": [{"dateFrom":app.viewModel.dateFrom(),"dateTo":app.viewModel.dateTo()}]};
            app.settings.push(setting);
        }

        var testdiv = document.getElementById("settings");
        var innerHtml="";

        for(var i in app.settings){

            innerHtml = innerHtml+"<div data-role='collapsible' data-collapsed-icon='flat-time' data-expanded-icon='flat-time' data-collapsed='false'>";
            innerHtml = innerHtml + "<h3>" +app.settings[i].city + "</h3>";
   
            for (var j in app.settings[i].dates){
                innerHtml= innerHtml + "<p>" +app.settings[i].dates[j].dateFrom + "-" + app.settings[i].dates[j].dateTo + "</p>";
                
            }
            innerHtml = innerHtml + "</div>";
        }

        testdiv.innerHTML=innerHtml;
        $('body').trigger("create");
    },

    selectCity:function(type){
        if(window.notificationClient){
            window.notificationClient.selectCity(1);
        }
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function(model) {
        document.addEventListener('backbutton', commonJS.goback, false);
        if(typeof localStorage === 'undefined' )
        {
          app.token = $.cookie("usrToken");
          app.usrName = $.cookie("usrName");
          app.gid = $.cookie("gid");
        }
        else
        {
          app.token = localStorage["usrToken"];
          app.usrName = localStorage["usrName"];
          app.gid = localStorage["gid"];
        }

        var date = new Date();
        $('#dateFrom').mobiscroll().date({
          theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
          mode: "scroller",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
          display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
          lang: "zh",       // Specify language like: lang: 'pl' or omit setting to use default
          minDate: new Date(date.getFullYear(),date.getMonth(),date.getDate()),  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
          maxDate: new Date(date.getFullYear()+1,date.getMonth(),date.getDate()),   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
          stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
        });

        $('#dateTo').mobiscroll().date({
          theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
          mode: "scroller",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
          display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
          lang: "zh",       // Specify language like: lang: 'pl' or omit setting to use default
          minDate: new Date(date.getFullYear(),date.getMonth(),date.getDate()),  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
          maxDate: new Date(date.getFullYear()+1,date.getMonth(),date.getDate()),   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
          stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
        });
        date.setDate(date.getDate()+1);
        app.viewModel.dateFrom = ko.observable( commonJS.dateFormat(Date.parse(date)/1000));
        app.viewModel.dateTo = ko.observable( commonJS.dateFormat(Date.parse(date)/1000));
        

//app.viewModel.city="city+county";
                //$("#txtCity").text("city+county1");
        // var request = {
        //         Action:"UserInformation",
        //         Token:app.token
        //     };
        // var url = app.serverUrl + JSON.stringify(request);
        
        // commonJS.get(url,function(data){
        //      //alert(JSON.stringify(data));
        //    if(data.status !== 0)
        //     {
        //         alert(data.message);
        //         return;
        //     }
        //     app.viewModel={
        //         canBeLocated : data.switch.location_stars,
        //         canBeCalled : data.switch.phone_stars,
        //         canGrabOrder :  data.switch.orders_stars,
        //         personalInfo:data.parameter,
        //         isGoodsMaster:false,
        //     };
        //     //alert(app.gid);
        //     if (app.gid=="1"){
        //         app.viewModel.isGoodsMaster=true;
        //     }
        //     if (data.switch.location_stars==1) {
        //         $("#locator-switch").parent().addClass("ui-flipswitch-active");
        //     };
        //     if (data.switch.phone_stars==1) {
        //         $("#calling-switch").parent().addClass("ui-flipswitch-active");
        //     };
        //     if (data.switch.orders_stars==1) {
        //         $("#order-switch").parent().addClass("ui-flipswitch-active");
        //     };

        // });  
        ko.applyBindings(app.viewModel);
        $('body').trigger("create");
        document.getElementById('txtCity').innerText="df sa d";
        app.receivedEvent('deviceready');
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

 
};
