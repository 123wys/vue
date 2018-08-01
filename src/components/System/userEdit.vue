<template>
  <div class="user" v-loading="loading">
    <div class="form">
      <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm">
        <el-form-item label="昵称" prop="opName">
          <el-input v-model="ruleForm.opName" placeholder="输入昵称" autofocus></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="mobile">
          <el-input v-model="ruleForm.mobile" placeholder="输入手机号" :disabled="ruleForm.mobile===account ? true:false"></el-input>
        </el-form-item>
        <el-form-item label="初始化密码" prop="password" class="psw" v-if="isShow">
          <el-input :type="showPsw" v-model="ruleForm.password"
                    placeholder="由字母、数字组合的6-12位密码"></el-input>
          <div class="showpsw"><i :class="showCode" @click="showPswToggle"></i></div>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="ruleForm.roleIds" :disabled="ruleForm.mobile===account ? true:false" multiple
                     placeholder="选择角色(可多选)" style="width:380px;">
            <el-option
              v-for="(value, key) in $store.state.enumSet.operationRoleds"
              :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="cancel">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import dateFormat from 'dateFormat'
  import {passwordCheck} from '../../assets/validatorEnum.js'
  export default{
    props: ['userHouse', 'mode'],
    data() {
//     用户名验证
      let opNameCheck = function (rule, value, callback) {
        if (!value || !value.trim()) {
          return callback(new Error('用户名不能为空'));
        } else {
          return callback();
        }
      };
//      手机号验证
      let mobileCheck = function (rule, value, callback) {
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
//      角色验证
      let roleCheck = function (rule, value, callback) {
        if (!value.length) {
          return callback(new Error('角色不能为空'));
        } else {
          return callback();
        }
      };
      return {
        account: '',
        date: dateFormat(new Date(), `yyyy-mm-dd HH:MM:ss`),
        loading: false,
        showToggle: true,
        isShow: true,
        oldIds: [],
        roleId: [],
        ruleForm: {
          opId: '',
          opName: '',
          mobile: '',
          password: '',
          roleIds: [],
          isAdmin: ''
        },
        rules: {
          opName: [
            {validator: opNameCheck, trigger: 'formSubmit'}
          ],
          mobile: [
            {
              validator: mobileCheck,
            }
          ],
          password: [
            {
              validator: passwordCheck,
              trigger: 'formSubmit'
            }
          ],
          roleIds: [
            {
              validator: roleCheck,
              trigger: 'formSubmit'
            }
          ]
        }
      };
    },
    watch: {
      userHouse: {
        handler(val) {
          var a = JSON.stringify(val);
          var b = JSON.parse(a);
          var c = JSON.stringify(b.roleIds);
          this.oldIds = JSON.parse(c)
          for (var i = 0; i < b.roleIds.length; i++) {
            b.roleIds[i] = b.roleIds[i] + '';
          }
          this.ruleForm = b;
        },
        immediate: true,
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
    methods: {
      showPswToggle() {
        this.showToggle = !this.showToggle
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let query = {
              opName: this.ruleForm.opName,
              isAdmin: 0,
              loginName: this.ruleForm.mobile,
              loginPass: this.ruleForm.password,
              mobile: this.ruleForm.mobile,
              email: 'weei@i-boss.com',
              effectiveDate: dateFormat(new Date(), `yyyy-mm-dd HH:MM:ss`),
              expiredDate: this.date,
              passwdCycleDay: 30,
              roleIds: this.ruleForm.roleIds
            };
            let data = {
              opId: this.ruleForm.opId,
              opName: this.ruleForm.opName,
              isAdmin: this.ruleForm.isAdmin,
              mobile: this.ruleForm.mobile,
              email: 'weei@i-boss.cn',
              loginName: this.ruleForm.mobile,
              effectiveDate: dateFormat(new Date(), `yyyy-mm-dd HH:MM:ss`),
              expiredDate: this.date,
              passwdCycleDay: 30,
              oldRoleIds: this.oldIds,
              roleIds: this.ruleForm.roleIds
            }
            this.loading = true;
            if (!this.ruleForm.opId) {
              axios.post('/sysmgnt/operator/insertOperator', query).then(response => {
                this.loading = false;
                this.$message({
                  message: '添加工号成功！',
                  type: 'success',
                  duration: 500
                });
                this.$emit('success');
              }).catch(err => {
                this.loading = false;
                this.$message.error({
                  message: (err.response ? err.response.data : err)
                })
              })
            } else {
              axios.post('/sysmgnt/operator/updateOperator', data).then(response => {
                this.loading = false;
                this.$message({
                  message: '修改工号成功！',
                  type: 'success',
                  duration: 500
                });
                this.$emit('success');
              }).catch(err => {
                this.loading = false;
                this.$message.error({
                  message: (err.response ? err.response.data : err)
                })
              })
            }
          }
        });
      },
      cancel() {
        this.$emit('close');
      }
    },
    created() {
      this.account = window.localStorage.loginName;
      if (this.mode === 2) {
        this.isShow = false;
      }
      this.date = (parseInt(this.date.split('-').shift()) + 1) + this.date.substring(4, this.date.length - 1);
    }
  }
</script>

<style lang="less">
  @import '../../main.less';

  .user {
    padding: @normalSize;

  .form {
    width: 480px;
    margin: @normalSize;
    position: relative;
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
  .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
</style>
