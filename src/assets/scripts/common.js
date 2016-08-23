/**
 * Created by codoon on 16/8/3.
 */
import Vue from 'vue';
import VueResource from 'vue-resource';
import codoonBrige from './codoonBrige';

// 请求发送
Vue.use(VueResource);
Vue.http.options.credentials = true;
Vue.http.options.crossDomain = true;

// 配置接口
var URL = '//www.codoon.com/activity/v1/gouwanli_test';
var INTERFACE = {
    TEST : '/user/test1',
    TEST2: '/user/test2'
};

//调用客户端数据
var bridge = new codoonBrige();

// 分享
// 分享
function nativeShare(){
    var options = {
        shareImgUrl : "http://activity-codoon.b0.upaiyun.com/beetle/upload/share.jpg",
        shareLineLink : 'http://192.168.10.48:9000/share.html',
        shareDescContent :'内有iWatch和批量百元油卡，还不来拿！',
        shareCodoonLineLink : 'http://www.codoon.com/activity/v1/beetle/index.html',
        shareTitle : '跑出甲壳虫，一起玩出真我风格!'
    };
    bridge.nativeTopButtonShare({
        sCodoonShareImgUrl : options.shareImgUrl,
        sCodoonShareLineLink : options.shareLineLink,
        sCodoonShareDescContent : options.shareDescContent,
        sCodoonShareCodoonLineLink : options.shareCodoonLineLink,
        sCodoonShareTitle : options.shareTitle,
        oCodoonShareDestination : {
            'codoonTimeline' : true,
            'codoonGroup' : false,
            'weixinToFriend' : true,
            'weixinToTimeline' : true,
            'sinaWeibo' : true,
            'tencentQQ' : false,
            'tencentQzone' : false
        }
    });
}
nativeShare();

// 设置token值
function setToken(token){
  if(!token) return false;
  Vue.http.interceptors((request, next) => {
    request.headers.token = token;
    next();
  })
}

Vue.http.interceptors.push((request, next) => {
    next(response =>{

    });


    // next(response =>{
    //     // return new Promise((resolve, reject) =>{
    //     //     if(response.status == 200){
    //     //         resolve(response.data);
    //     //     }else {
    //     //         reject(response);
    //     //     }
    //     // })
    // });


});

//
function test(params) {
    return Vue.http.get(URL + INTERFACE.TEST , {params:params});
}

function test2(params) {
    return Vue.http.post(URL + INTERFACE.TEST2 , params)
}
// 导出
module.exports = {
    test: test,
    test2: test2
};
