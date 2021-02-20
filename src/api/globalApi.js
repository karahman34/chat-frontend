import { http } from '@/plugins/http'

export default {
  searchPeoples(params) {
    return http.get('/search-people', {
      params,
    })
  },
}
