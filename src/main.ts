import { createApp } from 'vue'
import './style/main.scss'
import App from './App.vue'
import { setupStore } from './store'

const app = createApp(App)

setupStore(app)

app.mount('#app')

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.classList.add(savedTheme);
} else {
    document.body.classList.add('light-theme');
}