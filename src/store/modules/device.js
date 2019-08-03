const state = {
  show: false,
  agentIp: null,
  agentPort: null,
  id: null,
  platform: null,
  port: null,
  appiumSessionId: null
}

const mutations = {
  SET_SHOW(state, isShow) {
    state.show = isShow
    // 关闭远程真机，信息重置
    if (!isShow) {
      state.agentIp = null
      state.agentPort = null
      state.id = null
      state.platform = null
      state.port = null
      state.appiumSessionId = null
    }
  },
  SET_AGENT_IP(state, agentIp) {
    state.agentIp = agentIp
  },
  SET_AGENT_PORT(state, agentPort) {
    state.agentPort = agentPort
  },
  SET_ID(state, id) {
    state.id = id
  },
  SET_PLATFORM(state, platform) {
    state.platform = platform
  },
  SET_PORT(state, port) {
    state.port = port
  },
  SET_APPIUM_SESSION_ID(state, appiumSessionId) {
    state.appiumSessionId = appiumSessionId
  }
}

const actions = {
  setShow({ commit }, isShow) {
    commit('SET_SHOW', isShow)
  },
  setAgentIp({ commit }, agentIp) {
    commit('SET_AGENT_IP', agentIp)
  },
  setAgentPort({ commit }, agentPort) {
    commit('SET_AGENT_PORT', agentPort)
  },
  setId({ commit }, id) {
    commit('SET_ID', id)
  },
  setPlatform({ commit }, platform) {
    commit('SET_PLATFORM', platform)
  },
  setPort({ commit }, port) {
    commit('SET_PORT', port)
  },
  setAppiumSessionId({ commit }, appiumSessionId) {
    commit('SET_APPIUM_SESSION_ID', appiumSessionId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
