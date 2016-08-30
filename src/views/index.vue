<template>
    <div>
        <div class="index">
            <a v-link="{name: 'details'}">详情</a>
            this is a vue-cli demo!!!
        </div>
        <input type="button" @click="uploadImg" value="上传图片">
    </div>
</template>

<style>
    .index{
        height: 100%;
        background: #42b983;

    }
    .index a{
        color: #f89406;
    }
</style>

<script type="text/ecmascript-6">
    import common from '../assets/scripts/common';
    import toast from '../components/toast/index'

    export default{
        data(){
            return {
                msg : 'hello vue',
                userInfo: {}
            }
        },
        init(){
            toast({
                message: '我是弹出窗口的文字~~~~~~~~~我是弹出的文字',
                position: 'bottom',
                duration: 2000
            });

            var params = {name: 'test', age: 18};

            var a = [9,8,7,6,5,4,3,2,1];
            var b = [9,6,3];

            function fn(a, b) {
                b.forEach(function (item) {
                    a.splice(fn2(a, item), 1);
                });
                function fn2(arr, item) {
                    var index = -1;
                    for(var i = 0; i < arr.length; i ++){
                        if(arr[i] == item){
                            index = i;
                            break
                        }
                    }
                    return index;
                }
                console.log(a)
            }

            common.userInfo().then(res =>{
                this.userInfo = res.data.data;
            });

        },
        methods: {
            uploadImg(){
                common.nativeUploadImg().then(function (res) {
                    window.alert('上传到又拍成功~');
                    return res;
                }, (err_res) =>{
                    window.alert('上传失败~')
                }).then((res)=>{
                    var params = {};
                    params.url = res.imgUrl[0];
                    params.createTime = new Date().toLocaleString();
                    params.eventId = '2003';
                    params.nick = '万里';
                    params.userId = '68445bda-9069-4312-bf71-f605872e8bb5';

                    common.uploadImg(params).then(res =>{
                        window.alert(JSON.stringify(res));
                    })
                })


//                var params = {};
//                params.url = 'http://img3.codoon.com/backend3f057acd027344fa917aa4173f85db1b8';
//                params.createTime = new Date().valueOf();
//                params.eventId = '2003';
//                params.nick = '万里';
//                params.eventName = '活动名称3'
//                params.userId = '68445bda-9069-4312-bf71-f605872e8bb5';
//
//                console.log(params)
//
//                common.uploadImg(params).then(res =>{
//                    window.alert(JSON.stringify(res));
//                })

            }
        },

        components : {

        }
    }
</script>
