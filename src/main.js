// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import heroui from '../plugins/heroui'
// import api from './services/api'
// import './assets/css/tailwind.css'
//
// const app = createApp(App)
//
// app.config.globalProperties.$api = api;
//
// app.use(heroui).use(router).mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import heroui from './plugins/heroui'
import './assets/css/tailwind.css'
import './assets/css/theme.css'
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import api from "@/services/api";
import '@mdi/font/css/materialdesignicons.min.css'


const app = createApp(App)

// Adiciona $api globalmente para uso nos componentes
app.config.globalProperties.$api = api

app.use(router)
app.use(WaveUI, {})
new WaveUI(app, {})
app.mount('#app')
