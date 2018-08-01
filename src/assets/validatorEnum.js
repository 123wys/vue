import axios from 'axios'
// import { Message } from 'element-ui'
// 邀请供应商
export let etCheck = function(rule, value, callback) {
  if (!value) {
    return callback(new Error('企业名称不能为空！'));
  }
  return callback();
};
export let contactsCheck = function(rule, value, callback) {
  if (!value) {
    return callback(new Error('联系人姓名不能为空！'));
  }
  return callback();
};
export let mobileCheck = function(rule, value, callback) {
  if (!value) {
    return callback(new Error('手机号不能为空！'));
  }
  let reg = new RegExp(/^[1][34578][0-9]{9}$/g);
  if (reg.test(value)) {
    return callback();
  } else {
    return callback(new Error('请输入格式正确的11位手机号码'))
  }
};
// 订单导出
export let supplierCheck = function(rule, value, callback) {
  if (value === null) {
    return callback(new Error('请选择供应商'));
  }
  callback();
};

export let dateCheck = function(rule, value, callback) {
  if (!value[0] || !value[1]) {
    return callback(new Error('付款时间不能为空'));
  }
  let range = 93 * 24 * 3600 * 1000;
  if (Math.abs(new Date(value[0]).getTime() - new Date(value[1]).getTime()) < range) {
    return callback();
  } else {
    return callback(new Error('付款时间段不能大于三个月'))
  }
};

export let orderStatusCheck = function(rule, value, callback) {
  if (value.length === 0) {
    return callback(new Error('订单状态不能为空'));
  }
  callback();
}
//  登录-注册-重置密码
export let accountCheck = function(rule, value, callback) {
  if (!value) {
    return callback(new Error('手机号不能为空'));
  }
  let reg = new RegExp(/^[1][34578][0-9]{9}$/g);
  if (!reg.test(value += '')) {
    return callback(new Error('请输入格式正确的11位手机号码'));
  }
  axios.post('/noLogin/operLogin/isLoginNameExist', {
    loginName: value
  })
    .then(res => {
      if (res.data === true) {
        callback();
      } else {
        return callback(new Error('账号不存在，请注册'))
      }
    })
    .catch(err => {
      return callback(new Error(err.response ? err.response.data : err))
    })
    // .catch(() => {
    //   let href = window.location.href.split('/');
    //   href.pop();
    //   href.push('update');
    //   window.location.href = href.join('/');
    // })
};
export let pswCheck = function(rule, value, callback) {
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  let reg = new RegExp(/[\w\d\D]{6,12}/g);
  if (reg.test(value)) {
    callback();
  } else {
    return callback(new Error('由字母、数字、符号任意组合的6-12位密码'))
  }
};
export let passwordCheck = function(rule, value, callback) {
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  let reg = new RegExp(/^[\w]{6,12}$/);
  if (reg.test(value)) {
    callback();
  } else {
    return callback(new Error('由字母、数字组合的6-12位密码'))
  }
};

// 图片验证码
export let verifyCodeCheck = function(rule, value, callback) {
  if (!value) {
    return callback(new Error('验证码不能为空'));
  }
  axios.get(`/noLogin/operLogin/verifyImageCode?verifyCode=${value}`)
    .then(res => {
      if (res.data === true) {
        return callback();
      } else {
        return callback(new Error('验证码错误'));
      }
    })
};

// 邮箱验证
export let emailCheck = function(rule, value, callback) {
  let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g;
  if (!value) {
    return callback(new Error('邮箱不能为空'));
  }
  if (reg.test(value)) {
    return callback();
  } else {
    return callback(new Error('请输入正确的邮箱地址'));
  }
}
