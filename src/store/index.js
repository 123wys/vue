import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import channel from './modules/channel'
import user from './modules/user'
import jurisdiction from './modules/jurisdiction'
import enumSet from './modules/enumSet'
import toolbox from './modules/toolbox'
import aftersale from './modules/aftersale'
import stock from './modules/stock'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'
const state = {
  url: {}
}
export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    user,
    channel,
    jurisdiction,
    enumSet,
    toolbox,
    aftersale,
    stock,
  },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
})
