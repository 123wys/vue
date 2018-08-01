<template>
  <div class="stepForm">
    <div class="title">
      <span>验证手机号</span>
      <i class="el-icon-close icon" @click="close"></i>
    </div>
    <div class="form">
      <el-form label-position="left" label-width="100px" :model="regForm" :rules="rules" ref="regForm">
        <!-- 防止浏览器自动填入账号密码 -->
        <input style="display:none" type="text" name="fakeusernameremembered"/>
        <input style="display:none" type="password" name="fakepasswordremembered"/>
        <el-form-item label="小亚通账号">
          <span class="account">{{account}}</span>
        </el-form-item>
        <el-form-item label="手机号验证码" prop="checkCode">
          <el-row>
            <el-col :span="15">
              <el-input placeholder="请输入6位手机号验证码" autofocus v-model.trim="regForm.checkCode" auto-complate="off" @keyup.enter.native="regNext('regForm')"></el-input></el-col>
            <el-col :span="8" :offset="1">
              <el-button :disabled="num === 0 ? false : true" style="width:100%;" @click="getCode()"><span v-if="!num">获取验证码</span><span v-else>{{num}}秒后重试</span></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!--<el-form-item label="密码" prop="password" class="psw">-->
        <!--<el-input :type="showPsw" v-model.trim="regForm.password" placeholder="由字母、数字、符号任意组合的6-12位密码" @keyup.enter.native="regNext('regForm')" auto-complate="off"></el-input>-->
        <!--<div class="showpsw"><i :class="showCode" @click="showPswToggle"></i></div>-->
        <!--</el-form-item>-->
        <el-form-item style="padding-top: 20px;">
          <el-button type="primary" style="width:50%;" @click="regNext('regForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>
<script>
import axios from 'axios'
export default {
  data() {
    var codeCheck = function(rule, value, callback) {
      if (!value) {
        return callback(new Error('手机号验证码不能为空'));
      }
      let code = {
        phoneNumber: window.sessionStorage.getItem('account'),
        verifyCode: value
      };
      axios.post('/noLogin/sms/verifySmsCode', code)
        .then(res => {
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
      account: '12312312311',
      showToggle: false,
      regForm: {
        checkCode: '',
      },
      rules: {
        checkCode: [{
          validator: codeCheck,
          trigger: 'formSubmit'
        }],
      }
    }
  },
  methods: {
    showPswToggle() {
      this.showToggle = !this.showToggle
    },
    close() {
      this.$emit('openForm');
    },
    regNext(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let data = {
            mobile: this.account
          }
          axios.post('/noLogin/tenantEnter/getTenantByMobile', data).then(res => {
            if (res.data.tenantId && res.data.enterpriseTitle) {
              window.sessionStorage.name = res.data.enterpriseTitle;
              window.sessionStorage.contact = res.data.contacts;
            } else {
              window.sessionStorage.name = '';
              window.sessionStorage.contact = '';
            }
            this.$router.push('/register/complateShip')
          }).catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
        }
      })
    },
    getCode() {
      let reg = new RegExp(/^[1][34578][0-9]{9}$/g);
      if (!this.account || !reg.test(this.account)) {
        this.$message.error({
          message: '手机号不正确'
        })
        return;
      }
      this.num = 60;
      var intel = setInterval(() => {
        this.num -= 1
        if (!this.num) {
          clearInterval(intel);
        }
      }, 1000)
      let phone = {
        phoneNumber: this.account
      };
      axios.post('/noLogin/sms/getSmsVerifyCodeForRegister', phone)
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          })
        })
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
  created() {
    this.account = window.sessionStorage.getItem('account')
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.stepForm {
  width:600px;
  padding: 10px 10px 17px 10px;
  background: #fff;
  margin-bottom: 20px;
  border:1px solid @borderLine;
.el-form-item {
  margin-bottom: 5px;
}
 margin: 0 auto;
  .title {
    display: flex;
    justify-content: space-between;
.icon {
  color:@darkGary;
  font-size:@fontSize14;
  cursor: pointer;
}
span {
  font-size:@fontSize14;
  color:@black;
  font-weight: bold;
}
  }

}
.form {
  width: 400px;
  margin: 0 auto;
  padding-top: 20px;
  a {
    color: @blue;
  }
  .account {
    color: #F90;
  }
  .psw {
    position: relative;
  }
  .showpsw {
    position: absolute;
    top: 0;
    right: @smallSize;
    z-index: 3;
    cursor: pointer;
  }
}
</style>
