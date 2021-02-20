import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Http, { checkToken, removeToken } from './plugins/http'
import 'tailwindcss/tailwind.css'
import '@mdi/font/css/materialdesignicons.min.css'
import useMiddleware from './helpers/useMiddleware'
import Toasted from 'vue-toasted'
import { startEcho } from './plugins/echo'

Vue.config.productionTip = false
Vue.use(Http)
Vue.use(Toasted, {
  position: 'top-center',
  iconPack: 'mdi',
  theme: 'bubble',
  duration: 4500,
})

function initializeApp() {
  // Router Middlewares.
  useMiddleware(router, store)

  // Echo.
  startEcho()

  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app')
}

const token = checkToken()
if (!token) {
  initializeApp()
} else {
  store
    .dispatch('auth/me')
    .then(() => {
      store.commit('auth/SET_TOKEN', token)
      store.commit('auth/SET_LOGGED_IN', true)
      store.dispatch('auth/updateLastOnline')

      initializeApp()
    })
    .catch(() => {
      removeToken()

      initializeApp()
    })
}
