import Cookies from 'js-cookie'

const state = {
  id: Cookies.get('projectId') || null,
  type: Cookies.get('projectType') || null,
  name: Cookies.get('projectName') || null
}

const mutations = {
  SET_ID(state, id) {
    state.id = id
  },
  SET_TYPE(state, type) {
    state.type = type
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
  setType({ commit }, type) {
    Cookies.set('projectType', type)
    commit('SET_TYPE', type)
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
