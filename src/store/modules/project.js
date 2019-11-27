import Cookies from 'js-cookie'

const state = {
  id: Cookies.get('projectId') ? parseInt(Cookies.get('projectId')) : null,
  platform: Cookies.get('platform') ? parseInt(Cookies.get('platform')) : null,
  env: Cookies.get('env') ? parseInt(Cookies.get('env')) : -1
}

const mutations = {
  SET_ID(state, id) {
    state.id = id
  },
  SET_PLATFORM(state, platform) {
    state.platform = platform
  },
  SET_ENV(state, env) {
    state.env = env
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
  },
  setEnv({ commit }, env) {
    Cookies.set('env', env, { expires: 365 })
    commit('SET_ENV', env)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
