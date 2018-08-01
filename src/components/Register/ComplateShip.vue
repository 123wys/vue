<template>
  <div class="form">
    <el-form label-position="right" label-width="90px" :model="regForm" ref="regForm" :rules="rules">
      <el-form-item>
        <div v-if='enterTitle'>
          <div class="data"><div class="account">您的账号&nbsp;"<span class="info">{{account}}</span>"&nbsp;已被合作方邀请</div>
            <div>请设定密码入驻即可</div>
          </div>
        </div>
        <div v-else class="mobile">
          你的小亚通账号：
          <span class="info">
            {{account}}
          </span>
        </div>
      </el-form-item>
      <el-form-item label="密码" prop="password" class="psw">
      <el-input :type="showPsw" v-model.trim="regForm.password" placeholder="由字母、数字、符号任意组合的6-12位密码" auto-complate="off"></el-input>
      <div class="showpsw"><i :class="showCode" @click="showPswToggle"></i></div>
    </el-form-item>
      <el-form-item label="商家名称" prop="name">
        <el-input v-model.trim="regForm.name" placeholder="如罗辑思维，吴晓波频道" autofocus></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input v-model.trim="regForm.contact" placeholder="如罗胖，吴老师" @keyup.enter.native="regNext('regForm')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="8" :offset="16">
            <el-button type="primary" style="width:100%;" @click="regNext('regForm')">下一步</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import {
  contactsCheck, pswCheck
} from '../../assets/validatorEnum.js'
import debounce from 'lodash/debounce'
export default {
  name: 'complate-ship',
  data() {
    var nameCheck = function(rule, value, callback) {
      if (!value) {
        return callback(new Error('租户名称不能为空'));
      }
      axios.post('/noLogin/tenantEnter/getTenantByName', {
        name: value
      })
        .then(res => {
          if (res.data) {
            if (window.sessionStorage.name === value) {
              return callback();
            } else {
              return callback(new Error('该名称已存在'));
            }
          } else {
            return callback();
          }
        })
    };
    return {
      account: '',
      showToggle: false,
      enterTitle: '',
      regForm: {
        name: '',
        contact: '',
        password: ''
      },
      rules: {
        name: [{
          validator: nameCheck,
          trigger: 'formSubmit'
        }],
        contact: [{
          validator: contactsCheck,
          trigger: 'formSubmit'
        }],
        password: [{
          validator: pswCheck,
          trigger: 'formSubmit'
        }]
      }
    }
  },
  methods: {
    regNext: debounce(function(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let appKey;
          let query = {};
          if (window.sessionStorage.appKey) {
            appKey = JSON.parse(window.sessionStorage.appKey);
            query.code = appKey.code;
            query.state = appKey.state;
          }
          query.enterpriseTitle = this.regForm.name;
          query.contacts = this.regForm.contact;
          query.mobile = window.sessionStorage.getItem('account');
          query.password = this.regForm.password;
          axios.post('/noLogin/operLogin/register', query)
            .then(res => {
              if (res.data) {
                this.$router.push('/register/regComplate')
              }
            })
            .catch(err => {
              this.$message.error({
                message: err.response ? err.response.data : err
              })
            })
        }
      })
    }, 1000, {
      leading: true,
      trailing: false
    }),
    showPswToggle() {
      this.showToggle = !this.showToggle
    },
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
    this.$refs['regForm'].resetFields();
    this.regForm.contact = window.sessionStorage.contact;
    this.regForm.name = window.sessionStorage.name;
    this.enterTitle = window.sessionStorage.name;
    this.account = window.sessionStorage.getItem('account');
    console.log(12)
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.form {
  width: 400px;
  margin: 0 auto;
.data{
  position: relative;
  top:15px;
  .account {
    position: relative;
    top:16px;
  }
}
  a {
    color: @blue;
  }
  .info {
    color: #F90;
  }
  .mobile {
    position: relative;
    top:10px;
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
