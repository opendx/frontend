const state = {
  show: false,
  agentIp: null,
  agentPort: null,
  id: null
}

const mutations = {
  SET_SHOW(state, isShow) {
    state.show = isShow
    // 关闭远程真机，信息重置
    if (!isShow) {
      state.agentIp = null
      state.agentPort = null
      state.id = null
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
