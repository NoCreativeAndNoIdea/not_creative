import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// global style
import '~/styles/common.scss'

// init store use pinia
import store from '~/store'
app.use(store)

// init router
import router from '~/router'
app.use(router)

// init i18n
import i18n from '~/i18n'
app.use(i18n)

app.mount('#app')
