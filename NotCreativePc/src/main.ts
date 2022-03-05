import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// init router
import router from '~/router'
app.use(router)

app.mount('#app')
