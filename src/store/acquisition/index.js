const state = {
  acqData: {},
  newData: { time: 0, topic: '', data: null },
}

const mutations = {
  SET_ACQ(state, payload) {
    const { topic, data } = payload
    const old = state.acqData[topic] || {}
    state.acqData[topic] = Object.assign(old, data)
    state.newData.time = new Date().getTime()
    state.newData.topic = topic
    state.newData.data = data
  },
}

const actions = {
  saveAcqData({ commit }, data) {
    commit('SET_ACQ', data)
  },
}

const getters = {
  acqData(state) {
    return state.acqData
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
