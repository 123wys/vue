let state = {
  order: '',
}

let mutations = {
  setASOrder: function(state, payload) {
    state.order = payload
  }
}

export default {
  state,
  mutations,
}
