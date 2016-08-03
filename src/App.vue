<template>
  <div id="app">
    <router-view class="router"></router-view>
  </div>
</template>

<script>
  import index from './views/index.vue';

  export default {
    components : {
      index
    }
  }
</script>

<style>
  @import "./assets/style/reset.css";
  @import "./assets/style/main.scss";
  html{
    height:100%;
  }
  body{
    display:flex;
    align-items:center;
    justify-content:center;
    height:100%;
  }
  #app{
    color:#2c3e50;
    margin-top:-100px;
    max-width:600px;
    font-family:Source Sans Pro, Helvetica, sans-serif;
    text-align:center;
  }
  #app a{
    color:#42b983;
    text-decoration:none;
  }
</style>
