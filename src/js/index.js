import '../scss/index.scss'
import { App } from './app'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'
if ('serviceWorker' in navigator) {
  const sw = runtime.register()
  if (sw) {
    sw.then(registration => (registration.onupdatefound = () => registration.update())).catch(e => console.error(e))
  }
}

const app = new App()
document.addEventListener('DOMContentLoaded', () => app.init())
