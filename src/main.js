import Vue from 'vue'
import App from './App.vue'
// Vuesax Component Framework
import Vuesax from 'vuesax'
// Theme Configurations
import '../themeConfig.js'
// Globally Registered Components
import './globalComponents.js'
// Vue Router
import router from './router/index.js'
// Vuex Store
import store from './store/store'
// Vuesax Admin Filters
import './filters/filters'

import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';
import '@/assets/css/iconfont.css'
import '@/assets/css/main.scss'
import apiUrl from '../config'
// Vuejs - Vue wrapper for hammerjs
import {VueHammer} from 'vue2-hammer'
import themeConfig from "../themeConfig";
// Infinite scroll
import infiniteScroll from 'vue-infinite-scroll'
import axios from './axios';

Vue.prototype.$axios = axios;

Vue.use(Vuesax)

Vue.use(VueHammer)

Vue.use(infiniteScroll)


Vue.config.productionTip = false

Vue.prototype.$themeConfig = themeConfig

Vue.prototype.$apiUrl = apiUrl;

if(localStorage.user) {
    Vue.prototype.$user = JSON.parse(localStorage.user);
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
