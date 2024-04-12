const state = {
  stockData: { limited_part: [] },
  stockCount: 0,
}

const mutations = {
  SET_STOCK(state, payload) {
    state.stockData = payload
    if (state.stockData && state.stockData.limited_part) {
      state.stockCount = state.stockData.limited_part.length
    } else {
      state.stockCount = 0
    }
  },
}

const actions = {
  saveStockData({ commit }, data) {
    commit('SET_STOCK', data)
  },
}

const getters = {
  stockData(state) {
    return state.stockData
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
