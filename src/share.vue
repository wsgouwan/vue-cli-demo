<template>
    <div>
        {{msg}}
    </div>
</template>
<style>
    @import "./assets/style/reset.css";
</style>
<script type="text/ecmascript-6">
    import wxShare from './assets/scripts/wxShare';

    export default{
        data(){
            return{
                msg:'hello share-page!!!'
            }
        },
        ready(){

            wxShare.config({
                title: '微信测试',
                desc: '这是一个微信测试',
                link: 'http://192.168.10.48:9000/share.html',
                imgUrl: 'http://activity-codoon.b0.upaiyun.com/beetle/upload/share.jpg'
            })

        }
    }
</script>
