/**
 * Created by li on 2014/7/13.
 */
var LL = {
    /**
     * LL.path
     * 框架路径
     * @access public
     */
    path: "js/message/",
    /**
     * LL.System
     * LL核心对像
     * @access public
     * @param function init
     * @param system string	操作系统
     * @param webSocket bool　是否支持 WebSocket
     * @param flash object{}　是否支持 Flash 和版本号
     */
    System: {
        init: function () { },
        system: undefined,
        webSocket: false,
        flash: { status: false, version: undefined },
        iPad: false,
        iPhone: false
    },
    /**
     * LL.Message
     * 消息对像
     * @access public
     * @param function init
     * @param function send	发送消息
     * @param event onMessage　收到消息事件
     */
    Message: {
        path: "",
        deviceId: "",
        init: function () { },
        send: function (value) { },
        onMessage: function (message) { }
    },
    /**
     * LL.Interfaces
     * 数据接口对像
     * @access public
     * @param function init
     * @param function getSubject
     * @param function findTeacher 　
     */
    Interfaces: {
        init: function () { }
    },
    /**
     * 支持事件
     */
    Events:{
        onInterfacesLoadedEvent:0,
        onMessageLoadedEvent:1
    },
    /**
     * 添加监听事件
     * @param type
     * @param listener
     */
    addEventListener:function(type,listener){
        if(typeof(listener)=='function'){
            switch (type){
                case this.Events.onMessageLoadedEvent:
                    this.onMessageLoadedEvent=listener;
                    break;
                case this.Events.onInterfacesLoadedEvent:
                    this.onInterfacesLoadedEvent=listener;
                    break
            }
        }
    },
    /**
     * LL.init
     * 初始化对像
     * @access public
     * @return void	无返回
     */
    init: function () {
        this.destination = "Tryout" + new Date().getTime()
        LL.loadPlugin(
            [
                    this.path + "Interfaces/Interfaces.js",
                    this.path + "System/System.js",
                    this.path + "Message/Message.js"
            ],
            [
                function () { LL.Interfaces.init(); },
                function () { LL.System.init(); },
                function () { LL.Message.init(); }
            ]);
        if(typeof(LLOptions)=='object' && typeof(LLOptions.Widgets)=='object'){
            for(var obj in LLOptions.Widgets){
                if(typeof(LLOptions.Widgets[obj])=='string'){
                    LL.loadPlugin(
                        [
                                this.path + "Widget/"+LLOptions.Widgets[obj]+".js"
                        ],
                        [
                            function () { }
                        ]);
                }
            }
        }
    },
    /**
     * LL.loadJs
     * 加载脚本
     * @access public
     * @param string scriptFile
     * @param function callback
     * @return void	无返回
     */
    loadScript: function (scriptFile, callback) {
        callback = typeof (callback) == 'function' ? callback : function () { };
        if (/^file\:.+$/gi.test(location.href)) {
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = scriptFile;
            document.getElementsByTagName('HEAD').item(0).appendChild(oScript);
            window.setTimeout(callback, 100);
        }
        else {
            var oScript = document.createElement("script");
            oScript.type = "text/javascript";
            if (callback) {
                oScript.onload = oScript.onreadystatechange = function () {
                    if (oScript.readyState && oScript.readyState != 'loaded' && oScript.readyState != 'complete') return;
                    oScript.onreadystatechange = oScript.onload = null;
                    callback();
                };
            }
            oScript.src = scriptFile;
            document.getElementsByTagName('HEAD').item(0).appendChild(oScript);
            //this.get(scriptFile, callback, true, this.getType.script);
        }
    },
    /**
     * LL.getScript
     * 加载脚本
     * @access public
     * @param string scriptFile
     * @return void	无返回
     */
    loadPlugin: function (scriptFiles, callbacks) {
        if (typeof (scriptFiles) == 'object') {
            for (var i in scriptFiles) {
                this.loadScript(scriptFiles[i], callbacks[i]);
            }
        }
        else if (typeof (scriptFiles) == 'string') {
            this.loadScript(scriptFiles, callbacks);
        }
    },
    /**
     * LL.getJsonString
     * 加载脚本
     * @access public
     * @param object o
     * @return string	返回JSON字符串
     */
    getJsonString: function (o) {
        var r = [];
        if (typeof o == "string") {
            if (escape(o).indexOf("%u") >= 0) o = escape(o).replace(/%u/ig, "\\u");
            return '"' + o + '"';
        }
        else if (o == null) return "null";
        if (typeof o == "object") {
            if (!o.sort) {
                r[0] = "{";
                for (var i in o) {
                    r[r.length] = '"' + i + '"';
                    r[r.length] = ":";
                    r[r.length] = this.getJsonString(o[i]);
                    r[r.length] = ",";
                }
                if (r.length > 1) {
                    r[r.length - 1] = "}";
                }
                else {
                    r[r.length] = "}";
                }
            } else {
                r[0] = "[";
                for (var i = 0; i < o.length; i++) {
                    r[r.length] = this.getJsonString(o[i]);
                    r[r.length] = ",";
                }
                if (r.length > 1) {
                    r[r.length - 1] = "]";
                }
                else {
                    r[r.length] = "]";
                }
            }
            return r.join("");
        }
        return o.toString();
    },
    /**
     * LL.json
     * JSON对像
     * @access public
     * @param string JSON字符串
     * @return object	返回JSON对像
     */
    json: function (data) {
        return eval('(' + data + ')');
    },
    /**
     * LL.getAjax
     * new Ajax对像
     * @access public 　
     * @return Ajax
     */
    getAjax: function () {
        var name = false;
        try {
            try {
                name = (navigator.appName.indexOf('Microsoft') >= 0) ? new ActiveXObject("Msxml2.XMLHTTP") : new XMLHttpRequest();
            }
            catch (e) {
                name = (navigator.appName.indexOf('Microsoft') >= 0) ? new ActiveXObject("Microsoft.XMLHTTP") : window.createRequest();
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
    },
    /**
     * LL.getType
     * get加载数据内型
     * @access public 　　
     */
    getType: { json: 0, html: 1, xml: 2, text: 4, script: 5 },
    /**
     * LL.post
     * POST加载内容
     * @access public
     * @param string url
     * @return void	无返回
     */
    post: function (url, options, callbacks, varAsync, type) {
        if (typeof (varAsync) != 'boolean') {
            varAsync = true;
        }
        if (typeof (type) == 'undefined') {
            type = this.getType.text;
        }
        var value = "";
        if (typeof options == "string") {
            value += options;
        }
        else if (typeof options == "object") {
            if (!options.sort) {
                for (var i in options) {
                    value += "&" + i + "=" + options[i];
                }
            }
        }
        var ajax = this.getAjax();
        ajax.open("POST", url, varAsync);
        ajax.setRequestHeader("Content-Length", value.length);
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if (varAsync) {
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    switch (type) {
                        case LL.getType.json:
                            if (typeof (callbacks) == 'function') {
                                callbacks(LL.json(ajax.responseText));
                            }
                            break;
                        case LL.getType.html:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                        case LL.getType.xml:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                        case LL.getType.text:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                        case LL.getType.script:
                            eval(ajax.responseText);
                            if (typeof (callbacks) == 'function') {
                                callbacks();
                            }
                            break;
                        default:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                    }
                }
            };
            ajax.send(value); //发送
        } else {
            ajax.send(value); //发送
            if (ajax.readyState == 4 && ajax.status == 200) {
                switch (type) {
                    case LL.getType.json:
                        if (typeof (callbacks) == 'function') {
                            callbacks(LL.json(ajax.responseText));
                        }
                        break;
                    case LL.getType.html:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                    case LL.getType.xml:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                    case LL.getType.text:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                    case LL.getType.script:
                        eval(ajax.responseText);
                        if (typeof (callbacks) == 'function') {
                            callbacks();
                        }
                        break;
                    default:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                }
            }
        }
    },
    /**
     * LL.get
     * GET加载内容
     * @access public
     * @param string url
     * @return void	无返回
     */
    get: function (url, callbacks, varAsync, type) {
        if (typeof (varAsync) != 'boolean') {
            varAsync = true;
        }
        if (typeof (type) == 'undefined') {
            type = this.getType.text;
        }
        var ajax = this.getAjax();
        ajax.open("GET", url, varAsync);
        if (varAsync) {
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    switch (type) {
                        case LL.getType.json:
                            if (typeof (callbacks) == 'function') {
                                callbacks(LL.json(ajax.responseText));
                            }
                            break;
                        case LL.getType.html:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                        case LL.getType.xml:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                        case LL.getType.text:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                        case LL.getType.script:
                            eval(ajax.responseText);
                            if (typeof (callbacks) == 'function') {
                                callbacks();
                            }
                            break;
                        default:
                            if (typeof (callbacks) == 'function') {
                                callbacks(ajax.responseText);
                            }
                            break;
                    }
                }
            };
            ajax.send(null); //发送
        }
        else {
            ajax.send(null); //发送
            if (ajax.readyState == 4 && ajax.status == 200) {
                switch (type) {
                    case LL.getType.json:
                        if (typeof (callbacks) == 'function') {
                            callbacks(LL.json(ajax.responseText));
                        }
                        break;
                    case LL.getType.html:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                    case LL.getType.xml:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                    case LL.getType.text:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                    case LL.getType.script:
                        eval(ajax.responseText);
                        if (typeof (callbacks) == 'function') {
                            callbacks();
                        }
                        break;
                    default:
                        if (typeof (callbacks) == 'function') {
                            callbacks(ajax.responseText);
                        }
                        break;
                }
            }
        }
    }
};
(function( LL ) {
    /**
     * LL.get
     * GET加载内容
     * @access public
     * @param string url
     * @return void	无返回
     */
    LL.E = function(name,obj){
        this.$=function(id){
            return document.getElementById(id);
        }
        this.F=function(className,obj){
            var Tobj=null;
            if((typeof(obj)).indexOf("object")<0 || obj==null)return null;
            try{
                if(obj.className.indexOf(className)>=0)return obj;
            } catch (e) { }
            for(var i=0;i<obj.childNodes.length;i++){
                Tobj=this.F(className,obj.childNodes[i]);
                if(Tobj!=null)return Tobj;
            }
            return null;
        }
        if(name.indexOf("#")==0){
            if(name.indexOf(".")<0){
                return this.$(name.substr(1));
            }
            else{
                return this.F(name.substr(name.indexOf(".")+1),this.$(name.substr(1,name.indexOf(".")-2)));
            }
        }
        else if(name.indexOf(".")==0){
            return (typeof(obj)).indexOf("object")>=0 ? this.F(name.substr(1),obj) : this.F(name.substr(1),document);
        }
        else{
            return this.$(name);
        }
    };
    LL.init();
}( LL ));