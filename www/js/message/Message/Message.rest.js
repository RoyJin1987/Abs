function MessageRest(_debug) {	 
	this.connected = false; 
	this._debug = _debug; 
	this.url = ""; 
	this.login = ""; 
	this.passcode = ""; 
	this.clientID="Rest"+new Date().getTime();
	this.debug = function(message) {
      var _ref;
	  if(typeof(this._debug)=='undefined' || !this.debug){return;}
      return typeof window !== "undefined" && window !== null ? (_ref = window.console) != null ? _ref.log(message) : void 0 : void 0;
    }; 
	this.isXDomainRequest=false;
    /**
    * WN.getAjax	
    * new Ajax¶ÔÏñ
    * @access public ¡¡
    * @return Ajax
    */
    this.getAjax= function () {
        var name = false;
		this.isXDomainRequest=false;
        try {
            try {
                name = new XDomainRequest();
				this.isXDomainRequest=true;
            }
            catch (e) {
				try {
					name = (navigator.appName.indexOf('Microsoft') >= 0) ? new ActiveXObject("Msxml2.XMLHTTP") : new XMLHttpRequest();
				}
				catch (e) {
					name = (navigator.appName.indexOf('Microsoft') >= 0) ? new ActiveXObject("Microsoft.XMLHTTP") : window.createRequest();
				}
			}
        } catch (e) {
            try {
                name = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                if (typeof XMLHttpRequest != 'undefined') {
                    try {
                        name = new XMLHttpRequest();
                    } catch (e) {
                        if (window.createRequest) {
                            try {
                                name = window.createRequest();
                            } catch (e) {
                                name = null;
                            }
                        }
                    }
                }
            }
        }
        return name;
    };
	this.get= function (url, callbacks,errbacks) {
		var ajax = this.getAjax();
		if(this.isXDomainRequest){
			 var ___this=this;
			 ajax.onload = function (e) {
				___this.getTime=new Date().getTime();
				if (typeof (callbacks) == 'function') {
					var status=204;
					if(ajax.responseText.length>0)status=200;
					callbacks("",ajax.responseText,status); 
				} 
			 };
			 ajax.onerror = function (e) {
				 ___this.getTime=new Date().getTime();
				 if (typeof (callbacks) == 'function') {
						callbacks("",ajax.responseText,500);
				} 
			 }
			 ajax.timeout = 10000;
			 ajax.ontimeout= function (e) {
				 ___this.getTime=new Date().getTime();
				 if (typeof (callbacks) == 'function') {
						callbacks("",ajax.responseText,204);
				} 
			 } 
			 ajax.open("GET", url);
			 ajax.send(null);
			 ___this.getTime=new Date().getTime();
			 setTimeout(function(){
				 var i=new Date().getTime(); 
				 if((i-___this.getTime) >13000){
					 try{
					 ___this.get(url, callbacks,errbacks); 
					 } catch (e) {}
				 }
			 },15000);
		}
		else{
			ajax.open("GET", url, true);
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4) { 
					if (typeof (callbacks) == 'function') {
						callbacks("",ajax.responseText,ajax.status);
					}
				}
			};
			ajax.send(null); //·¢ËÍ
		}
	}
	this.connect = function (url, clientID, login, passcode) {
		this.url=url;
		this.clientID=clientID;
		this.login=login;
		this.passcode=passcode;
		this.connected = true; 
		if(this.onconnect){
			this.onconnect();
		}
	}
	this.getMessage=function(topic){
		var __this={_this:this,destination:topic};
		var url="http://"+this.url+":8161/api/message/"+topic+"?clientId="+this.clientID;
		this.get(url, function(destination,message,status){
					destination=__this.destination;  
					if(status==200){
						if(__this._this.onmessage){ 
							__this._this.onmessage(destination, unescape(message));
						} 
					}
					if(__this._this.issubscribe(destination)){
						window.setTimeout(function(_this){
								if(typeof(_this)=='undefined'){
									_this=__this._this;
								} 
								_this.getMessage(destination);
							}, 10, __this._this);
					}
				}, function(){  
					if(__this._this.issubscribe(topic)){
						window.setTimeout(function(_this){
								if(typeof(_this)=='undefined'){
									_this=__this._this;
								} 
								_this.getMessage(topic);
							}, 10, __this._this);
					}
				}); 
	};
	this.disconnect = function() {
		this.connected = false; 
		if(this.ondisconnect){
			this.ondisconnect();
		}
	};
	this.publish = function(topic, payload,toclientId) {
		var value="body="+payload;
		var ajax = this.getAjax();
		var url="http://"+this.url+":8161/api/message/"+topic+"?clientId="+this.clientID;

		if(this.isXDomainRequest){
			try{
				ajax.contentType = "application/x-www-form-urlencoded";
			}
			catch(e){}
			ajax.onload = function () { 
				if (typeof (callbacks) == 'function') {
					var status=204;
					if(ajax.responseText.length>0)status=200;
					callbacks("",ajax.responseText,status); 
				}
			};
			ajax.onerror = function (e) {};
			ajax.open("POST", url);
			ajax.send(value);
		}
		else{
			ajax.open("POST", url, true); 
			ajax.setRequestHeader("Content-Length",value.length);   
			ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded"); 
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4) { 
					if (typeof (callbacks) == 'function') {
						callbacks("",ajax.responseText,ajax.status);
					}
				}
			};
			ajax.send(value); //·¢ËÍ
		}
	};
	this.subscribes=new Array();
	this.subscribe = function(destination, qos) {
		this.subscribes.push({topic:destination,'qos':qos}); 
		var __this=this;
		window.setTimeout(function(_this){
					if(typeof(_this)=='undefined'){
						_this=__this;
					} 
					_this.getMessage(destination);
				}, 10, this); 
	};
	this.issubscribe=function(destination) {
		for(var i=0;i<this.subscribes.length;i++){
			if(this.subscribes[i].topic==destination)return true;
		}
		return false;
	};
	this.unsubscribe = function(topic) { 
		for(var i=0;i<this.subscribes.length;i++){
			if(this.subscribes[i].topic==destination){ 
				for(var i=0,n=0;i<this.subscribes.length;i++)  
				{  
					if(this.subscribes[i].topic!=this.subscribes[dx].topic)  
					{  
						this.subscribes[n++]=this.subscribes[i];
					}  
				}  
				this.subscribes.length-=1;
				return true;
			}
		}
		return true;
	};
};