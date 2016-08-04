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
                msg: 'hello vue',
                progress: 0
            }
        },
        init() {
            let imagesList = list.list;
            let len = imagesList.length;
            let images = [];
            let count = 0;
            this.progress = parseInt(count/len);

            if (imagesList.length > 0) {
                imagesList.forEach((item) => {
                    let imgUrl = require('../assets/images/' + item);
                    let img = document.createElement('img');
                    img.src = imgUrl;
                    images.push(img);
                })
            }
            var timer = setInterval( ()=>{
                images.forEach(function(img, index){
                    if(img.complete){
                        count = count + 1;
                        images.splice(index, 1)
                    }
                });
                this.progress = parseInt(count * 100 / len);
                console.log(this.progress);
                if(this.progress == 100){
                    window.clearInterval(timer);
                }
            }, 33)


        },
        components: {}
    }
</script>
