<template>
  <div class="password">
    <el-row>
      <span class="fl">当前位置 :</span>
      <el-breadcrumb separator=">" class="fl" style="margin: 3px 0 0 5px;">
        <el-breadcrumb-item :to="{path: '/accountSet'}">账号设置</el-breadcrumb-item>
        <el-breadcrumb-item>重设密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <p>重设密码</p>
    <el-form :model="setPassword" :rules="rules" ref="setPassword" label-width="70px" v-loading="loading" element-loading-text="修改中...">
      <!-- 防止浏览器自动填入账号密码 -->
      <input style="display:none" type="text" name="fakeusernameremembered"/>
      <input style="display:none" type="password" name="fakepasswordremembered"/>
      <el-form-item label="旧密码" prop="oldLoginPass" class="psw">
        <el-input v-model.trim="setPassword.oldLoginPass" :type="showPsw" auto-complate="off"></el-input>
        <div class="showpsw"><i :class="showCode" @click="showPswToggle"></i></div>
      </el-form-item>
      <el-form-item label="新密码" prop="newLoginPass" class="psw">
        <el-input v-model.trim="setPassword.newLoginPass" :type="showPswT" auto-complate="off"></el-input>
        <div class="showpsw"><i :class="showCodeT" @click="showPswToggleT"></i></div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="large" style="width:100%;" @click="confirm">确认重设</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import {
  pswCheck
} from '../../assets/validatorEnum.js'
export default {
  name: 'account-psw',
  data() {
    return {
      loading: false,
      showToggle: false,
      showToggleT: false,
      setPassword: {
        oldLoginPass: '',
        newLoginPass: ''
      },
      rules: {
        oldLoginPass: [{
          validator: pswCheck,
          trigger: 'formSubmit'
        }],
        newLoginPass: [{
          validator: pswCheck,
          trigger: 'formSubmit'
        }]
      }
    }
  },
  methods: {
    showPswToggle() {
      this.showToggle = !this.showToggle
    },
    showPswToggleT() {
      this.showToggleT = !this.showToggleT
    },
    confirm() {
      this.$refs['setPassword'].validate(valid => {
        if (valid) {
          this.loading = true;
          axios.post('/sysmgnt/operator/updateLoginPass', this.setPassword)
            .then(res => {
              if (res.data) {
                this.$message.success({
                  message: '修改成功!'
                });
                this.$refs['setPassword'].resetFields();
                this.loading = false;
                // this.$router.push('/accountSet');
              }
            })
            .catch(err => {
              this.$message.error({
                message: err.response ? err.response.data : err
              })
              this.$refs['setPassword'].resetFields();
              this.loading = false;
            })
        }
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
    },
    showCodeT() {
      let icon = 'icon iconfont icon-iconfont32pxmimabukejian';
      if (this.showToggleT) {
        icon = 'icon iconfont icon-mimakejian';
      }
      return icon;
    },
    showPswT() {
      let type = 'text';
      if (!this.showToggleT) {
        type = 'password';
      }
      return type;
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.password {
  padding: 15px;
  width: 445px;
  p {
    font-size: 18px;
    height: 46px;
    margin-bottom: @smallSize;
    margin-top: @normalSize;
    line-height: 46px;
    color: @lightBlack;
  }
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

.fl {
    color: @lightGary;
    float: left;
    font-size: 12px;
  }
</style>
