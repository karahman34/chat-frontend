import authApi from '@/api/authApi'
import profileApi from '@/api/profileApi'
import { removeToken, setToken } from '@/plugins/http'

export default {
  async register({ commit, dispatch }, payload) {
    try {
      const res = await authApi.register(payload)
      const { data } = res.data
      const { access_token, user } = data

      const token = `Bearer ${access_token}`

      // Set http token.
      setToken(token)

      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      commit('SET_LOGGED_IN', true)

      dispatch('updateLastOnline')

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async login({ commit, dispatch }, payload) {
    try {
      const res = await authApi.login(payload)
      const { data } = res.data
      const { access_token, user } = data

      const token = `Bearer ${access_token}`

      // Set http token.
      setToken(token)

      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      commit('SET_LOGGED_IN', true)

      dispatch('updateLastOnline')

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async me({ commit }) {
    try {
      const res = await authApi.me()
      const { data } = res.data

      // Commits.
      commit('SET_USER', data)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async updateProfile({ commit }, payload) {
    try {
      const res = await profileApi.update(payload)

      // Commits.
      commit('SET_USER', res.data.data)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async updateLastOnline({ commit, dispatch }) {
    try {
      const res = await authApi.updateLastOnline()
      const { data } = res.data

      commit('UPDATE_LAST_ONLINE', data.last_online)
      commit('SET_LAST_ONLINE_INTERVAL', {
        stop: false,
        cb: () => dispatch('updateLastOnline'),
      })

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async logout({ commit }) {
    try {
      const res = await authApi.logout()

      // Remove http token.
      removeToken()

      // Commits.
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
      commit('SET_LOGGED_IN', false)
      commit('SET_LAST_ONLINE_INTERVAL', {
        stop: true,
        cb: null,
      })

      commit('conversation/CLEAR_STATES', null, {
        root: true,
      })

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
