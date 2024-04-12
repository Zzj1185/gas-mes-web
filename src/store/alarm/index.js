const state = {
  alarmData: {},
  alarmCount: 0,
  newData: null,
}

const mutations = {
  SET_ALARM(state, payload) {
    const { topic, data } = payload
    if (data) {
      state.alarmData[topic] = data
    } else {
      if (state.alarmData[topic]) {
        state.newData.tag_name = state.alarmData[topic].tag_name
        delete state.alarmData[topic]
      }
    }
    state.newData = data
    state.alarmCount = Object.keys(state.alarmData).length
  },

  RESET_ALARMACCOUNT(state) {
    state.alarmCount = 0
    state.alarmData = {}
  }
}

const actions = {
  saveAlarmData({ commit }, data) {
    commit('SET_ALARM', data)
  },
  resetAlarmCount({ commit }) {
    commit('RESET_ALARMACCOUNT')
  }

}

const getters = {
  alarmData(state) {
    return state.alarmData
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
