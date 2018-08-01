<template>
  <div>
    <nav-top :title="'重设密码'" :linkTo="{path: '/login',label: '登录', des: ''}"></nav-top>
    <div class="resetBg">
      <div class="reset login">
        <div class="reset_body">
          <div class="form" v-if="resetComplate">
            <!-- 防止浏览器自动填入账号密码 -->
            <input style="display:none" type="text" name="fakeusernameremembered"/>
            <input style="display:none" type="password" name="fakepasswordremembered"/>
            <el-form label-width="80px" label-position="right" :model="resetForm" :rules="rules" ref="resetForm">
              <el-form-item label="手机号" prop="phoneNumber">
                <el-input placeholder="注册手机号" v-model.trim="resetForm.phoneNumber" auto-complate="off" autofocus></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="verifyCode">
                <el-row>
                  <el-col :span="16">
                    <el-input placeholder="请输入6位手机号验证码" v-model.trim="resetForm.verifyCode"></el-input>
                  </el-col>
                  <el-col :span="7" :offset="1">
                    <el-button style="width:100%;" :disabled="num === 0 ? false : true" @click="getCode"><span v-if="!num">获取验证码</span><span v-else>{{num}}秒后重试</span></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="新密码" class="psw" prop="loginPass">
                <el-input placeholder="由字母、数字、符号任意组合的6-12位密码" :type="showPsw" v-model.trim="resetForm.loginPass" auto-complate="off"></el-input>
                <div class="showpsw"><i :class="showCode" @click="showPswToggle"></i></div>
              </el-form-item>
              <el-form-item label="">
                <el-button type="primary" style="width:100%;" @click="confirm('resetForm')">确认重设</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="complate" v-else>
            <p class="title">您的密码已重设成功！</p>
            <p>小亚通账号：{{resetForm.phoneNumber}}</p>
            <el-button type="primary" style="width:360px;" @click="login">前往登录</el-button>
          </div>
        </div>
      </div>
    </div>
    <cr-footer></cr-footer>
  </div>
</template>
<script>
import axios from 'axios'
import {
  Message
} from 'element-ui'
import {
  pswCheck
} from '../../assets/validatorEnum.js'
import NavTop from '../common/NavTop'
import CrFooter from '../common/CrFooter'
import debounce from 'lodash/debounce'
export default {
  props: ['title', 'linkTo'],
  name: 'reset',
  data() {
    var codeCheck = function(rule, value, callback) {
      if (!value) {
        return callback(new Error('手机号验证码不能为空'));
      }
      let code = {
        phoneNumber: window.sessionStorage.phoneNumber,
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
            window.sessionStorage.phoneNumber = value;
            callback();
          } else {
            return callback(new Error('账号不存在，请注册'))
          }
        })
        .catch(err => {
          Message.error({
            message: (err.response ? err.response.data : err),
          })
        })
    }
    return {
      num: 0,
      showToggle: false,
      resetComplate: true,
      resetForm: {
        phoneNumber: '',
        verifyCode: '',
        loginPass: '',
      },
      rules: {
        phoneNumber: [{
          validator: accountCheck,
          trigger: 'blur'
        }],
        verifyCode: [{
          validator: codeCheck,
          trigger: 'formSubmit'
        }],
        loginPass: [{
          validator: pswCheck,
          trigger: 'formSubmit'
        }]
      }
    }
  },
  components: {
    NavTop,
    CrFooter
  },
  methods: {
    getCode: debounce(function() {
      let reg = window.sessionStorage.phoneNumber;
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
        phoneNumber: this.resetForm.phoneNumber
      };
      axios.post('/noLogin/sms/getSmsVerifyCodeForRegister', phone)
    }, 1000, {
      leading: true,
      trailing: false
    }),
    showPswToggle() {
      this.showToggle = !this.showToggle;
    },
    confirm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          axios.post('/noLogin/operLogin/updateLoginPassByPhone', this.resetForm)
            .then(res => {
              if (res.data) {
                this.resetComplate = false;
              }
            })
            .catch(err => {
              Message.error({
                message: err.response.data
              })
            })
        }
      })
    },
    login() {
      this.$router.push('/login');
      this.resetComplate = true;
    }
  },
  computed: {
    showCode() {
      let icon = 'icon iconfont icon-iconfont32pxmimabukejian';
      if (this.showToggle) {
        icon = 'icon iconfont icon-mimakejian';
      }
      return icon;
    },
    showPsw() {
      let type = 'text';
      if (!this.showToggle) {
        type = 'password';
      }
      return type;
    }
  },
  mounted() {
    this.$refs['resetForm'].resetFields();
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.resetBg {
  background-color: @pageBg;
  min-width: 1000px;
}

.login {
  width: 1000px;
  margin: 0 auto;
}

.form {
  width: 450px;
  margin: 0 auto;
}

.reset_body {
  height: 480px;
  padding-top: 70px;
  .psw {
    position: relative;
  }
  .showpsw {
    position: absolute;
    top: 2px;
    right: @smallSize;
    z-index: 3;
    cursor: pointer;
  }
}

.complate {
  width: 360px;
  margin: 0 auto;
  .title {
    font-size: 14px;
    color: @success;
  }
  p {
    color: @black;
    font-size: 20px;
    font-weight: 200;
  }
}
</style>
