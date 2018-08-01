<template>
  <div class="change">
    <el-row>
      <span class="fl">当前位置 :</span>
      <el-breadcrumb separator=">" class="fl" style="margin: 3px 0 0 5px;">
        <el-breadcrumb-item :to="{path: '/accountSet'}">账号设置</el-breadcrumb-item>
        <el-breadcrumb-item>更换绑定手机</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <p>更换绑定手机</p>
    <el-form :model="setPhone" :rules="phoneRule" ref="setPhone" label-width="70px" v-loading="loading" element-loading-text="更换中...">
      <el-form-item label="手机号" prop="account">
        <el-input v-model.trim="setPhone.account" placeholder="输入新的手机号"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <el-row>
          <el-col :span="15">
            <el-input v-model.trim="setPhone.verifyCode" placeholder="请输入6位手机号验证码"></el-input>
          </el-col>
          <el-col :span="7" :offset="2">
            <el-button style="width:100%;" :disabled="num === 0 ? false : true" @click="getCode"><span v-if="!num">获取验证码</span><span v-else>{{num}}秒后重试</span></el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="large" style="width:100%;" @click="accountSubmit">更换绑定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import debounce from 'lodash/debounce'
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'account-change',
  data() {
    var accountCheck = function(rule, value, callback) {
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
            return callback(new Error('该手机号码已经被商家绑定使用，请换一个手机号重试'));
          } else {
            window.sessionStorage.changeName = value;
            return callback();
          }
        })
    };
    var codeCheck = function(rule, value, callback) {
      if (!value) {
        return callback(new Error('手机号验证码不能为空'));
      }
      let code = {
        phoneNumber: window.sessionStorage.changeName,
        verifyCode: value
      };
      axios.post('/noLogin/sms/verifySmsCode', code)
        .then(res => {
          console.log(res)
          if (res.data === true) {
            callback()
          } else {
            return callback(new Error('验证码错误'))
          }
        })
        .catch(err => {
          return callback(new Error(err.response ? err.response.data : err))
        })
    };
    return {
      num: 0,
      loading: false,
      setPhone: {
        account: '',
        verifyCode: ''
      },
      phoneRule: {
        account: [{
          validator: accountCheck,
          trigger: 'blur'
        }],
        verifyCode: [{
          validator: codeCheck,
          trigger: 'formSubmit'
        }],
      },
    }
  },
  computed: {
    ...mapGetters([
      'jurisdiction'
    ])
  },
  methods: {
    ...mapActions([
      'getJurisdiction',
      'jurisdictionReset',
      'userReset',
    ]),
    accountSubmit: debounce(function() {
      this.$refs['setPhone'].validate(valid => {
        if (valid) {
          this.loading = true;
          let query = {};
          query.opId = this.jurisdiction.opId;
          query.opName = this.jurisdiction.opName;
          query.email = this.jurisdiction.email;
          query.loginName = this.setPhone.account;
          query.isAdmin = this.jurisdiction.isAdmin;
          query.mobile = this.setPhone.account;
          query.effectiveDate = this.jurisdiction.effectiveDate;
          query.expiredDate = this.jurisdiction.expiredDate;
          query.passwdCycleDay = this.jurisdiction.passwdCycleDay;
          console.log(query)
          axios.post('/sysmgnt/operator/updateOperator', query).then(res => {
            console.log(res.data)
            if (res.data) {
              window.localStorage.loginName = this.setPhone.account;
              // this.getJurisdiction(this);
              this.$message.success({
                message: '更换绑定成功!请重新登录'
              })
              this.loading = false;
              this.logout();
            }
          })
          .catch(err => {
            this.$message.error({
              message: (err.response ? err.response.data : err)
            })
            this.loading = false;
          })
        }
      })
    }, 1000, {
      leading: true,
      trailing: false
    }),
    getCode: debounce(function() {
      let reg = window.sessionStorage.changeName;
      if (!reg) {
        this.$message.error({
          message: '请输入可用手机号'
        })
        return;
      }
      this.num = 60;
      var intel = setInterval(() => {
        this.num -= 1
        if (!this.num) {
          clearInterval(intel);
        }
      }, 1000);
      let phone = {
        phoneNumber: this.setPhone.account
      };
      axios.post('/noLogin/sms/getSmsVerifyCodeForRegister', phone)
    }, 1000, {
      leading: true,
      trailing: false
    }),
    logout() {
      axios.post('/noLogin/operLogin/logout').then(res => {
        if (res.data === 'success') {
          // this.closepopover = false;
          // this.delCookie('loginName');
          this.userReset();
          this.jurisdictionReset();
          window.Esource && window.Esource.close();
          this.$router.push('/login');
        }
      }).catch(err => {
        this.$message.error({
          message: err.response ? err.response.data : err
        })
      })
    },
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.change {
  padding: 15px;
  width: 445px;
  overflow: hidden;
  p {
    font-size: 18px;
    height: 46px;
    margin-bottom: @smallSize;
    margin-top: @normalSize;
    line-height: 46px;
    color: @lightBlack;
  }
}

.fl {
    color: @lightGary;
    float: left;
    font-size: 12px;
  }
</style>
