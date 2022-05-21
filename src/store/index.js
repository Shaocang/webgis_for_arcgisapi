import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    _defaultMapView: 'aa',       //默认地图view
    a: 4

};

const getters = {
    _getDefaultMapView() {
        return state._defaultMapView;
    },

};

const mutations = {
    _setDefaultMapView(state, value) {
        state._defaultMapView = value;
    },
    setA(state, value) {
      state.a = value
    }

};

const store = new Vuex.Store({
    state,
    getters,
    mutations
});

export default store;