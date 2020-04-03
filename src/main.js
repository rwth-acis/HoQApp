import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import mainAuth from './auth';
import 'vue-oidc-client/src/polyfill';

Vue.config.productionTip = false

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')

// mainOidc.startup().then(ok => {
//   if (ok) {
//     new Vue({
//       router,
//       render: h => h(App)
//     }).$mount('#app');
//   }
// });

mainAuth.startup().then(ok => {
  if (ok) {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
