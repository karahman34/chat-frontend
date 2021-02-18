import { http } from '@/plugins/http'

const prefix = '/auth'

export default {
  register(payload) {
    return http.post(`${prefix}/register`, payload)
  },
  login(payload) {
    return http.post(`${prefix}/login`, payload)
  },
  me() {
    return http.get(`${prefix}/me`)
  },
  updateLastOnline() {
    return http.patch(`${prefix}/last-online`)
  },
  logout() {
    return http.post(`${prefix}/logout`)
  },
}
