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
  map:{},
  loacalSearch:{},
  $addressList :{},
  serverUrl:"http://112.124.122.107/Applications/web/?data=",
  token:"07b27a882cc721a9207250f1b6bd2868",
  orderId:"",
  baiduPosition:"",
  viewModel :{
    orderInfo:{
      send_address:{
        longitude:"",
        latitude:"",
        city:"上海市",
        address:'',
      },
      shipping_address:{
        longitude:"",
        latitude:"",
        city:"上海市",
        address:'',
      },
      distance:ko.observable(-1),

    },
    wenCengList :ko.observableArray(),
    modelsList: ko.observableArray(),
    selectedWenCeng:ko.observable(''),
    selectedModels:ko.observable(''),
    shipping_address:ko.observable(""),
    send_address:ko.observable(""), 
    send_city:"请点击选择城市", 
    shipping_city:"请点击选择城市",
    bid_item_tuijian:{ // 出价项 车型选择非卡车时才有
          freight:ko.observable(0),
          truckage:ko.observable(0),
          tipping:ko.observable(0),
    }, 
  },


  onLoad:function() {

      if (!window.device) {
          $(document).ready(this.onDeviceReady);
      } else {
          document.addEventListener('deviceready', this.onDeviceReady, false);
      }

  },

  sendClick:function() {
        app.viewModel.orderInfo.wenCeng = app.viewModel.selectedWenCeng;
        app.viewModel.orderInfo.models = app.viewModel.selectedModels();
        
        if (app.viewModel.selectedModels() == '8'){
          var order = app.extractOrder();
          var request = {
            Action:"OrderEdit",
            orderId:app.orderId,
            Token:app.token,
            parameter:order
          };
          //alert(JSON.stringify(app.viewModel.orderInfo));
          var url = app.serverUrl + JSON.stringify(request);
          //window.location.href = url;
          commonJS.get(url,function(data_){
            if (data_.status===0) {
              //提示用户
              //alert("订单提交成功！");
              window.location.href="pushing.html?orderId="+data_.orderId;
            }
            else{
              //提示用户
              alert(data_.message);
            }
          });
            
        }else{
          var order = app.extractOrder();
          if (!order) {
            return;
          };
          if(app.viewModel.orderInfo.distance() >0)
          {
            app.viewModel.bid_item_tuijian.freight((app.viewModel.orderInfo.distance() * 0.005).toFixed(0));
            app.viewModel.bid_item_tuijian.truckage((app.viewModel.orderInfo.distance() * 0.003).toFixed(0));
            app.viewModel.bid_item_tuijian.tipping ((app.viewModel.orderInfo.distance() * 0.0005).toFixed(0));

            app.viewModel.orderInfo.bid_item.freight(app.viewModel.bid_item_tuijian.freight());
            app.viewModel.orderInfo.bid_item.truckage(app.viewModel.bid_item_tuijian.truckage());
            app.viewModel.orderInfo.bid_item.tipping(app.viewModel.bid_item_tuijian.tipping());
          }
          $.mobile.changePage("#offer");
        }

    },

    selectCity:function(type){
      window.notificationClient.selectCity(type);
    },
    sendOrderClick:function() {
      //alert(app.viewModel.selectedModels());

      var order = app.extractOrder();

      var request = {
        Action:"OrderEdit",
        orderId:app.orderId,
        Token:app.token,
        parameter:order
      };
      var url = app.serverUrl + JSON.stringify(request);
      window.location.href = url;
      //alert(url);
      commonJS.get(url,function(data_){
        //alert(JSON.stringify(data_));
        if (data_.status===0) {
          //提示用户
          // alert("订单提交成功！");
          window.location.href="pushing.html?orderId="+app.orderId;
        }
        else{
          //提示用户
          alert(data_.message);
        }
      });            
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
        document.addEventListener('backbutton', commonJS.goback, false);
        var date = new Date();
        date.setMinutes(date.getMinutes()+30);
    
        $('#deliveryDate').mobiscroll().datetime({
            theme: "android-holo-light",     // Specify theme like: theme: 'ios' or omit setting to use default 
            mode: "scroller",       // Specify scroller mode like: mode: 'mixed' or omit setting to use default 
            display: "modal", // Specify display mode like: display: 'bottom' or omit setting to use default 
            lang: "zh",       // Specify language like: lang: 'pl' or omit setting to use default
            minDate: new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()),  // More info about minDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-minDate
            maxDate: new Date(date.getFullYear()+1,date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()),   // More info about maxDate: http://docs.mobiscroll.com/2-14-0/datetime#!opt-maxDate
            stepMinute: 1  // More info about stepMinute: http://docs.mobiscroll.com/2-14-0/datetime#!opt-stepMinute
        });
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
        if($.cookie('baiduPosition')){
          var position = $.cookie('baiduPosition');
          
          app.baiduPosition = JSON.parse(position);
          // alert(JSON.stringify(app.baiduPosition));
        }
        app.orderId = app.getUrlParam("orderId");
        if (app.orderId) {

          var jsonStr = '{"Action":"getWenceng"}';
          var url = app.serverUrl +  jsonStr;
          commonJS.get(url,function(text){ 
              app.viewModel.wenCengList = text.items;
          });

          jsonStr = '{"Action":"getModels"}';
          url = app.serverUrl + jsonStr;
          commonJS.get(url,function(text){      
            app.viewModel.modelsList = text.items;
          });

          if(typeof localStorage === 'undefined' )
          {
              app.baiduPosition = {lng:121.654443,lat:31.653235};
          }
          else
          {
            if(localStorage['baiduPosition'])
            {
              app.baiduPosition = JSON.parse(localStorage['baiduPosition']);
              //alert(localStorage['baiduPosition']);
            }
            if (!app.baiduPosition){
                var callback = function(pos){
                    app.baiduPosition = new BMap.Point(pos.coords.longitude,pos.coords.latitude);
                     // $.cookie('baiduPosition', JSON.stringify(app.baiduPosition), { expires: 1, path: '/' });
                    localStorage.setItem('baiduPosition',JSON.stringify(app.baiduPosition));
                    //alert(localStorage['baiduPosition']);
                    //alert(localStorage['baiduPosition']);
                    window.locationService.stop(noop,noop);
                }
                if(window.locationService)
                {
                  window.locationService.getCurrentPosition(callback,function(e){
                    window.locationService.stop(noop,noop);
                  });
                }

            }else{
              //alert(JSON.stringify(app.baiduPosition));
            }
          }
   
           var request = {
                Action:"getOrderById",
                orderId:app.orderId,
                Token:app.token
            };
            url = app.serverUrl + JSON.stringify(request);
            // debugger;
            commonJS.get(url,function(data){
                //alert(JSON.stringify(data));
                app.viewModel.orderInfo = data.item;
                app.viewModel.orderInfo.bid_item_tuijian={
                  freight:ko.observable(0),
                  truckage:ko.observable(0),
                  tipping:ko.observable(0)
                }
                //绑定数据
                app.viewModel.orderInfo.send_address.address = ko.observable(data.item.send_address.address);
                app.viewModel.orderInfo.send_address.longitude = ko.observable(data.item.send_address.longitude);
                app.viewModel.orderInfo.send_address.latitude = ko.observable(data.item.send_address.latitude);
                $("#send_address").prev().find("input").val( app.viewModel.orderInfo.send_address.address());

                app.viewModel.orderInfo.type = ko.observable(data.item.type);
                app.viewModel.orderInfo.weight = ko.observable(data.item.weight);
                app.viewModel.orderInfo.volume = ko.observable(data.item.volume);
                app.viewModel.orderInfo.ship_date_ = ko.observable(data.item.ship_date);
                app.viewModel.orderInfo.arrival_date_ = ko.observable(data.item.arrival_date);
                app.viewModel.orderInfo.consignee_name = ko.observable(data.item.consignee_name);
                app.viewModel.orderInfo.consignee_phone = ko.observable(data.item.consignee_phone);

                app.viewModel.orderInfo.shipping_address.address = ko.observable(data.item.shipping_address.address);
                app.viewModel.orderInfo.shipping_address.longitude = ko.observable(data.item.shipping_address.longitude);
                app.viewModel.orderInfo.shipping_address.latitude = ko.observable(data.item.shipping_address.latitude);
                $("#shipping_address").prev().find("input").val( app.viewModel.orderInfo.shipping_address.address());
                app.viewModel.orderInfo.distance = ko.observable(-1);

                app.viewModel.orderInfo.delivery_floor = ko.observable(data.item.delivery_floor);
                app.viewModel.orderInfo.additional_information = ko.observable(data.item.additional_information);
                app.viewModel.orderInfo.selectedModels = ko.observable(data.item.models);
                app.viewModel.orderInfo.bid_item.freight = ko.observable(data.item.bid_item.freight);
                app.viewModel.orderInfo.bid_item.truckage = ko.observable(data.item.bid_item.truckage);
                app.viewModel.orderInfo.bid_item.tipping = ko.observable(data.item.bid_item.tipping);
                app.viewModel.send_city = data.item.send_address.city;
                app.viewModel.shipping_city = data.item.shipping_address.city;


                app.viewModel.orderInfo.ship_date =  data.item.ship_date_();
                app.viewModel.orderInfo.arrival_date =  data.item.arrival_date_();
            
                // app.viewModel.orderInfo.bid_item.total = 200;
                app.viewModel.orderInfo.bid_item.total = ko.computed(function() {
                    return app.viewModel.orderInfo.bid_item.freight()*1+app.viewModel.orderInfo.bid_item.tipping()*1+app.viewModel.orderInfo.bid_item.truckage()*1;
                });

                if(app.viewModel.orderInfo.send_address.longitude() 
                  && app.viewModel.orderInfo.send_address.latitude()
                  && app.viewModel.orderInfo.shipping_address.longitude()
                  && app.viewModel.orderInfo.shipping_address.latitude())
                {
                    var start = {
                      lng:app.viewModel.orderInfo.send_address.longitude() ,
                      lat:app.viewModel.orderInfo.send_address.latitude() 
                    };
                    var destination = {
                      lng:app.viewModel.orderInfo.shipping_address.longitude(),
                      lat:app.viewModel.orderInfo.shipping_address.latitude()
                    }
                    app.viewModel.orderInfo.distance(app.getDistance(start,destination).toFixed(0));
                    app.viewModel.bid_item_tuijian.freight((app.viewModel.orderInfo.distance() * 0.005).toFixed(0));
                    app.viewModel.bid_item_tuijian.truckage((app.viewModel.orderInfo.distance() * 0.003).toFixed(0));
                    app.viewModel.bid_item_tuijian.tipping ((app.viewModel.orderInfo.distance() * 0.0005).toFixed(0));
                }

                ko.applyBindings(app.viewModel);
                $('body').trigger("create");

                if (data.item.selectedModels){
                  //$("#modelsList").val(data.item.selectedModels);
                  app.viewModel.selectedModels(data.item.models);
                  //alert(app.viewModel.selectedModels());
                  $("#modelsList").selectmenu("refresh"); 
                }
                if (data.item.selectedModels){
                  app.viewModel.selectedWenCeng(data.item.wenceng);
                  $("#wencengList").selectmenu("refresh"); 
                }
            });

            app.map = new BMap.Map("abs-map");        
            app.map.centerAndZoom(app.baiduPosition, 11);
            var options = {
                onSearchComplete: function(results){
                  // 判断状态是否正确
                  if (app.loacalSearch.getStatus() == BMAP_STATUS_SUCCESS){
                    // var s = [];
                    var html = "";
                    for (var i = 0; i < results.getCurrentNumPois(); i ++){
                      // s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
                       html += "<li><a href='#' onclick='app.bindAdrress(this)' lat="+results.getPoi(i).point.lat+" lng="+results.getPoi(i).point.lng+">" +  results.getPoi(i).title + "</a></li>";
                    }
                    var $ul = app.$addressList;
                    $ul.html( html );
                    $ul.listview( "refresh" );
                    $ul.trigger( "updatelayout");
                  }
                },
                pageCapacity:20

              };
              app.loacalSearch = new BMap.LocalSearch(app.map, options);

             $( "#send_address" ).on("filterablebeforefilter", function ( e, data ) {
              var $ul = $( this ),
                  $input = $( data.input ),
                  value = $input.val(),
                  html = "";
                  $ul.html( "" );
                  if ( value && value.length > 2 ) {
                      $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
                      $ul.listview( "refresh" );
                      app.$addressList = $ul;
                      app.loacalSearch.search($input.val());
                  }
             });

             $( "#shipping_address" ).on("filterablebeforefilter", function ( e, data ) {
              var $ul = $( this ),
                  $input = $( data.input ),
                  value = $input.val(),
                  html = "";
                  $ul.html( "" );
                  if ( value && value.length > 2 ) {
                      $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
                      $ul.listview( "refresh" );
                      app.$addressList = $ul;
                      app.loacalSearch.search($input.val());
                  }
             });
             $("a.plus-expense").on("click", function ( e, data ){
                var $self = $(this);
                var $input = $self.parents(".form-line-wrapper").find("input");
                if (($input.val()*1 + 10)>100000) {
                  return;
                }else{
                  $input.val($input.val()*1+10).change();
                }
             });
             $("a.minus-expense").on("click", function ( e, data ){
                var $self = $(this);
                var $input = $self.parents(".form-line-wrapper").find("input");
                $input.focus();
                if (($input.val()*1 - 10)<0) {
                  return;
                }else{
                  $input.val($input.val()*1-10).change();
                }
             });
        }
       

    },

    extractOrder:function()
    { 
        var clone = function clone(myObj){ 
          if(typeof(myObj) != 'object') return myObj; 
          if(myObj == null) return myObj; 
          var myNewObj = new Object(); 
          for(var i in myObj) 
          myNewObj[i] = clone(myObj[i]); 
          return myNewObj; 
        } 

        var order = clone(app.viewModel.orderInfo);


        if (!app.viewModel.orderInfo.send_address.address()
          ||app.viewModel.orderInfo.send_address.address() !== $("#send_address").prev().find("input").val() ) {
          app.viewModel.orderInfo.send_address.address($("#send_address").prev().find("input").val());
          app.viewModel.orderInfo.send_address.longitude("");
          app.viewModel.orderInfo.send_address.latitude("");
          app.viewModel.orderInfo.distance(-1);
        };
        if (app.viewModel.orderInfo.send_address.address()){
          order.send_address.address = app.viewModel.orderInfo.send_address.address();
          order.send_address.longitude = app.viewModel.orderInfo.send_address.longitude();
          order.send_address.latitude = app.viewModel.orderInfo.send_address.latitude();

        }else{
          if (window.notificationClient){
            window.notificationClient.showToast("请输入发货地址");  
          }
          return null;
        }

        if (!app.viewModel.orderInfo.shipping_address.address() 
          ||app.viewModel.orderInfo.shipping_address.address() !== $("#shipping_address").prev().find("input").val() ) {
          app.viewModel.orderInfo.shipping_address.address($("#shipping_address").prev().find("input").val());
          app.viewModel.orderInfo.shipping_address.longitude("");
          app.viewModel.orderInfo.shipping_address.latitude("");
          app.viewModel.orderInfo.distance (-1);
        };
         if (app.viewModel.orderInfo.shipping_address.address()){
          order.shipping_address.address = app.viewModel.orderInfo.shipping_address.address();
          // order.shipping_address.city = shipCityCounty[0];
          order.shipping_address.longitude = app.viewModel.orderInfo.shipping_address.longitude();
          order.shipping_address.latitude = app.viewModel.orderInfo.shipping_address.latitude();
        }else{
          if (window.notificationClient){
            window.notificationClient.showToast("请输入收货地址");  
            $("#shipping_address").focus();
          }
          return null;
        }


        if (app.viewModel.orderInfo.send_address.longitude() 
           && app.viewModel.orderInfo.send_address.latitude() 
            && app.viewModel.orderInfo.shipping_address.longitude() 
            && app.viewModel.orderInfo.shipping_address.latitude()) {
          var start = {
            lng:app.viewModel.orderInfo.send_address.longitude() ,
            lat:app.viewModel.orderInfo.send_address.latitude() 
          };
          var destination = {
            lng:app.viewModel.orderInfo.shipping_address.longitude(),
            lat:app.viewModel.orderInfo.shipping_address.latitude()
          }
          app.viewModel.orderInfo.distance(app.getDistance(start,destination).toFixed(0));
        };



        if (app.viewModel.orderInfo.consignee_name()){
            order.consignee_name = app.viewModel.orderInfo.consignee_name();
        }else{
            if (window.notificationClient){
              window.notificationClient.showToast("请输入收货人姓名");  
              $("#receiver").focus();
            }
            return null;
        }
        if (app.viewModel.orderInfo.consignee_phone()){
            var regPartton=/1[3-8]+\d{9}/;
            if(!regPartton.test(app.viewModel.orderInfo.consignee_phone())){
              window.notificationClient.showToast("手机号码格式不正确！");  
              $("#tel").focus();
              return null;
            }
            order.consignee_phone = app.viewModel.orderInfo.consignee_phone();
        }else{
            if (window.notificationClient){
              window.notificationClient.showToast("请输入收货人电话");  
              $("#tel").focus();
            }
            return null;
        }

        order.send_address.address = app.viewModel.orderInfo.send_address.address();
        order.type = app.viewModel.orderInfo.type();
        // order.weight = app.viewModel.orderInfo.weight();
        // order.volume = app.viewModel.orderInfo.volume();
        if ( app.viewModel.orderInfo.weight()*1 >= 1 && app.viewModel.orderInfo.weight()*1 <= 10000) {
          order.weight = app.viewModel.orderInfo.weight();
        }else{
           if (window.notificationClient){
              window.notificationClient.showToast("货物重量应在1~10000之间");  
              $("#weight").focus();
            }
            return null;
        }
        
        if (app.viewModel.orderInfo.volume()*1 >=1 && app.viewModel.orderInfo.volume()*1 <= 1000) {
           order.volume = app.viewModel.orderInfo.volume();
        }else{
           if (window.notificationClient){
              window.notificationClient.showToast("货物体积应在1~1000");  
              $("#weight").focus();
            }
            return null;
        }
     
        order.ship_date = app.viewModel.orderInfo.ship_date_();
        order.arrival_date = app.viewModel.orderInfo.arrival_date_();
        order.shipping_address.address = app.viewModel.orderInfo.shipping_address.address();
        order.delivery_floor = app.viewModel.orderInfo.delivery_floor();
        order.additional_information = app.viewModel.orderInfo.additional_information();
        order.selectedModels = app.viewModel.orderInfo.selectedModels();
        order.bid_item.freight = app.viewModel.orderInfo.bid_item.freight();
        order.bid_item.truckage = app.viewModel.orderInfo.bid_item.truckage();
        order.bid_item.tipping = app.viewModel.orderInfo.bid_item.tipping();
        order.consignor = $.cookie("usrName");

        return order;
    },

    getUrlParam : function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    },
      bindAdrress:function(btn)
  {
    var $li = $(btn).parent();
    var $ul = $li.parent();
    $ul.prev().find("input").val($(btn).text());
    $ul.html( "" );
    $ul.listview( "refresh" );
    $ul.trigger( "updatelayout");
    var point =  {
      lng:$(btn).attr("lng"),
      lat:$(btn).attr("lat")
    }
    if ($ul.attr("id") === "send_address") {
      app.viewModel.orderInfo.send_address.address ($(btn).text());
      app.viewModel.orderInfo.send_address.longitude(point.lng);
      app.viewModel.orderInfo.send_address.latitude (point.lat);
    }
    else if($ul.attr("id") === "shipping_address")
    {
      app.viewModel.orderInfo.shipping_address.address ($(btn).text());
      app.viewModel.orderInfo.shipping_address.longitude(point.lng);
      app.viewModel.orderInfo.shipping_address.latitude(point.lat);
    }
    if (app.viewModel.orderInfo.send_address.longitude() 
       && app.viewModel.orderInfo.send_address.latitude() 
        && app.viewModel.orderInfo.shipping_address.longitude() 
        && app.viewModel.orderInfo.shipping_address.latitude()) {
      var start = {
        lng:app.viewModel.orderInfo.send_address.longitude() ,
        lat:app.viewModel.orderInfo.send_address.latitude() 
      };
      var destination = {
        lng:app.viewModel.orderInfo.shipping_address.longitude(),
        lat:app.viewModel.orderInfo.shipping_address.latitude()
      }
      app.viewModel.orderInfo.distance(app.getDistance(start,destination).toFixed(0));
    };
  },

  getDistance:function(p1,p2)
  {
      var pk = 180 / 3.1415927;
      a1 = p1.lat / pk;
      a2 = p1.lng / pk;
      b1 = p2.lat / pk;
      b2 = p2.lng / pk;
      t1 = Math.cos(a1) * Math.cos(a2) * Math.cos(b1) * Math.cos(b2);
      t2 = Math.cos(a1) * Math.sin(a2) * Math.cos(b1) * Math.sin(b2);
      t3 = Math.sin(a1) * Math.sin(b1);
      tt = Math.acos(t1 + t2 + t3);
      return 6366000 * tt;
  }


};
