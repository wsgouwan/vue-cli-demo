<template>
    <div>
        loading!!!
    </div>
</template>
<style>
    body {
        /*background-color:#ff0000;*/
    }
</style>
<script type="text/ecmascript-6">
    import list from '../assets/scripts/loadimg';

    export default{
        data(){
            return {
                msg: 'hello vue'
            }
        },
        init() {
            console.log(list.list);
            let images = list.list;
            if (images.length > 0) {
                images.forEach((item) => {
                    var img = require('../assets/images/' + item);
                    console.log(img)
                })
            }


        },
        components: {}
    }
</script>
