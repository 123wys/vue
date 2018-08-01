<template>
  <div class="body">
    <nav-top :title="''" :linkTo="{path: '',label: '', des: ''}"></nav-top>
    <div class="baco">
      <!-- <img class="bgImg" src="../../assets/img/loginBackground.png" alt="背景图"> -->
      <div class="login_body">
        <img src="../../assets/img/bgFont.png" alt="文字" class="fontBg">
        <div class="form zIndex" v-loading="loading" element-loading-text="正在为您建立安全连接...">
          <p>{{loginTitle}}</p>
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="loginName" class="psw">
              <el-input placeholder="注册手机号" v-model.trim="loginForm.loginName" autofocus auto-complate="off">
                <!-- <template slot="prepend">
                <i class="icon iconfont icon-zhanghao"></i>
              </template> -->
              </el-input>
              <i class="icon iconfont icon-zhanghao iconleft"></i>
            </el-form-item>
            <el-form-item class="psw" prop="loginPasswd">
              <el-input placeholder="请输入密码" type="password" v-model.trim="loginForm.loginPasswd" auto-complate="off">
                <!-- <template slot="prepend">
                <i class="icon iconfont icon-mima"></i>
              </template> -->
              </el-input>
              <i class="icon iconfont icon-mima1 iconleft iconbig"></i>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-row :gutter="10">
                <el-col :span="15">
                  <el-input placeholder="输入图片字符" v-model.trim="loginForm.verifyCode" v-on:keyup.enter.native="formSubmit">
                  </el-input>
                </el-col>
                <el-col :span="9" class="img">
                  <img :src="src" alt="验证码" @click="refresh">
                </el-col>
              </el-row>
            </el-form-item>
            <!-- <el-row class="checkbox">
              <el-checkbox>7天内自动登录</el-checkbox>
            </el-row> -->
            <el-button type="primary" class="btn_big" @click="formSubmit">登录</el-button>
          </el-form>
          <el-row v-if="thirdLoginFlag === ''" class="thirdLogin">
            <a href="javascript:void(0);" @click="thirdLoginJS('wx');" style="text-decoration:none;">
              <img src="../../icon24_wx_logo.png" alt="点击微信登录">
              <span>&nbsp;微信</span>
            </a>
          </el-row>
          <el-row>
            <div class="trouble">
              <span class="forget" @click="forget">忘记密码?</span>
              <span class="inCode" @click="inviteCode">邀请码入驻</span>
              <span class="goRegister" @click="goRegister">注册入驻</span>
            </div>
          </el-row>
        </div>
        <div class="form opa">
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
  accountCheck,
  pswCheck,
  verifyCodeCheck
} from '../../assets/validatorEnum.js'
import NavTop from '../common/NavTop'
import CrFooter from '../common/CrFooter'
import {
  imgUrl
} from '../../assets/baseUrl.js'
let checkloginUrl = 'noLogin/operLogin/checklogin';
export default {
  name: 'login',
  data() {
    return {
      loginResult: '',
      loginTitle: '账号登录',
      thirdLoginFlag: '',
      retState: '',
      loading: false,
      src: '',
      loginForm: {
        loginName: '',
        loginPasswd: '',
        verifyCode: '',
        state: ''
      },
      rules: {
        loginName: [{
          validator: accountCheck,
          trigger: 'formSubmit'
        }],
        loginPasswd: [{
          validator: pswCheck,
          trigger: 'formSubmit'
        }],
        verifyCode: [{
          validator: verifyCodeCheck,
          trigger: 'formSubmit'
        }]
      }
    }
  },
  computed: {},
  components: {
    NavTop,
    CrFooter
  },
  methods: {
    // turnTo() {
    //   this.$router.push('/update');
    // },
    thirdLoginJS(platform) {
      // let redirectUrl = axios.defaults.baseURL;
      let redirectUrl = 'https://api.xiaoyatong.com/';
      if (!platform || platform === '') {
        this.$message.info('未知平台！请重试！');
        return;
      } else if (platform === 'wx') {
        redirectUrl = redirectUrl + 'noLogin/operLogin/weixinLogin';
      }
      let state = new Date().getTime();
      let url = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx48e19a6589f60f56&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_login&state=' + state + '#wechat_redirect';
      // let width = 563;
      // let height = 593;
      // let l = (window.screen.width - width) / 2;
      // let t = (window.screen.height - height) / 2;
      // window.open(url, 'weixinLogin', 'width=' + width + ',height=' + height + ',left=' + l + ',top=' + t + ',menubar=0,scrollbars=0,resizable=0,status=0,titlebar=0,toolbar=0,location=1');
      window.location = url;
    },
    formSubmit() {
      this.$refs.loginForm.validateField('verifyCode', err => {
        if (!err) {
          this.loading = true;
          this.$refs.loginForm.validateField('loginName', err => {
            if (err) {
              this.loading = false;
            } else {
              let postUrl = '/noLogin/operLogin/login';
              if (this.thirdLoginFlag === 'weixin') {
                postUrl = '/noLogin/operLogin/bindThirdUserToOper';
                this.loginForm.state = this.retState;
              }
              axios.post(postUrl, this.loginForm)
              .then(res => {
                if (res.data.loginName) {
                  window.document.cookie = `loginName=${res.data.loginName}`;
                  window.localStorage.loginName = `${res.data.loginName}`;
                  this.$router.push('/index');
                }
                if (res.data.verifyUrl) {
                  window.location.href = res.data.verifyUrl;
                }
              })
              .catch(err => {
                this.loading = false;
                this.refresh();
                Message.error({
                  message: err.response ? err.response.data : err
                })
              })
            }
          })
        }
      })
      // this.$refs[form].validate((valid) => {
      //   if (valid) {
      //     this.loading = true;
      //     axios.post('/noLogin/operLogin/login', this.loginForm)
      //       .then(res => {
      //         if (res.data.loginName) {
      //           window.document.cookie = `loginName=${res.data.loginName}`;
      //           window.localStorage.loginName = `${res.data.loginName}`;
      //           this.$router.push('/index');
      //         }
      //         if (res.data.verifyUrl) {
      //           window.location.href = res.data.verifyUrl;
      //         }
      //       })
      //       .catch(err => {
      //         this.loading = false;
      //         this.refresh();
      //         Message.error({
      //           message: err.response ? err.response.data : err
      //         })
      //       })
      //   }
      // })
    },
    forget() {
      this.$router.push('/reset');
    },
    inviteCode() {
      this.$router.push('/join');
    },
    refresh() {
      let href = imgUrl;
      this.src = `${href}?refresh=${Math.random()}`;
    },
    goRegister() {
      this.$router.push('/register');
    },
  },
  mounted() {
    this.loginTitle = '账号登录';
    this.thirdLoginFlag = '';
    this.retState = this.$route.query.state;
    this.loginResult = this.$route.query.loginResult;
    if (typeof this.loginResult !== 'undefined' && this.loginResult === 'noRelated' && typeof this.retState !== 'undefined' && this.loginResult !== '') {
      this.loginTitle = '绑定小亚通账号';
      this.thirdLoginFlag = 'weixin';
    }
    this.$refs.loginForm.resetFields();
    this.loginForm.loginName = window.localStorage.loginName;
    this.refresh();
  },
  beforeRouteEnter(to, from, next) {
    axios.post(checkloginUrl).then(response => {
      if (response.data === 'login') {
        next('/index');
      } else {
        next();
        // next(vm => {
        //   vm.loginForm.loginName = window.localStorage.loginName;
        // })
      }
    }).catch(err => {
      next(vm => {
        // vm.loginForm.loginName = window.localStorage.loginName;
        vm.$message.error(err.response ? err.response.data : err);
      })
    })
  },
  beforeRouteLeave(to, from, next) {
    next(vm => {
      window.setTimeout(() => {
        vm.loading = false;
      }, 400)
    })
  }
}
</script>
<style lang='less' scoped>
@import '../../main.less';
.body {
  margin: 0;
  width: 100%;
}

.baco {
  width: 100%;
  min-width: 1000px;
  overflow: hidden;
  position: relative;
  /*min-height: 670px;*/
  height: 670px;
  background: url(../../assets/img/loginBackground.png) no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  /*.bgImg {
    width: 100%;
    height: 70%;
    max-height: 669px;
  }*/
}

.login_body {
  width: 1000px;
  height: 524px;
  position: absolute;
  top: 0;
  left: calc(~"50% - 500px");
  .fontBg {
    position: absolute;
    top: 218px;
    left: @baseSpace * 4;
  }
  .form {
    width: 350px;
    height: 370px;
    position: absolute!important;
    top: 140px;
    right: 20px;
    padding: @baseSpace * 5;
  }
  .zIndex {
    z-index: 2;
    p {
      margin: 0;
      padding: 0;
      text-align: center;
      font-size: @homeFont24;
      line-height: 33px;
      margin-bottom: @baseSpace * 3;
    }
    .icon::before {
      font-size: 22px;
      margin: 0 5px;
    }
    .thirdLogin {
      margin-top: @baseSpace * 2;
      padding-bottom: @baseSpace * 2;
      font-size: 14px;
      border-bottom: 1px solid @lightGary;
      a:link {
        color: #333333;
        text-decoration: none;
      }
      a:visited {
        color: #333333;
        text-decoration: none;
      }
      img {
        vertical-align: middle;
        border-radius: 9px;
        width: 18px;
        height: 18px;
      }
    }
    .trouble {
      /*float: right;*/
      text-align: right;
      margin-top: @baseSpace * 2;
    }
    .forget {
      color: @neutralGary;
      cursor: pointer;
      float: left;
    }
    .goRegister {
      color: @primaryBlue;
      cursor: pointer;
    }
    .inCode {
      cursor: pointer;
      margin-right: @baseSpace * 2;
    }
    .btn_big {
      width: 100%;
      height: @baseSpace * 8;
      border-radius: 0;
    }
    .psw {
      position: relative;
    }
    .iconleft {
      position: absolute;
      top: @baseSpace;
      left: @baseSpace;
      z-index: 3;
    }
    .img {
      img {
        width: 100%;
        height: @baseSpace * 8;
        float: left;
      }
    }
  }
  .opa {
    background-color: #fff;
    opacity: .85;
  }
  .checkbox {
    margin-bottom: @baseSpace * 2;
  }
}
</style>
<style lang="less">
@import '../../main.less';
.login_body .el-input-group__prepend {
  padding: 0;
}

.login_body .el-form-item {
  margin-bottom: @baseSpace * 4;
  .el-form-item__content{
    height: @baseSpace * 8;
  }
}

.login_body .el-input__inner {
  border-radius: 0;
  height: 40px;
  font-size: @fontSize14;
}

.login_body .psw .el-input__inner {
  padding-left: 45px;
}

.login_body .psw .iconleft {
  width: 28px;
  height: 24px;
  line-height: 24px;
  margin: 3px 0 0 3px;
  color: @darkGary;
}

.login_body .psw .iconbig {
  margin-top: 5px;
}

.login_body .psw .iconbig::before {
  font-size: 24px!important;
}
</style>
