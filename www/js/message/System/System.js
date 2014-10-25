/**
 * Created by li on 2014/7/13.
 */
/**
 * LL.System
 * 核心对像
 * @access public 　
 * @return void	无返回
 */
LL.System = {
    system: undefined,
    webSocket: false,
    flash: { status: false, version: undefined },
    iPad: false,
    iPhone: false,
    /**
     * Systems
     * 初始化对像
     * @access public
     * @param string Windows
     * @param string Android
     */
    Systems: {
        Windows: "Windows",
        Android: "Android",
        MacOSX: "Mac OS X",
        Other: "Other"
    },
    /**
     * LL.System.init
     * 初始化对像
     * @access public
     * @return void	无返回
     */
    init: function () {
        this.initSystem();
        this.initWebSocket();
        this.initFlash();
    },
    /**
     * LL.System.initSystem
     * 判断操作系统
     * @access public
     * @return void	无返回
     */
    initSystem: function () {
        var ua = navigator.userAgent.split(";");
        if (/^.+Windows.+$/gi.test(navigator.userAgent)) {
            this.system = this.Systems.Windows;
        }
        else if (/^.+Android.+$/gi.test(navigator.userAgent)) {
            this.system = this.Systems.Android;
        }
        else if (/^.+Mac OS X.+$/gi.test(navigator.userAgent)) {
            this.system = this.Systems.MacOSX;
            if (/^.+iPad.+$/gi.test(navigator.userAgent)) {
                this.iPad = true;
            }
            else if (/^.+iPhone.+$/gi.test(navigator.userAgent)) {
                this.iPhone = true;
            }
        }
        else {
            this.system = this.Systems.Other;
        }
    },
    /**
     * LL.System.initWebSocket
     * 判断浏览器是否支持　WebSocket
     * @access public
     * @return void	无返回
     */
    initWebSocket: function () {
        this.webSocket = typeof (WebSocket) != 'undefined';
    },
    /**
     * LL.System.initFlash
     * 判断浏览器是否支持　Flash
     * @access public
     * @return void	无返回
     */
    initFlash: function () {
        var hasFlash = false;           //是否安装了flash
        var flashVersion = 0;           //flash版本
        var isIE = /*@cc_on!@*/0;       //是否IE浏览器
        if (isIE) {
			try{
				var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (swf) {
					hasFlash = true;
					VSwf = swf.GetVariable("$version");
					flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
				}
			}
			catch(e){}
        } else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    hasFlash = true;
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
        this.flash.status = hasFlash;
        this.flash.version = flashVersion;
    }
};
