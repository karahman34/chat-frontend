import Echo from 'laravel-echo'
import { tokenName } from './http'

window.Pusher = require('pusher-js')

function startEcho() {
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.VUE_APP_PUSHER_APP_KEY,
    cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: process.env.VUE_APP_API_BASE_URL + '/broadcasting/auth',
    auth: {
      headers: {
        Authorization: localStorage.getItem(tokenName),
      },
    },
  })
}

function stopEcho() {
  delete window.Echo
}

export { startEcho, stopEcho }
