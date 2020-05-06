const state = {
  show: false,
  agentIp: null,
  agentPort: null,
  id: null,
  platform: null,
  systemVersion: null,
  driverSessionId: null
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
      state.systemVersion = null
      state.driverSessionId = null
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
  SET_SYSTEM_VERSION(state, systemVersion) {
    state.systemVersion = systemVersion
  },
  SET_DRIVER_SESSION_ID(state, driverSessionId) {
    state.driverSessionId = driverSessionId
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
  setSystemVersion({ commit }, systemVersion) {
    commit('SET_SYSTEM_VERSION', systemVersion)
  },
  setDriverSessionId({ commit }, driverSessionId) {
    commit('SET_DRIVER_SESSION_ID', driverSessionId)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
