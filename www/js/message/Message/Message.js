/**
 * Created by li on 2014/7/13.
 */
/**
 * LL.Message
 * 消息对像
 * @access public 　
 * @return void	无返回
 */
LL.Message = {
    deviceId: "",
    path: LL.path + "Message/",
    Address: "127.0.0.1",
    messageObject: null,
    /**
     * LL.Message.init
     * 初始化对像
     * @access public
     * @return void	无返回
     */
    init: function () {
        LL.Message.Address="112.124.122.107";//

        if (LL.System.webSocket && LL.System.system!=LL.System.Systems.Android) {

            LL.loadPlugin(
                [
                        this.path + "Message.stomp.js"
                ],
                [
                    function () {
                        if (typeof (MessageStomp) == 'function') {
                            LL.Message.messageObject = new MessageStomp(true);
                            LL.Message.messageObject.onmessage = function (topic, payload) {
                                if (typeof (LL.Message.onMessage) == 'function') {
                                    LL.Message.onMessage(payload);
                                }
                            }

                            LL.Message.messageObject.onconnect = function () {

                                LL.Message.messageObject.subscribe(LL.Message.deviceId, 0);
                            }
                            LL.Message.messageObject.ondisconnect = function () {
                                LL.Message.messageObject.reconnect();
                            }
                            LL.Message.messageObject.connect(LL.Message.Address, LL.Message.deviceId, "", "");
                            /**
                             * 加载完成事件
                             */
                            if(typeof(onMessageLoadedEvent)=='function'){
                                onMessageLoadedEvent();
                            }
                            if(typeof(LL.onMessageLoadedEvent)=='function'){
                                LL.onMessageLoadedEvent();
                            }
                        }
                    }
                ]);
        }
        else{
            LL.loadPlugin(
                [
                        this.path + "Message.rest.js"
                ],
                [
                    function () {
                        if (typeof (MessageRest) == 'function') {
                            LL.Message.messageObject = new MessageRest(true);
                            LL.Message.messageObject.onmessage = function (topic, payload) {
                                if (typeof (LL.Message.onMessage) == 'function') {
                                    LL.Message.onMessage(payload);
                                }
                            }
                            LL.Message.messageObject.onconnect = function () {
                                LL.Message.messageObject.subscribe(LL.Message.deviceId, 0);
                            }
                            LL.Message.messageObject.ondisconnect = function () {
                                LL.Message.messageObject.reconnect();
                            }
                            LL.Message.messageObject.connect(LL.Message.Address, LL.Message.deviceId, "", "");
                            /**
                             * 加载完成事件
                             */
                            // if(typeof(onMessageLoadedEvent)=='function'){
                            //     onMessageLoadedEvent();
                            // }
                            // if(typeof(LL.onMessageLoadedEvent)=='function'){
                            //     LL.onMessageLoadedEvent();
                            // }
                        }
                    }
                ]);
        }
    },
    /**
     * LL.Message.send
     * 发送消息
     * @param topic 接收方
     * @param value　内容
     */
    send: function (topic,value) {
        LL.Message.messageObject.publish(topic, value);
    },
    /**
     * LL.Message.onMessage
     * 收到消息事件
     * @access public
     * @return void	无返回
     */
    onMessage: function (message) {
        //var div = document.createElement('div');
        //div.innerHTML = message;
        //document.getElementById("showtext").appendChild(div);
    }

};