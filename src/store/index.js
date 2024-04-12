import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './user'
import stock from './stock'
import alarm from './alarm'
import acquisition from './acquisition'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    stock,
    alarm,
    acquisition,
  },
  plugins: [
    createPersistedState(),
  ],
})

export default store
