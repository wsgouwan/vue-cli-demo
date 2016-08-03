import index from './views/index.vue';

export  default (router) => {
  router.map({
    '/': {
      name: 'index',
      component: index
    }
  })
}
