import index from './views/index.vue';
import loading from './views/loading.vue'
import details from './views/details.vue';

export  default (router) => {
    router.map({
        '/': {
            name: 'loading',
            component: loading
        },
        '/index': {
            name: 'index',
            component: index
        },
        '/details': {
            name: 'details',
            component: details
        }
    })
}
