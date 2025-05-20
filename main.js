import { createApp } from 'vue'
import App from './src/App.vue'
import router from './router'
// import heroui from './plugins/heroui'
// import './src/assets/css/tailwind.css'
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import api from "@/services/api";

const app = createApp(App)

// Adiciona $api globalmente para uso nos componentes
app.config.globalProperties.$api = api

app.use(router)
app.use(WaveUI, {})
app.mount('#app')