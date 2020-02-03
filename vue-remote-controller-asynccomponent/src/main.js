import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'
Vue.config.productionTip = false

new Vue({
  Rx,
  VueRx,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
