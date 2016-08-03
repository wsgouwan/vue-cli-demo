import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import routerMap from './routerMap';

Vue.use(VueRouter);
var router = new VueRouter();
routerMap(router);
router.start(App, 'app');


