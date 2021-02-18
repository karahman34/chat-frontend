import { http } from '@/plugins/http'

const prefix = '/auth'

export default {
  forgotPassword(payload) {
    return http.post(`${prefix}/forgot-password`, payload)
  },
  resetPassword(payload) {
    return http.post(`${prefix}/reset-password`, payload)
  },
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
