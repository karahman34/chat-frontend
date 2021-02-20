import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import conversation from './modules/conversation'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    conversation,
  },
})
