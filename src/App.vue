<template>
    <div id="app">
        <router-view class="router" :transition="transitionName" transition-mode="out-in"></router-view>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                hashStack: [],
                transitionName: 'go'
            }
        },
        ready(){
            this.$route.router.beforeEach((transition)=>{
                var currentHash = window.location.hash.substr(2);
                if(currentHash != this.hashStack[this.hashStack.length -2]){
                    this.hashStack.push(currentHash);
                    this.transitionName = 'go';
                }else{
                    this.hashStack.pop();
                    this.transitionName = 'back';
                }
                setTimeout(function () {
                    transition.next()
                }, 0)
            });
        },
        methods: {
            changeHashStack(obj){
                this.hashStack = obj.hashStack;
                this.transitionName = obj.transitionName
            }
        },
        components: {}
    }
</script>
<style lang="scss">
    @import "./assets/style/reset.css";
    @import "./assets/style/main.scss";

    html {
        height: 100%;
    }

    body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    #app {
        color: #2c3e50;
        font-family: Source Sans Pro, Helvetica, sans-serif;
        text-align: center;
        width: 100%;
        height: 100%;
    }

    #app a {
        color: #f89406;
        text-decoration: none;
    }

    .go-transition,
    .back-transition{
        transition: all 0.2s ease;
    }

    .go-enter,
    .back-leave{
        opacity: 1;
        transform: translate3d(100%, 0, 0);
    }
    .go-leave,
    .back-enter{
        transform: translate3d(-100%, 0, 0);
    }
</style>
