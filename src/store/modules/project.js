import Cookies from 'js-cookie'

const state = {
  id: Cookies.get('projectId') ? parseInt(Cookies.get('projectId')) : null,
  platform: Cookies.get('platform') ? parseInt(Cookies.get('platform')) : null,
}

const mutations = {
  SET_ID(state, id) {
    state.id = id
  },
  SET_PLATFORM(state, platform) {
    state.platform = platform
  }
}

const actions = {
  setId({ commit }, id) {
    Cookies.set('projectId', id, { expires: 365 })
    commit('SET_ID', id)
  },
  setPlatform({ commit }, platform) {
    Cookies.set('platform', platform, { expires: 365 })
    commit('SET_PLATFORM', platform)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
