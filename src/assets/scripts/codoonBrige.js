(function (global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global, true);
    } else {
        factory(global);
    }
})(typeof window !== 'undefined' ? window : this,
    function (window, noGlabal) {

        // bug fixed
        // 避免客户端在没有分享调用的页面执行这个函数
        window.codoon_share_status_callback = function () {
            console.log("not used");
        };

        var type = function (o) {
            var s = Object.prototype.toString.call(o);
            return s.match(/\[object (.*?)\]/)[1].toLowerCase();
        }

        var _codoonNative = function () {
            var self = this;
            self.iOS = null;
            self.android = null;

            // 定义标示只运行一次的函数
            self.isSetDefaultShare = false;
            self.isLoad = false;

            // 提前运行的函数数组，在加载完成后会依次运行
            self.functionArray = [];

            // 判断是否是android或者iOS
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsAndroid = /android/.test(sUserAgent);
            var bIsIphoneOs = /(ios)|(iphone os)/.test(sUserAgent);

            // jsObj是android客服端定义的注入对象
            if (bIsAndroid && window.jsObj) {
                self.android = window.jsObj;
                self.isLoad = true;
            } else if (bIsIphoneOs) {
                initiOSBridge();
            }

            function initiOSBridge () {
                if (window.WebViewJavascriptBridge) {
                    _init(WebViewJavascriptBridge);
                } else {
                    document.addEventListener('WebViewJavascriptBridgeReady', function () {
                        _init(WebViewJavascriptBridge);
                    }, false);
                }

                function _init (WebViewJavascriptBridge) {
                    self.isLoad = true;
                    self.iOS = WebViewJavascriptBridge;
                    // 这段代码事为了让编辑器识别callHandler和registerHandler定义了的
                    if (!self.iOS.callHandler && !self.iOS.registerHandler) {
                        self.iOS.callHandler = function () {};
                        self.iOS.registerHandler = function () {};
                    }

                    // 这里的初始化不能少，运行这个函数后，页面才能收到iOS的回调
                    if(!window._isCBJInited) {
                        self.iOS.init(function (message, responseCallback) {});
                        window._isCBJInited = true;
                    }

                    // 运行提前调用的函数
                    if (self.functionArray.length > 0) {
                        self.functionArray.forEach(function (item, index) {
                            setTimeout(item, index * 20);
                        });
                    }
                }
            }

            /**
             * 只调用不返回的函数模版，返回为
             * @param name
             * @returns {*}
             */
            self.singleFunction = function (funcName, options) {
                function _run () {
                    if (self.android) {
                        if (self.android[funcName]) {
                            if (options) {
                                if (type(options) === 'object') {
                                    self.android[funcName](JSON.stringify(options));
                                } else {
                                    self.android[funcName](options);
                                }
                            } else {
                                self.android[funcName]();
                            }
                        } else {
                            return 'android not have ' + funcName;
                        }
                    } else if (self.iOS) {
                        if (options) {
                            self.iOS.callHandler(funcName, options, function (response) {});
                        } else {
                            self.iOS.callHandler(funcName, function (response) {});
                        }
                    } else {
                        return 'not in codoon app';
                    }
                }
                if (self.isLoad) {
                    return _run();
                } else {
                    self.functionArray.push(_run);
                }
                return null;
            };

            /**
             * 函数返回的函数模版
             * @param funcName {string}     函数的名字
             * @param callback {function}   回调函数， 返回的第一个参数是错误信息，第二个是返回的服务端返回的对象
             */
            self.callbackFunction = function (funcName, callback) {
                function _run () {
                    if (self.android) {
                        window[funcName] = function (response) {
                            response = parseJson(response);
                            var err = null;
                            if (response.status) {
                                err = response.status;
                            }
                            callback(err, response);
                        };
                    }
                    if (self.iOS) {
                        self.iOS.registerHandler(funcName, function (response) {
                            response = parseJson(response);
                            var err = null;
                            if (response.status) {
                                err = response.status;
                            }
                            callback(err, response);
                        });
                    }
                }

                function parseJson (data) {
                    if (typeof data !== 'object') {
                        try {
                            data = JSON.parse(data);
                        } catch (e) {
                            data = {status: 'parse ' + funcName + ' error ' + e};
                        }
                    }
                    return data;
                }

                if (self.isLoad) {
                    _run();
                } else {
                    self.functionArray.push(_run);
                }
            };
        };

        /**
         * 得到DescContent
         * @param oCodoonShareDestination
         * @returns {{codoonTimeline: boolean, codoonGroup: boolean, weixinToFriend: boolean, weixinToTimeline: boolean, sinaWeibo: boolean, tencentQQ: boolean, tencentQzone: boolean}}
         */
        function getShareDescContent (oCodoonShareDestination) {
            var temp = {
                'codoonTimeline': true,
                'codoonGroup': true,
                'weixinToFriend': false,
                'weixinToTimeline': false,
                'sinaWeibo': false,
                'tencentQQ': false,
                'tencentQzone': false
            };
            if (!oCodoonShareDestination) {
                temp.weixinToFriend = true;
                temp.weixinToTimeline = true;
                return temp;
            }
            for (var key in temp) {
                temp[key] = oCodoonShareDestination[key] ? true : false;
            }
            return temp;
        }

        /**
         * iOS旧版分享
         * @param self
         * @param options
         */
        function iOSOldShare(self, options, isTop) {
            self.iOS.callHandler('codoon_share', [
                isTop ? 1: 0,
                options.sCodoonShareTitle || '',
                options.sCodoonShareLineLink || '',
                options.sCodoonShareImgUrl || '',
                options.sCodoonShareDescContent || ''
            ], function (response) {});
            // 分享回调函数，暂时没有用到
            self.iOS.registerHandler('codoon_share_status_callback', function (response) {});
        }

        /**
         * iOS新版分享
         * @param self
         * @param options
         * @param isTop
         */
        function iOSNewShare(self, options, isTop) {
            self.iOS.callHandler('codoon_share_handle', {
                nCodoonShareTitleButton: isTop,
                nCodoonShareImmediately: !isTop,
                sCodoonShareTitle: options.sCodoonShareTitle || '',
                sCodoonShareLineLink: options.sCodoonShareLineLink || '',
                sCodoonShareImgUrl: options.sCodoonShareImgUrl || '',
                sCodoonShareDescContent: options.sCodoonShareDescContent || '',
                oCodoonShareDestination: getShareDescContent(options.oCodoonShareDestination),
                sCodoonShareCodoonLineLink: options.sCodoonShareCodoonLineLink,
                sCodoonShareSource: options.sCodoonShareSource || ''
            }, function (response) {});
            self.iOS.registerHandler('codoon_share_status_callback', function (response) {});
        }

        /**
         * 自定义分享函数
         * @name nativeCustomerShare
         * @function
         * @param {object} options
         */

        _codoonNative.prototype.nativeCustomerShare = function(options) {
            /**
             * @name options
             * @key sCodoonShareTitle 设置分享的title
             * @key nCodoonShareImmediately 是否立即分享(IOS)
             * @key sCodoonShareLineLink 设置分享的链接
             * @key sCodoonShareImgUrl 设置分享出去的封面图片的src
             * @key sCodoonShareDescContent 设置分享的内容文本
             * @key oCodoonShareDestination 设置分享出去的途径
             * @key sCodoonShareCodoonLineLink 设置分享到咕咚运动全和咕咚群组的地址
             * @key sCodoonShareSource 设置分享出去的来源 || 'xmall : 电商' 后续有的补充
             * ---- oCodoonShareDestination(JSON) 格式 开始----
             * true: 选中
             * false: 不选中
             *  {
		      codoonTimeline: true			 // 咕咚运动圈
		      codoonGroup: true		       // 咕咚群组
		      weixinToFriend: true,		   // 微信朋友
		      weixinToTimeline: true,		 // 微信朋友圈
		      sinaWeibo: true,				   // 新浪微博
		      tencentQQ: true,				   // 腾讯QQ
		      tencentQzone: true			   // 腾讯空间
		  *  }
             * 默认只开启微信朋友、微信朋友圈
             * ---- sCodoonShareDestination(JSON) 格式 结束----
             * IOS新增一个字段，以及更换一个字段
             * @key nCodoonShareTitleButton:  // 是否显示顶部
             * @key nCodoonShareImmediately:  // 分享栏滑动上来
             */
            var self = this;
            function _run () {
                if (self.android) {
                    if (self.android.getInfo) {
                        if ((self.requestAPPVersion() && self.requestAPPVersion().length === 5 && self.requestAPPVersion() < '6.3.0') || !self.requestAPPVersion()) {
                            self.android.getInfo(
                                options.sCodoonShareTitle || '',
                                options.sCodoonShareLineLink || '',
                                options.sCodoonShareImgUrl || '',
                                options.sCodoonShareDescContent || ''
                            );
                        } else {
                            self.android.getInfo(
                                options.sCodoonShareTitle || '',
                                options.sCodoonShareLineLink || '',
                                options.sCodoonShareImgUrl || '',
                                options.sCodoonShareDescContent || '',
                                JSON.stringify(getShareDescContent(options.oCodoonShareDestination)),
                                options.sCodoonShareCodoonLineLink ? 'codoon://www.codoon.com/codoon/web_view?url=' + encodeURIComponent(options.sCodoonShareCodoonLineLink) : '',
                                options.sCodoonShareSource || ''
                            );
                        }
                    }
                    // 分享回调函数，暂时没有用到
                    window.codoon_share_status_callback = function () {
                        console.log("not used");
                    };
                }
                if (self.iOS) {
                    if ((self.requestAPPVersion() && self.requestAPPVersion().length === 5 && self.requestAPPVersion() < '6.3.0') || !self.requestAPPVersion()) {
                        iOSOldShare(self, options, false);
                    } else {
                        // 对URL进行encode并且拼接协议
                        if (options.sCodoonShareCodoonLineLink) {
                            options.sCodoonShareCodoonLineLink = 'codoon://www.codoon.com/codoon/web_view?url=' + encodeURIComponent(options.sCodoonShareCodoonLineLink);
                        }
                        iOSNewShare(self, options, false);
                    }
                }
            }
            if (self.isLoad) {
                _run();
            } else {
                self.functionArray.push(_run);
            }
            return null;
        };


        /**
         * 开启右上角的分享，历史遗留问题，这个函数做了特殊处理
         * @name nativeTopBut 提供一个开启右上角分享的功能,并配置分享的内容，一旦开启便不能在当前webview关闭此按钮
         * @function
         * @param {object} options
         */
        _codoonNative.prototype.nativeTopButtonShare = function (options) {
            /**
             * @name options
             * @key sCodoonShareTitle 设置分享的title
             * @key sCodoonShareLineLink 设置分享的链接
             * @key sCodoonShareImgUrl 设置分享出去的封面图片的src
             * @key sCodoonShareDescContent 设置分享的内容文本
             */
            var self = this;
            function _run () {
                if (self.android) {
                    if (self.android.set_codoon_share) {
                        self.android.set_codoon_share(1, options.sCodoonShareImgUrl);
                    }
                    window.CodoonGetInfo = function () {
                        self.nativeCustomerShare(options);
                    };
                }
                if (self.iOS) {
                    if ((self.requestAPPVersion() && self.requestAPPVersion().length === 5 && self.requestAPPVersion() < '6.3.0') || !self.requestAPPVersion()) {
                        iOSOldShare(self, options, true);
                    } else {
                        // 对URL进行encode并且拼接协议
                        if (options.sCodoonShareCodoonLineLink) {
                            options.sCodoonShareCodoonLineLink = 'codoon://www.codoon.com/codoon/web_view?url=' + encodeURIComponent(options.sCodoonShareCodoonLineLink);
                        }
                        iOSNewShare(self, options, true);
                    }
                }
            }
            if (self.isLoad) {
                _run();
            } else {
                self.functionArray.push(_run);
            }
            return null;
        };

        // 弹出原生上传图片组件,当用户上传文件后回调函数执行并返回
        _codoonNative.prototype.nativeUploadImg = function (callback) {
            this.callbackFunction('nativeUploadImgCallback', callback);
            return this.singleFunction('nativeUploadImg');
        };

        /**
         * 下载多张图片
         * @param images {object}  里面有一个urls字段，包含图片地址的数组 urls:［"http://www.baidu.com/maiyao.jpg", "....xxx/xx.jpg"］
         * @param callback
         * @returns {*}
         */
        _codoonNative.prototype.nativeDownloadImg = function (images, callback) {
            this.callbackFunction('native_download_image_callback', callback);
            return this.singleFunction('native_download_image', images);
        };

        /**
         * 弹出原生相册来显示图片
         * @param imgs {array}  包含图片地址的数组 ["http://www....com/xx.png", "http://www....com/xx.jpg"]
         */
        _codoonNative.prototype.nativeShowImgs = function (imgs) {
            return this.singleFunction('nativeShowImgs', imgs);
        };

        /**
         * 设置上面的导航栏的标题和背景颜色
         * @param options
         * @returns {*}
         */
        _codoonNative.prototype.nativeSetTitleBar = function (options) {
            return this.singleFunction('set_title_bar_background', options);
        };

        /**
         * 获取客服端识别到到GPS
         * @param options
         */
        _codoonNative.prototype.nativeGetGps = function (callback) {
            this.callbackFunction('returnAmapGpsFormNative', callback);
            return this.singleFunction('getAmapGpsFormNative');
        };

        /**
         * 设置页面标题
         * @param options
         * @returns {*}
         */
        _codoonNative.prototype.nativeSetPageTitle = function (options) {
            return this.singleFunction('get_page_title', options);
        };

        /**
         * 获取用户的token 回调函数里的err是一个对象,具体是不是错了自己判断,因为客户端每个接口的数据格式不同(囧)
         * @param callback {function} 返回的参数 function(err, { access_token: "xsdfasfd..." })
         * @returns {*}
         */
        _codoonNative.prototype.nativeGetUserToken = function (callback) {
            this.callbackFunction('CJB_get_extra_info_callback', callback);
            return this.singleFunction('CJB_get_extra_info');
        };

        /**
         * 刷新用户的token 回调函数里的err是一个对象,具体是不是错了自己判断,因为客户端每个接口的数据格式不同(囧)
         * @param callback {function} 返回的参数 function(err, { access_token: "xsdfasfd..." })
         * @returns {*}
         */
        _codoonNative.prototype.nativeRefreshUserToken = function (callback) {
            this.callbackFunction('CJB_get_token_refresh_callback', callback);
            return this.singleFunction('CJB_get_token_refresh');
        };

        /**
         * 响应客户端从native回到h5的动作
         * @param callback
         * @returns {*}
         */
        _codoonNative.prototype.nativeSwitchNotice = function(callback) {
            this.callbackFunction('native_switch_notice_callback', callback);
            return this.singleFunction('open_native_switch_notice', 1);
        }

        /**
         * 用户绑定
         * @param options
         * @param callback
         * @returns {*}
         */
        _codoonNative.prototype.nativeUserBind = function(options, callback) {
            this.callbackFunction('native_user_bind_callback', callback);
            return this.singleFunction('native_user_bind', options);
        }

        var jumpNativeLimit = false;
        /**
         * 跳转到Native协议封装
         * @param options
         */
        _codoonNative.prototype.jumpNative = function(options, callback) {
            // 处理下短时间多次调用的问题
            if (jumpNativeLimit) {
                return;
            }
            jumpNativeLimit = true;
            setTimeout(function() {
                jumpNativeLimit = false;
            }, 1000);
            // 进行一些特殊处理
            if (!this.isInCodoon()) {
                if (options.type === 'webView') {
                    if (callback) {
                        function change() {
                            if (!document.hidden) {
                                callback();
                                document.removeEventListener("visibilitychange", change);
                            }
                        }
                        document.addEventListener("visibilitychange", change);
                    }
                    return window.open(options.value);
                }
            }

            var jumpObject = {
                webView: 'codoon://www.codoon.com/codoon/web_view?url='
            };
            if (type(jumpObject[options.type]) === 'string') {
                // window.open不行
                // window.open(jumpObject[options.type] + window.encodeURIComponent(options.value));
                // 改成了iframe
                var iframe = document.createElement('iframe');
                iframe.style.display = "none";
                iframe.src = jumpObject[options.type] + window.encodeURIComponent(options.value)
                document.body.appendChild(iframe);
            }

            if (callback) {
                this.nativeSwitchNotice(callback);
            }
        }

        /**
         * 从userAgent获取到系统版本,如果不在codoon里面，返回空字符串
         * @returns {*}
         */
        _codoonNative.prototype.requestAPPVersion = function(){
            var userAgent = window.navigator.userAgent;
            if (this.isInCodoon()) {
                var version = userAgent.split(" ")[0].split("(")[1];
                return version;
            }
            return "";
        }

        /**
         * 判定是否在codoon里面
         * @return {boolean}
         */
        _codoonNative.prototype.isInCodoon = function() {
            var sUserAgent = window.navigator.userAgent;
            var isInCodoon = /CodoonSport/.test(sUserAgent);
            return isInCodoon;
        }

        // 导出对象
        var newCodoonNative = null;
        var codoonNativeBridge = function (options) {
            if (!newCodoonNative || (options && options.needNew)) {
                newCodoonNative = new _codoonNative(options);
            }
            return newCodoonNative;
        };

        if (!noGlabal) {
            window.codoonNativeBridge = codoonNativeBridge;
        }
        return codoonNativeBridge;
    });
