let state = {
  taskName: '',
  count: 0,
}

let mutations = {
  setTaskName(state, payload) {
    state.taskName = payload;
  },
  addTask(state, payload) {
    state.count ++;
    state.taskName = payload;
  },
}
// let actions = {
// }

export default {
  state,
  // getters,
  mutations,
  // actions
}
