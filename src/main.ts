import { createApp } from 'vue';

import { plugin as storePlugin } from './stores';

import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from './router';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import 'primeflex/primeflex.css';

import './assets/main.scss';

import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(ToastService);

app.use(PrimeVue);
app.use(storePlugin);
app.use(router);

app.mount('#app');
