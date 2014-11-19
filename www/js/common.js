'use strict'
/*
 * app??
 */

   Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var commonJS = {
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

    jsonDateFormat:function(jsonDate) {//json日期格式转换为正常格式
        return new Date(jsonDate*1000).Format("yyyy-MM-dd hh:mm");
    },
    goback: function () {
        history.back();
    },

    alertDeveloping: function () {
        alert("正在加班加点，敬请期待！");
    },

    /**
     * LL.json
     * JSON??
     * @access public
     * @param string JSON???
     * @return object	??JSON??
     */
    json: function (data) {
        return eval('(' + data + ')');
    },
    /**
     * LL.getAjax
     * new Ajax??
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
     * get??????
     * @access public   
     */
    getType: { json: 0, html: 1, xml: 2, text: 4, script: 5 },

    /**
     * LL.post
     * POST????
     * @access public
     * @param string url
     * @return void	???
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
            ajax.send(value); //??
        } else {
            ajax.send(value); //??
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
     * GET????
     * @access public
     * @param string url
     * @return void	???
     */
    get: function (url, callbacks, varAsync, type) {
	
        if (typeof (varAsync) != 'boolean') {
            varAsync = true;
        }
        if (typeof (type) == 'undefined') {
            type = this.getType.text;
        }
		
        //var ajax = this.getAjax();
        //ajax.open("GET", url, varAsync);

		$.ajax({
		            url: url,
					type : "get",
		            dataType: 'json',
		            async: false,
					jsonpCallback:'callback',
					data: '',
                    contentType: "application/x-www-form-urlencoded; charset=utf-8", 
		            success: function (result) { 
		                callbacks(result);
		            },
		            error: function (request, error) {
		                alert("网络连接出错，请稍后重试！");
		            }
		        });
				
       /*  if (varAsync) {
		
            ajax.onreadystatechange = function () {
			alert(ajax.responseText);
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
								alert("afdsa1");
                            }
							alert("afdsa2");
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
            ajax.send(null); //??
        }
        else {
            ajax.send(null); //??
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
        } */
    }
 };
