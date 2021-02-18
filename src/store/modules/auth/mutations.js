export default {
  SET_USER(state, user) {
    state.user = user
  },
  SET_LOGGED_IN(state, val) {
    state.loggedIn = val
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  UPDATE_LAST_ONLINE(state, lastOnline) {
    state.user.last_online = lastOnline
  },
  SET_LAST_ONLINE_INTERVAL(state, { cb, stop }) {
    if (stop) {
      clearTimeout(state.lastOnlineTimeout)
      return
    }

    state.lastOnlineTimeout = setTimeout(() => cb(), 1000 * 60)
  },
}
