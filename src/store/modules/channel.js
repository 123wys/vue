let state = {
  channelList: []
}
let getters = {
  channelList: function(state) {
    return state.channelList;
  }
}
let mutations = {
  setChannelList: function(state, payload) {
    state.channelList = payload
  }
}
let actions = {
  setChannelList: function({ state, commit, rootState }, payload) {
    commit('setChannelList', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
