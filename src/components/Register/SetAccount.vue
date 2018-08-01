<template>
  <div>
    <transition name="slide" mode="out-in">
      <div v-if="showForm" class="form">
        <el-form label-position="right" label-width="80px" :model="regForm" :rules="rules" ref="regForm">
          <el-form-item label="手机号" prop="account">
            <el-input placeholder="请输入常用手机号" type="tel" v-model.trim="regForm.account" autofocus></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="checkCode">
            <el-row>
              <el-col :span="14">
                <el-input placeholder="输入图片字符" v-model.trim="regForm.checkCode"
                          @keyup.enter.native="regNext('regForm')"></el-input>
              </el-col>
              <el-col :span="8" :offset="2" class="img"><img :src="src" alt="验证码" @click="refresh()"></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label=" ">
            <el-checkbox v-model="isChecked">同意<a href="javascript:void(0)" @click="dialogVisible = true">《小亚通注册协议条款》</a>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click="regNext('regForm')">下一步</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          title="注册协议"
          v-model="dialogVisible"
          size="tiny"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :modal-append-to-body="false"
          top="10%"
        >
          <p>1.
            请您确认，在您完成注册流程或以其他小亚通允许的方式实际使用小亚通平台服务时，您应当是具备完全民事行为能权利能力和完全民事力的自然人、法人或其他组织。若您不具备前述主体资格，则您及您的监护人应承担因此而导致的一切后果，且小亚通有权注销或永久冻结您的账户，并向您及您的监护人索偿相应损失。<br/><br/>
            2. 小亚通作为网络服务的提供方，对用户的商品，店铺等所有资源中，不符合国家法律规定或者网站相关规则的（如：色情、暴力、政治、军事、垃圾广告等与商务不相关的话题），均有权直接进行删除、修改等处理，不再另行通知。
            <br/><br/>3. 小亚通用户在小亚通平台上的操作如有违反国家或地区法律法规相关规定的，一切法律后果自负。
            <br/><br/>4. 小亚通的声明及其修改权、更新权、最终解释权均归属小亚通所有。
            <br/><br/>5. 小亚通致力于为各类型卖家和各个电商平台、其他平台提供连接服务，如果卖家由于自身原因或其他平台原因导致服务中断或者相关法律问题，一律与小亚通无关。</p>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">我知道了</el-button>
          </div>
        </el-dialog>
      </div>
      <set-password v-else @openForm="close"></set-password>
    </transition>
    <div class="formTest">
      <div class="example">
        <p>他们都在使用小亚通，电商运营更轻量</p>
        <div class="partner">
          <div v-for="picture in pictures">
            <img :src="picture.src" alt="" :width="picture.width" :height="picture.height">
          </div>
          <div>
            <a href="http://www.i-boss.cn/" target="_blank">更多</a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import axios from 'axios'
  import setPassword from './setPassword'
  import {
    verifyCodeCheck
  } from '../../assets/validatorEnum.js'
  import {
    imgUrl
  } from '../../assets/baseUrl.js'
  export default {
    components: {
      setPassword
    },
    name: 'set-account',
    data() {
      var accountCheck = function (rule, value, callback) {
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
            if (res.data) {
              return callback(new Error('该账号已注册，请登录'));
            } else {
              return callback();
            }
          })
      };
      return {
        dialogVisible: false,
        showForm: true,
        src: '',
        regForm: {
          account: '',
          checkCode: '',
        },
        isChecked: true,
        rules: {
          account: [{
            validator: accountCheck,
            trigger: 'blur'
          }],
          checkCode: [{
            validator: verifyCodeCheck,
            trigger: 'blur'
          }]
        },
        pictures: [
          {src: require('../../assets/img/partner-1.png'), width: 78, height: 60},
          {src: require('../../assets/img/partner-2.png'), width: 78, height: 60},
          {src: require('../../assets/img/partner-3.png'), width: 78, height: 60},
          {src: require('../../assets/img/partner-4.png'), width: 60, height: 60},
          {src: require('../../assets/img/partner-5.png'), width: 60, height: 60},
          {src: require('../../assets/img/partner-6.png'), width: 60, height: 60},
          {src: require('../../assets/img/partner-7.png'), width: 60, height: 60},
          {src: require('../../assets/img/partner-8.png'), width: 60, height: 60},
          {src: require('../../assets/img/partner-9.png'), width: 60, height: 60},
          {src: require('../../assets/img/partner-10.png'), width: 60, height: 60},
        ]
      }
    },
    methods: {
      regNext(form) {
        if (this.isChecked) {
          this.$refs[form].validate((valid) => {
            if (valid) {
              window.sessionStorage.setItem('account', this.regForm.account);
              this.showForm = false;
            }
          })
        } else {
          this.$message.info({
            message: '请查阅并同意《小亚通注册协议条款》'
          })
        }
      },
      refresh() {
        let href = imgUrl;
        this.src = `${href}?refresh=${Math.random()}`;
      },
      close() {
        this.showForm = true;
      }
    },
    mounted() {
      // console.log('123');
      this.refresh();
      this.$refs['regForm'].resetFields();
    },
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     vm.refresh();
    //     vm.$refs['regForm'].resetFields();
    //   })
    // }
  }
</script>
<style lang="less" scoped>
  @import '../../main.less';

  .formTest {
    width: 100%;
    min-width: 1200px;
    background: #fff;
    text-align: center;
    margin-top: 60px;
    padding-bottom: 30px;
    padding-top: 20px;

  .example {
    width: 1200px;
    margin: 0 auto;
  }

  p {
    padding-bottom: 20px;
  }

  }
  .partner {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .form {
    width: 400px;
    margin: 0 auto;

  a {
    color: @blue;
  }

  .img {

  img {
    width: 100%;
    height: 37px;
    float: left;
  }

  }
  }
  .dialog-footer {
    text-align: center;
  }
</style>
<style>
  .form .el-dialog--tiny {
    width: 400px;
  }
</style>
