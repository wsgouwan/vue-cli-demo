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
    import common from '../assets/scripts/common';
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

//            fn(a, b);
//            console.log(a, b);




            common.test(params).then(res =>{
                console.log(res)
            });

//            common.test2(params).then(res =>{
//                console.log(res)
//            })

        },

        components : {

        }
    }
</script>
