/**
 * Created by li on 2014/7/13.
 */
function MessageStomp(_debug) {
    this.counter = 0;
    this.connected = false;
    this.heartbeat = {
        outgoing: 10000,
        incoming: 10000
    };
    this.maxWebSocketFrameSize = 16 * 1024;
    this.subscriptions = {};
    var __hasProp = {}.hasOwnProperty;
    var __slice = [].slice;
    var Byte = {
        LF: '\x0A',
        NULL: '\x00'
    };
    var Frame = (function() {
        var unmarshallSingle;

        function Frame(command, headers, body) {
            this.command = command;
            this.headers = headers != null ? headers : {};
            this.body = body != null ? body : '';
        }

        Frame.prototype.toString = function() {
            var lines, name, skipContentLength, value, _ref;
            lines = [this.command];
            skipContentLength = this.headers['content-length'] === false ? true : false;
            if (skipContentLength) {
                delete this.headers['content-length'];
            }
            _ref = this.headers;
            for (name in _ref) {
                if (!__hasProp.call(_ref, name)) continue;
                value = _ref[name];
                lines.push("" + name + ":" + value);
            }
            if (this.body && !skipContentLength) {
                lines.push("content-length:" + (Frame.sizeOfUTF8(this.body)));
            }
            lines.push(Byte.LF + this.body);
            return lines.join(Byte.LF);
        };

        Frame.sizeOfUTF8 = function(s) {
            if (s) {
                return encodeURI(s).match(/%..|./g).length;
            } else {
                return 0;
            }
        };

        unmarshallSingle = function(data) {
            var body, chr, command, divider, headerLines, headers, i, idx, len, line, start, trim, _i, _j, _len, _ref, _ref1;
            divider = data.search(RegExp("" + Byte.LF + Byte.LF));
            headerLines = data.substring(0, divider).split(Byte.LF);
            command = headerLines.shift();
            headers = {};
            trim = function(str) {
                return str.replace(/^\s+|\s+$/g, '');
            };
            _ref = headerLines.reverse();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                line = _ref[_i];
                idx = line.indexOf(':');
                headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
            }
            body = '';
            start = divider + 2;
            if (headers['content-length']) {
                len = parseInt(headers['content-length']);
                body = ('' + data).substring(start, start + len);
            } else {
                chr = null;
                for (i = _j = start, _ref1 = data.length; start <= _ref1 ? _j < _ref1 : _j > _ref1; i = start <= _ref1 ? ++_j : --_j) {
                    chr = data.charAt(i);
                    if (chr === Byte.NULL) {
                        break;
                    }
                    body += chr;
                }
            }
            return new Frame(command, headers, body);
        };

        Frame.unmarshall = function(datas) {
            var data;
            return (function() {
                var _i, _len, _ref, _results;
                _ref = datas.split(RegExp("" + Byte.NULL + Byte.LF + "*"));
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    data = _ref[_i];
                    if ((data != null ? data.length : void 0) > 0) {
                        _results.push(unmarshallSingle(data));
                    }
                }
                return _results;
            })();
        };

        Frame.marshall = function(command, headers, body) {
            var frame;
            frame = new Frame(command, headers, body);
            return frame.toString() + Byte.NULL + Byte.NULL;
        };

        return Frame;

    })();
    this.ws =null;
    this._debug=_debug;
    this.debug = function(message) {
        var _ref;
        if(typeof(this._debug)=='undefined' || !this.debug){return;}
        return typeof window !== "undefined" && window !== null ? (_ref = window.console) != null ? _ref.log(message) : void 0 : void 0;
    };
    this.reconnect=function(){
        this.debug("reconnect Web Socket..."+this.ws.url);
        this.disconnect();
        this.connect(this.url,this.clientID,this.login,this.passcode);
    };
    this.connect = function (url, clientID, login, passcode) {
        var headers = {
            'login': login,
            'passcode': passcode,
            'client-id': clientID
        };
        var protocols = ['v10.stomp', 'v11.stomp'];
        this.url = url;
        this.login = login;
        this.clientID = clientID;
        this.passcode = passcode;
        this.ws = new WebSocket("ws://"+this.url+":61614", protocols);
        this.ws.binaryType = "arraybuffer";
        this.ws.onmessage = (function (_this) {
            return function (evt) {
                var arr, c, client, data, frame, messageID, onreceive, subscription, _i, _len, _ref;

                data = evt.data.toString();
                if (data === Byte.LF) {
                    return _this.debug("<<< PONG");
                }
                _this.debug("<<< " + data);
                _ref = Frame.unmarshall(data);
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    frame = _ref[_i];
                    switch (frame.command) {
                        case "CONNECTED":
                            _this.debug("connected to server " + frame.headers.server);
                            _this.connected = true;
                            if (_this.onconnect) {
                                _this.onconnect();
                            }
                            break;
                        case "MESSAGE":
                            subscription = frame.headers.subscription;
                            if (_this.onmessage) {
                                client = _this;
                                messageID = frame.headers["message-id"];
                                frame.ack = function (headers) {
                                    if (headers == null) {
                                        headers = {};
                                    }
                                    return client.ack(messageID, subscription, headers);
                                };
                                frame.nack = function (headers) {
                                    if (headers == null) {
                                        headers = {};
                                    }
                                    return client.nack(messageID, subscription, headers);
                                };
                                _this.onmessage(subscription, frame.body);
                            }
                            break;
                        case "RECEIPT":
                            _results.push(typeof _this.onreceipt === "function" ? _this.onreceipt(frame) : void 0);
                            break;
                        case "ERROR":
                            if (_this.onerror) {
                                _this.onerror(frame);
                            }
                            break;
                        default:
                            _this.debug("Unhandled frame: " + frame)
                    }
                }
            }
        })(this);
        this.ws.onclose = (function (_this) {
            return function () {
                var msg;
                msg = "Whoops! Lost connection to " + _this.ws.url;
                _this.debug(msg);
                _this._cleanUp();
                return typeof _this.ondisconnect === "function" ? _this.ondisconnect() : void 0;
            };
        })(this);
        return this.ws.onopen = (function (_this) {
            return function () {
                _this.debug('Web Socket Opened...');
                headers["accept-version"] = '1.1,1.0';
                headers["heart-beat"] = [_this.heartbeat.outgoing, _this.heartbeat.incoming].join(',');
                return _this._transmit("CONNECT", headers);
            };
        })(this);
    };


    this.ack = function(messageID, subscription, headers) {
        if (headers == null) {
            headers = {};
        }
        headers["message-id"] = messageID;
        headers.subscription = subscription;
        return this._transmit("ACK", headers);
    };
    this.nack = function(messageID, subscription, headers) {
        if (headers == null) {
            headers = {};
        }
        headers["message-id"] = messageID;
        headers.subscription = subscription;
        return this._transmit("NACK", headers);
    };
    this._transmit = function(command, headers, body) {
        var out;
        out = Frame.marshall(command, headers, body);
        this.debug(">>> " + out);
        while (true) {
            if (out.length > this.maxWebSocketFrameSize) {
                this.ws.send(out.substring(0, this.maxWebSocketFrameSize));
                out = out.substring(this.maxWebSocketFrameSize);
                this.debug("remaining = " + out.length);
            } else {
                return this.ws.send(out);
            }
        }
    };
    this.disconnect = function(headers) {
        if (headers == null) {
            headers = {};
        }
        this._transmit("DISCONNECT", headers);
        this.ws.onclose = null;
        this.ws.close();
        this._cleanUp();
    };
    this._cleanUp = function() {
        this.connected = false;

    };
    this.publish = function(topic, payload,toclientId) {
        var headers = {};
        if (typeof(payload)=='undefined' || payload == null) {
            payload = '';
        }
        if(typeof(toclientId)!='undefined' && toclientId!=null){
            headers.to_clientId=toclientId;
        }
        headers.destination = "/topic/"+topic;
        return this._transmit("SEND", headers, payload);
    };
    this.subscribes=new Array();
    this.subscribe = function(destination, qos) {
        var client;
        var headers = {};
        headers.id = "sub-" + this.counter++;
        headers.destination = "/topic/"+destination;
        this._transmit("SUBSCRIBE", headers);
        client = this;
        this.subscribes.push({
            topic:destination,
            id: headers.id,
            unsubscribe: function() {
                return client.unsubscribe(headers.id);
            }
        });
    };

    this.unsubscribe = function(topic) {
        for(var i=0;i<this.subscribes.length;i++){
            if(this.subscribes[i].topic==topic){
                var id=this.subscribes[i].id;
                return this._transmit("UNSUBSCRIBE", {
                    id: id
                });
            }
        }
    };
    this.begin = function(transaction) {
        var client, txid;
        txid = transaction || "tx-" + this.counter++;
        this._transmit("BEGIN", {
            transaction: txid
        });
        client = this;
        return {
            id: txid,
            commit: function() {
                return client.commit(txid);
            },
            abort: function() {
                return client.abort(txid);
            }
        };
    };

    this.commit = function(transaction) {
        return this._transmit("COMMIT", {
            transaction: transaction
        });
    };

    this.abort = function(transaction) {
        return this._transmit("ABORT", {
            transaction: transaction
        });
    };

};