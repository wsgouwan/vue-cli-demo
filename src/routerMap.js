import index from './views/index.vue';
import  loading from './views/loading.vue'

export  default (router) => {
  router.map({
    '/': {
      name: 'loading',
      component: loading
    },
    '/index': {
      name: 'index',
      component: index
    }
  })
}
