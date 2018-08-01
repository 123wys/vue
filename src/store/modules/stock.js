let state = {
  plan: '',
}

let mutations = {
  setPlan: function(state, payload) {
    state.plan = payload
  },
}

export default {
  state,
  mutations,
}
