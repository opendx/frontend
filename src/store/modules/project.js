import Cookies from 'js-cookie'

const state = {
  id: Cookies.get('projectId') || null,
  platform: Cookies.get('platform') || null,
  name: Cookies.get('projectName') || null
}

const mutations = {
  SET_ID(state, id) {
    state.id = id
  },
  SET_PLATFORM(state, platform) {
    state.platform = platform
  },
  SET_NAME(state, name) {
    state.name = name
  }
}

const actions = {
  setId({ commit }, id) {
    Cookies.set('projectId', id)
    commit('SET_ID', id)
  },
  setPlatform({ commit }, platform) {
    Cookies.set('platform', platform)
    commit('SET_PLATFORM', platform)
  },
  setName({ commit }, name) {
    Cookies.set('projectName', name)
    commit('SET_NAME', name)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
