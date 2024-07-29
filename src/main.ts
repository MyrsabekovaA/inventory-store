import { createApp } from 'vue'
import './style/style.scss'
import App from './App.vue'
import { setupStore } from './store'

const app = createApp(App)

setupStore(app)

app.mount('#app')
