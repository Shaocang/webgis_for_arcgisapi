import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    _defaultMapView: ''
  },
  getters: {
    _getDefaultMapView(state) {
      return state._defaultMapView
    }
  },
  mutations: {
    _setMapView(state, payload) {
      state._defaultMapView = payload.view
    }
  },
})

export default store
