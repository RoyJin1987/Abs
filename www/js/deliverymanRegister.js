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
        name:'',
        location:ko.observable(''),
        company_description:ko.observable(''),
        distribution_range:ko.observable(''),
        license_plate_number:ko.observable(''),
        vehicle_description:ko.observable(''),
        company_name:'',
        company_address:ko.observable(''),
        company_tel:ko.observable(''),
        //mobile_number:'',
        type: ko.observable("2"),
        model: ko.observable("7"),
        showPersonal: ko.observable(true), 
        showAgency: ko.observable(false), 
        showCompany: ko.observable(false),  
        hasStandard: ko.observable(false), 
        hasRefrigerate: ko.observable(false), 
        hasFrozen: ko.observable(false), 
        image:"",
        id_card:"",
        driving_license:"",
        driving_permits:"",
        business_license:"",
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
    uploadtype:"",
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
                image:usr.image,
                mobile_number:usr.mobile_number(),
                mobile_number_code:usr.mobile_number_code(),
                name:usr.name,
                location:"",
                id_card:usr.id_card,
                //id_card:"",
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
            request.parameter.driving_license =usr.driving_license;
            request.parameter.driving_permits =usr.driving_permits;
            // request.parameter.driving_license ="";
            // request.parameter.driving_permits ="";
            request.parameter.license_plate_number =usr.license_plate_number();
            request.parameter.vehicle_description =usr.vehicle_description();
        }else{
            request.parameter.company_name =usr.company_name;
            request.parameter.company_address =usr.company_address();
            request.parameter.company_tel =usr.company_tel();
            request.parameter.business_license =usr.business_license;
        }

        //alert(JSON.stringify(request));
        var url = ABSApplication.ABSServer.url + JSON.stringify(request);
        commonJS.get(url,function(data){
           if (data.status === 0) {
               if(typeof localStorage === 'undefined' )
                {
                    $.cookie('usrToken', data.Token, { expires: 7, path: '/' });
                }
                else
                {
                    localStorage.setItem('usrToken',data.Token);
                }
                var token = data.Token;
                request = {
                    Action:"UserInformation",
                    Token:data.Token,
                }
                url = ABSApplication.ABSServer.url + JSON.stringify(request);

                commonJS.get(url,function(data){
                    //alert(JSON.stringify(data));
                    if (data.status === 0) {
                        if(typeof localStorage === 'undefined' )
                        {
                            $.cookie('usrName', data.parameter.name, { expires: 7, path: '/' });
                            $.cookie('usrIdentity', data.parameter.identity, { expires: 7, path: '/' });
                            $.cookie('usrImage', ABSApplication.ABSServer.host +data.parameter.image, { expires: 7, path: '/' });
                        }
                        else
                        {
                            localStorage.setItem('usrName',data.parameter.name);
                            localStorage.setItem('usrIdentity',data.parameter.identity);
                            localStorage.setItem('usrImage',ABSApplication.ABSServer.host +data.parameter.image);
                        }
                        
                        // console.log('usrName = '+ localStorage['usrName']);
                        if (window.notificationClient) {
                            window.notificationClient.startService(data.parameter.identity,token,true);
                        };
                        alert("注册成功！");
                        window.location.href="homemap.html";
                    }else{
                        alert(JSON.stringify(data.message));
                    }
                });
               window.location.href="homemap.html";
           }else{
                alert(data.message);
           }
        });

    },

    validate:function()
    {
        return true;
    },

    //显示加载器
    showLoader:function () {
        //显示加载器.for jQuery Mobile 1.2.0
        $.mobile.loading('show', {
            text: '正在上传文件...', //加载器中显示的文字
            textVisible: true, //是否显示文字
            theme: 'a',        //加载器主题样式a-e
            textonly: false,   //是否只显示文字
            html: ""           //要显示的html内容，如图片等
        });
    },

    //隐藏加载器.for jQuery Mobile 1.2.0
    hideLoader:function ()
    {
        //隐藏加载器
        $.mobile.loading('hide');
    },

    upload:function (type)
    {
        app.uploadtype =type;
    },

   onFaceImgClick:function(flag){
    var w=440;
    var h=440;
    
    var quality = 50;
    var cameraOptions;
    if(flag==0){
        cameraOptions={ 
                quality : quality,//ios为了避免部分设备上出现内存错误，quality的设定值要低于50。
                destinationType : Camera.DestinationType.FILE_URI,//FILE_URI,DATA_URL
                sourceType : Camera.PictureSourceType.CAMERA,//CAMERA,SAVEDPHOTOALBUM
                allowEdit : true,
                encodingType : Camera.EncodingType.JPEG,//JPEG,PNG
                targetWidth : w,
                targetHeight : h
        };
        navigator.camera.getPicture( app.onCameraSuccess, app.onCameraError, app.cameraOptions);
    }else{
        fileChooser.open(app.onCameraSuccess,app.onCameraError);
    }
    },

    onCameraSuccess:function(imageURI){//imageData
        app.showLoader();
        var imgOriginalUrl=imageURI;
        
        //拍照成功后，需要上传文件
        var fileName=imageURI.substr(imageURI.lastIndexOf('/') + 1);
        var options = new FileUploadOptions();

        options.fileKey = "file";//图片域名！！！

        if(fileName.indexOf('?')==-1){
            options.fileName = fileName;
        }else{
            options.fileName = fileName.substr(0,fileName.indexOf('?'));
        }
       
         options.mimeType = "image/jpeg";
        //options.mimeType = "multipart/form-data";
         options.chunkedMode = false;
         
         var params = {};
         params.fileType = "customer";
         options.params = params;
       
         var request = {
            Action:"upFile",
            type:"image" ,
            Token:"",
        }
      
         var uri = encodeURI(ABSApplication.ABSServer.url+JSON.stringify(request));
        //alert(uri);
         var ft = new FileTransfer();
         ft.upload(imageURI, uri, app.onFileUploadSuccess, app.onFileUploadFail, options);
    },

    onCameraError:function(message){
        alert(message);
        log('Failed because: ' + message);
    },

    onFileUploadSuccess:function (result){
        app.hideLoader();
        var response = JSON.stringify(result.response);
      
        var pairs = response.split(",");
        var filePath="";
        for (var i in pairs){

            var pair = pairs[i].split(":");
            var tmpPath;
            if (pair[0].indexOf("filepath")>-1){
              
                tmpPath = pair[1];
                var paths= tmpPath.split("\\\/");
                for (var j in paths){
                    filePath =filePath +"/"+ paths[j];
                }
                filePath =filePath.substr(3);
                filePath = filePath.replace("\\\"","");
            }
        }
        
        if(app.uploadtype=="1"){
            app.newUser.image = filePath;
            alert("头像上传成功");
        }else if(app.uploadtype=="2"){
            app.newUser.id_card = filePath;
            alert("身份证上传成功");
        }else if(app.uploadtype=="3"){
            app.newUser.driving_license = filePath;
            alert("驾驶证上传成功");
        }else if(app.uploadtype=="4"){
            app.newUser.driving_permits = filePath;
            alert("行驶证上传成功");
        }else if(app.uploadtype=="5"){
            app.newUser.business_license = filePath;
            alert("营业执照上传成功");
        }
        
        
        log("========onFileUploadSuccess===========");
    },
    onFileUploadFail:function (error){
        app.hideLoader();
        alert("上传出错");
        log("code = "+error.code+";upload error source = " + error.source+";upload error target = " + error.target);
    }

};
