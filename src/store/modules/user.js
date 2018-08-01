import Vue from 'vue';
let v = new Vue();
let state = {
  //  客户管理标签枚举
  TagArr: [],
  //  客户分组标签枚举
  GroupArr: [],
  websocket: null,
  //  初始变量
  init: {
    assocStatus: '',
    authType: '',
    authentication: {
      auditStatus: null
    },
    tenantInfo: {
      authType: '',
      contacts: '',
      createOp: '',
      createTime: '',
      doneTime: '',
      enterpriseAcronym: '',
      enterpriseTitle: '',
      locAddress: '',
      locCity: '',
      locDistrict: '',
      locProvince: '',
      logoUrl: '',
      logoUrlSrc: '',
      mobile: '',
      telephone: '',
      modifiedFieldSet: [],
      remarks: '',
      state: '',
      tenantClass: '',
      tenantId: '',
      tenantType: '',
      zipCode: ''
    }
  },
  //  当前用户商家信息
  ichannel: {
    assocStatus: '',
    authType: '',
    authentication: {
      auditStatus: null
    },
    tenantInfo: {
      authType: '',
      contacts: '',
      createOp: '',
      createTime: '',
      doneTime: '',
      enterpriseAcronym: '',
      enterpriseTitle: '',
      locAddress: '',
      locCity: '',
      locDistrict: '',
      locProvince: '',
      logoUrl: '',
      logoUrlSrc: '',
      mobile: '',
      telephone: '',
      modifiedFieldSet: [],
      remarks: '',
      state: '',
      tenantClass: '',
      tenantId: '',
      tenantType: '',
      zipCode: ''
    }
  }
}
let getters = {
  ichannel: function(state) {
    return state.ichannel;
  },
  TagArr(state) {
    return state.TagArr;
  },
  GroupArr(state) {
    return state.GroupArr;
  }
}
let mutations = {
  setTagArr(state, payload) {
    state.TagArr = payload;
  },
  setGroupArr(state, payload) {
    state.GroupArr = payload;
  },
  connectWebsocket: function(state, payload) {
    state.websocket = payload;
  },
  setIchannel: function(state, payload) {
    state.ichannel.tenantInfo = Object.assign({}, state.ichannel.tenantInfo, payload);
  },
  userReset: function(state, payload) {
    let userAgent = navigator.userAgent;
    state.ichannel = Object.assign({}, state.init);
    if (state.websocket) {
      state.websocket.disconnect();
      if (userAgent.indexOf('Chrome') > -1) {
        console.log('%c websocket离线', 'color:green;text-shadow:1px 1px 3px #ccc'); // 'G5p5...'
      } else {
        console.log('websocket离线'); // 'G5p5...'
      }
    }
    state.websocket = null;
  }
}
let actions = {
  connectWebsocket: function({ state, commit }, payload) {
    commit('connectWebsocket', payload);
  },
  getIchannel: function({ state, commit, rootState }) {
    return v.axios.post('/customer/tenantInfo/getCurrentTenant', {}).then(function(response) {
      commit('setIchannel', response.data);
      return 'success'
    }).catch(function(error) {
      v.$message.error(error.response.data);
      return new Error('error');
    })
  },
  setTagArr({ state, commit, rootState }) {
    let data = {};
    v.axios.post('/customer/customer/queryTag', data).then(response => {
      commit('setTagArr', response.data)
    }).catch(error => {
      v.$message.error(error.response.data);
    });
  },
  setGroupArr({ state, commit, rootState }) {
    let data = {};
    v.axios.post('/customer/customer/queryGroup', data).then(response => {
      commit('setGroupArr', response.data);
    }).catch(error => {
      v.$message.error(error.response.data);
    });
  },
  userReset: function({ state, commit, rootState }) {
    commit('userReset');
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
