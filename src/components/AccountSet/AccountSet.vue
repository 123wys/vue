<template>
  <div class="set">
    <el-row>
      <span class="fl">当前位置 :</span>
      <el-breadcrumb separator=">" class="fl" style="margin: 3px 0 0 5px;">
        <el-breadcrumb-item :to="{path: '/accountSet'}">账号设置</el-breadcrumb-item>
        <!-- <el-breadcrumb-item v-if="show">{{goTo}}</el-breadcrumb-item> -->
      </el-breadcrumb>
    </el-row>
    <div class="account">
      <p>
        <span>小亚通账号：</span><span v-text="phone" class="phone"></span>
        <span class="link" @click="goToPhone">更换绑定手机</span>
        <span class="link" @click="goToPsw">修改密码</span>
      </p>
      <el-form :model="accountForm" ref="accountForm" :rules="rule" label-width="70px" v-loading="loading" element-loading-text="保存中...">
        <el-form-item label="昵称" prop="signName">
          <el-input v-model.trim="accountForm.signName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="QQ" prop="qq">
          <el-input v-model.trim="accountForm.qq"></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="accountForm.email"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" size="large" @click="save">保存</el-button>
          <el-button size="large" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-text="a"></div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import axios from 'axios'
import {
  mapGetters,
  mapActions,
} from 'vuex'
import {
  emailCheck
} from '../../assets/validatorEnum.js'
export default {
  name: 'account-set',
  data() {
    return {
      loading: false,
      a: '',
      accountForm: {
        signName: '',
        // qq: '',
        email: ''
      },
      rule: {
        email: [{
          validator: emailCheck,
          trigger: 'formSubmit'
        }]
      }
    }
  },
  methods: {
    ...mapActions([
      'getJurisdiction'
    ]),
    goBack() {
      this.$router.go(-1);
    },
    save: debounce(function() {
      this.$refs['accountForm'].validate(valid => {
        if (valid) {
          this.loading = true;
          let query = {};
          query.opId = this.jurisdiction.opId;
          query.opName = this.accountForm.signName;
          query.email = this.accountForm.email;
          query.loginName = this.jurisdiction.loginName;
          query.isAdmin = this.jurisdiction.isAdmin;
          query.mobile = this.jurisdiction.mobile;
          query.effectiveDate = this.jurisdiction.effectiveDate;
          query.expiredDate = this.jurisdiction.expiredDate;
          query.passwdCycleDay = this.jurisdiction.passwdCycleDay;
          console.log(query)
          axios.post('/sysmgnt/operator/updateOperator', query).then(res => {
            if (res.data) {
              this.getJurisdiction(this);
              this.$message.success({
                message: '保存成功!'
              })
              this.loading = false;
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
    goToPhone() {
      this.$router.push('/accountSet/account');
    },
    goToPsw() {
      this.$router.push('/accountSet/psw');
    },
    initForm() {
      // this.phone = this.jurisdiction.loginName;
      this.accountForm.signName = this.jurisdiction.opName;
      this.accountForm.email = this.jurisdiction.email;
    },
    getInfo() {
      axios.get('/sysmgnt/operator/getCurrentOperator').then(res => {
        this.accountForm.signName = res.data.opName;
        this.accountForm.email = res.data.email;
      }).catch(err => {
        this.$message.error({
          message: err.response ? err.response.data : err
        });
      })
    }
  },
  computed: {
    ...mapGetters([
      'jurisdiction'
    ]),
    phone() {
      return this.jurisdiction.loginName;
    },
  },
  mounted() {
    this.initForm();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getInfo();
    })
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.set {
  padding: @largeSize;
  .account,
  .change,
  .psw {
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
  .account {
    .phone {
      margin-right: @largeSize;
    }
    .link {
      display: inline-block;
      min-width: 85px;
      height: 100%;
      font-size: 13px;
      color: @blue;
      text-decoration: underline;
      cursor: pointer;
      text-align: center;
      padding: 0 @smallSize;
    }
  }
}

.fl {
    color: @lightGary;
    float: left;
    font-size: 12px;
  }
</style>
