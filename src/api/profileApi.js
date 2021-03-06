import { http } from '@/plugins/http'

const prefix = '/profile'

export default {
  update(payload) {
    return http.post(`${prefix}`, payload)
  },
  updatePassword(payload) {
    return http.post(`${prefix}/password`, payload)
  },
}
