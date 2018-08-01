var state = {
  // 初始变量
  init: {
    createOp: '',
    createTime: '',
    doneTime: '',
    effectiveDate: '',
    email: '',
    expiredDate: '',
    forceChangePasswd: '',
    isAdmin: '',
    loginName: '',
    loginPass: '',
    mobile: '',
    opId: '',
    opName: '',
    passwdCycleDay: '',
    passwdPattern: '',
    tenantId: '',
    thirdUserInfo: {
      city: '',
      country: '',
      createTime: '',
      doneTime: '',
      extId: '',
      headImgUrl: '',
      language: '',
      nickname: '',
      opId: '',
      openId: '',
      platform: '',
      province: '',
      sex: '',
      unionId: '',
      userId: ''
    }
  },
  // 当前登录账号权限信息
  jurisdiction: {
    createOp: '',
    createTime: '',
    doneTime: '',
    effectiveDate: '',
    email: '',
    expiredDate: '',
    forceChangePasswd: '',
    isAdmin: '',
    loginName: '',
    loginPass: '',
    mobile: '',
    opId: '',
    opName: '',
    passwdCycleDay: '',
    passwdPattern: '',
    tenantId: '',
    thirdUserInfo: {
      city: '',
      country: '',
      createTime: '',
      doneTime: '',
      extId: '',
      headImgUrl: '',
      language: '',
      nickname: '',
      opId: '',
      openId: '',
      platform: '',
      province: '',
      sex: '',
      unionId: '',
      userId: ''
    }
  }
}
var getters = {
  jurisdiction: function(state) {
    return state.jurisdiction;
  }
}
var mutations = {
  setJurisdiction: function(state, payload) {
    state.jurisdiction = Object.assign({}, state.jurisdiction, payload);
  },
  jurisdictionReset: function(state, payload) {
    state.jurisdiction = Object.assign({}, state.init);
  }
}
var actions = {
  getJurisdiction: function({ state, commit, rootState }, _self) {
    let query = {
      queryCondition: {
        loginName: window.localStorage.loginName
      }
    };
    _self.axios.post('/sysmgnt/operator/getCurrentOperator', query).then(function(response) {
      commit('setJurisdiction', response.data)
    }).catch(function(error) {
      _self.$message.error(error.response ? error.response.data : error);
    });
  },
  jurisdictionReset: function({ state, commit, rootState }, payload) {
    commit('jurisdictionReset')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
