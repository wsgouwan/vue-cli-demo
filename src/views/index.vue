<template>
    <div class="index">
        <a v-link="{name: 'details'}">详情</a>
        this is a vue-cli demo!!!
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

    import toast from '../components/toast/index'

    export default{
        data(){
            return {
                msg : 'hello vue'
            }
        },
        init(){
            toast({
                message: '我是弹出窗口的文字~~~~~~~~~我是弹出的文字',
                position: 'bottom',
                duration: 2000
            });
        },

        components : {

        }
    }
</script>
