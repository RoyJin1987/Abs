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
            address:ko.observable(''),
            image:""    
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
        var deviceId ="TestDeviceId";
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
                image:usr.image
            }
        }
        var url = ABSApplication.ABSServer.url + JSON.stringify(request);
        //alert(url);
        commonJS.get(url,function(data){
            // alert(JSON.stringify(data));
           if (data.status === 0) {
               
                if(typeof localStorage === 'undefined' )
                {
                    $.cookie('usrToken', data.Token, { expires: 7, path: '/' });
                }
                else
                {
                    localStorage.setItem('usrToken',data.Token);
                }
               request = {
                    Action:"UserInformation",
                    Token:data.Token,
                }
                url = ABSApplication.ABSServer.url + JSON.stringify(request);
                var token = data.Token;
                commonJS.get(url,function(data){
                    
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
                        
                        window.location.href="homemap.html";
                    }else{

                        alert(JSON.stringify(data.message));
                    }
                });

               alert("恭喜您，注册成功！");
               window.location.href="homemap.html";
           }else{
            alert(data.message);
           };
        });

    },

    validate:function()
    {
        return true;
    },

   onFaceImgClick:function(flag){
//  var w=$("#my_profile_page #face").width();
//  var h=$("#my_profile_page #face").height();
    var w=440;
    var h=440;
    
    var quality = 50;
//  log("device.platform="+device.platform+";quality====="+quality);
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
        // alert(Camera.pictureSource.CAMERA);
        // alert(Camera.pictureSource.PHOTOLIBRARY);
        //window.open(app.onCameraSuccess,app.onCameraError);

        fileChooser.open(app.onCameraSuccess,app.onCameraError);
        // cameraOptions={ 
        //         quality : quality,//ios为了避免部分设备上出现内存错误，quality的设定值要低于50。
        //         destinationType : Camera.DestinationType.FILE_URI,//FILE_URI,DATA_URL
        //         sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
        //         saveToPhotoAlbum: true
        // };
    }
    // alert(JSON.stringify(cameraOptions));
    
    },

    onCameraSuccess:function(imageURI){//imageData
//  log("data==="+imageURI);
//  $("#my_profile_page #face").attr("src","data:image/jpeg;base64," + imageData);
		alert(imageURI);
        var imgOriginalUrl=imageURI;
        
        //拍照成功后，需要上传文件
        var fileName=imageURI.substr(imageURI.lastIndexOf('/') + 1);
alert(fileName);
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
        alert(uri);
         var ft = new FileTransfer();
         ft.upload(imageURI, uri, app.onFileUploadSuccess, app.onFileUploadFail, options);
    },

    onCameraError:function(message){
        alert(message);
        log('Failed because: ' + message);
    },

    onFileUploadSuccess:function (result){
        
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
  
        app.newUser.image = filePath;
        alert("头像上传成功");
        log("========onFileUploadSuccess===========");
    //  log("Code = " + result.responseCode+";Response = " + result.response+";Sent = " + result.bytesSent);
    },
    onFileUploadFail:function (error){
		alert("alert(error);");
        alert(error);
        log("code = "+error.code+";upload error source = " + error.source+";upload error target = " + error.target);
    }

};
