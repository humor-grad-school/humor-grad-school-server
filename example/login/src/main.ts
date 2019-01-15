import Vue from 'vue';
import App from './App.vue';
import { HgsRestApi } from './Api/generated/client/ClientApis';

Vue.config.productionTip = false;

HgsRestApi.setBaseServerUrl('http://localhost:8080');

new Vue({
  render: (h) => h(App),
}).$mount('#app');
