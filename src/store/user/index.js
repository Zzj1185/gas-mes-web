import router from '@/router'
const state = {
  userInfo: null,
  currentMenu: '',
}

const mutations = {
  SAVE_USERINFO(state, payload) {
    state.userInfo = payload
  },
  REMOVE_USERINFO(state) {
    state.userInfo = null
    router.push('/login')
  },
  SAVE_MENU(state, payload) {
    state.currentMenu = payload
  },
}

const actions = {
  saveUserInfo({ commit }, userInfo) {
    commit('SAVE_USERINFO', userInfo)
  },
  removeUserInfo({ commit }) {
    commit('REMOVE_USERINFO')
  },
  saveMenu({ commit }, menu) {
    commit('SAVE_MENU', menu)
  },
}

const getters = {
  getUserInfo: (state) => {
    return state.userInfo
  },
  getCurrentMenu: (state) => {
    return state.currentMenu
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
}
