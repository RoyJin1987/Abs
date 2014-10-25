/**
 * Created by li on 2014/7/13.
 */
var MessageFlashHandlers = {
    'connects':[],
    'onConnect':function(index) {
        this.connects[index.replace("socket_","")].onconnect();
    },
    'onDisconnect':function(index,flag) {
        this.connects[index.replace("socket_","")].ondisconnect();
    },
    'onMessage':function(index,topic, payload, qos, retain) {
        this.connects[index.replace("socket_","")].onmessage(topic, payload);
    },
    'onDebug':function(index,message) {
        this.connects[index.replace("socket_","")].ondebug(message);
    }

};
var MessageFlash = function (debug, path) {
    this.ws = null;
    this.path = path;
    this.debug = debug ? 1 : 0;
    this.readyState = 0;
    this.thisMovie = function (movieName) {
        if (navigator.appName.indexOf("Microsoft") != -1) {
            return window[movieName];
        }
        else {
            return document[movieName];
        }
    },
        this.createFlash = function () {
            if (typeof (this.path) == 'undefined') this.path = '';
            var html = '<object style="height:0px;" id="socket_' + this.index + '" name="socket_' + this.index + '" type="application/x-shockwave-flash" data="' + this.path + 'TTNMessage.swf" width=0 height=0 class="swfupload">\
		<param name="wmode" value="window">\
		<param name="movie" value="' + this.path + 'TTNMessage.swf">\
		<param name="quality" value="high">\
		<param name="menu" value="false">\
		<param name="allowScriptAccess" value="always">\
		<param name="flashvars" value="movieName=socket_' + this.index + '&handlers=MessageFlashHandlers&server=&port=0&debug=' + this.debug + '">\
			<embed style="height:0px;" id="socket_' + this.index + '"  name="socket_' + this.index + '" src="' + this.path + 'TTNMessage.swf" quality="high"\
                  pluginspage="http://www.macromedia.com/go/getflashplayer"\
                  type="application/x-shockwave-flash" width="0" height="0" allowScriptAccess="always" wmode="window"\
			flashvars="movieName=socket_' + this.index + '&handlers=MessageFlashHandlers&server=&port=0&debug=' + this.debug + '"></embed>\
		</object>';






            var div = document.createElement('div');
            div.id = "flash_" + this.index;
            div.innerHTML = html;
            document.body.appendChild(div);

            this.ws = this.thisMovie("socket_" + this.index);
        }
    this.init = function () {
        this.index = MessageFlashHandlers.connects.length;
        MessageFlashHandlers.connects.push(this);
        this.createFlash();
    }
    this.init();
}

var __this=null;
MessageFlash.prototype = {
    connect : function(url, clientID,login,passcode){
        if(typeof(window["socket_"+this.index].connect)=='function')this.ws=window["socket_"+this.index];
        if(typeof(document["socket_"+this.index].connect)=='function')this.ws=document["socket_"+this.index];
        var e=document.getElementById("socket_"+this.index);
        if(typeof(e)!='undefined'){
            if(typeof(e.connect)=='function'){
                this.ws=e;
            }
            else{
                e=e.getElementsByTagName("embed");
                if(typeof(e)!='undefined' && e.length>0 && typeof(e[0].connect)=='function'){
                    this.ws=e[0];
                }
            }
        }



        if(typeof(this.ws.connect)=='undefined'){
            __this=this;
            setTimeout(function(_this){
                if(typeof(_this)=='undefined'){
                    _this=__this;
                }
                _this.connect(url,clientID,login,passcode);
            }, 1000, this);
        }
        else{
            this.ws.connect("ws://"+url+":61613",clientID,login,passcode);
        }
    },
    subscribe : function(topic, qos){
        this.ws.subscribe(topic,qos);
    },
    unsubscribe : function(topic){
        this.ws.unsubscribe(topic);
    },
    publish : function(topic, payload,toclientId){
        this.ws.publish(topic, payload, toclientId);
    },
    disconnect : function(){
        this.ws.disconnect();
    }
};