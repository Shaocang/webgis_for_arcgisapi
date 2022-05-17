import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    defaultView: ''
  },
  getters: {
  },
  mutations: {
    setMapView(state, payload) {
      state.defaultView = payload.view
    }
  },
  actions: {
  },
  modules: {
  }
})

export default store
