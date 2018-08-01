<template>
  <div class="addSup">
    <p>添加您的供应商实现<em>订单分发</em>，<em>自营可跳过</em>此步：</p>
    <p class="subTitle">以下信息将作为供应商入驻信息请真实填写</p>
    <div class="form">
      <el-form class="inviteForm" label-width="90px" label-position="left" :model="inviteForm" ref="inviteForm" :rules="rules1" v-loading="loading" element-loading-text="发送邀请中，请稍后">
        <el-form-item label="供应商名称" prop="enterpriseTitle">
          <el-autocomplete placeholder="供应商名称" v-model.trim="inviteForm.enterpriseTitle" :fetch-suggestions="querySearchAsync" style="width:100%" :trigger-on-focus="false" @select="handleSelect" size='mini'>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model.trim="inviteForm.contacts" placeholder="真实姓名" size='mini'></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.trim="inviteForm.mobile" @change="phoneInfo" size='mini'></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button size="mini" type="primary" @click="invite">发送邀请</el-button>
        </el-form-item>
        <div class="info" v-if="tenantInfo.amount === 1"><i class="el-icon-warning"></i>该手机号已被“<span class="infoName" v-text="supplierName"></span>”注册，<span class="use" @click="dialogConfirm">发送邀请</span> 或 重新输入</div>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import {
  mobileCheck,
  contactsCheck,
  etCheck
} from '../../assets/validatorEnum.js'
import debounce from 'lodash/debounce'
export default {
  name: 'addSup',
  data() {
    return {
      loading: false,
      restaurants: '',
      tenantInfo: {
        amount: 0,
        beanList: [{
          enterpriseTitle: '',
        }]
      },
      // pageNumber: 1,
      // pageSize: 10,
      // total: 1,
      // activeName: 'first',
      // supplier: '',
      destTenantId: '',
      inviteForm: {
        enterpriseTitle: '',
        contacts: '',
        mobile: '',
        inviteTenantId: '',
      },
      rules1: {
        enterpriseTitle: [{
          validator: etCheck,
          trigger: 'formSubmit'
        }],
        contacts: [{
          validator: contactsCheck,
          trigger: 'formSubmit'
        }],
        mobile: [{
          validator: mobileCheck,
          trigger: 'formSubmit'
        }]
      },
    }
  },
  computed: {
    supplierName() {
      if (this.tenantInfo.beanList[0] && this.tenantInfo.beanList[0].enterpriseTitle) {
        return this.tenantInfo.beanList[0].enterpriseTitle
      } else {
        return ''
      }
    }
  },
  methods: {
    invite: debounce(function() {
      this.$refs.inviteForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let query = this.inviteForm;
          query.tenantType = 1;
          axios.post('/customer/tenantInfo/inviteTenant', query)
            .then(res => {
              if (res.data) {
                this.$message.success({
                  message: '邀请信息已发送给对方'
                })
                this.loading = false;
                var data = {
                  type: 0,
                  enterpriseTitle: this.inviteForm.enterpriseTitle
                }
                this.$emit('addSupSuccess', data);
                this.$refs.inviteForm.resetFields();
              }
            })
            .catch(err => {
              this.$message.error({
                message: err.response ? err.response.data : err
              })
              this.loading = false;
            })
        }
      })
    }, 1000, {
      leading: true,
      trailing: false
    }),
    phoneInfo(value) {
      let reg = new RegExp(/^[1][34578][0-9]{9}$/g);
      if (reg.test(value)) {
        let query = {
          queryCondition: {
            contactMobile: value
          },
          pageNumber: 1,
          pageSize: 10
        };
        axios.post('/customer/tenantInfo/queryTenant', query)
          .then(res => {
            this.tenantInfo = res.data;
          })
          .catch(err => {
            this.$message.error({
              message: err.response ? err.response.data : err
            })
          })
      } else {
        this.tenantInfo = {
          amount: 0,
          beanList: [{
            enterpriseTitle: '',
          }]
        };
      }
    },
    dialogConfirm() { //  确认邀请框
      axios.post('/customer/tenantInfo/assocTenant', {
        destTenantId: this.tenantInfo.beanList[0].tenantId
      })
      .then(() => {
        // this.search();
        var data = {
          type: 1,
          enterpriseTitle: this.supplierName
        }
        this.$emit('addSupSuccess', data);
        this.$refs['inviteForm'].resetFields();
        this.tenantInfo = {
          amount: 0,
          beanList: [{
            enterpriseTitle: '',
          }]
        };
        this.$message.success({
          message: '已发送'
        })
      })
      .catch(err => {
        this.$message.error({
          message: err.response ? err.response.data : err
        })
      })
    },
    querySearchAsync: debounce(function(queryString, cb) {
      let query = {
        queryCondition: {
          enterpriseTitle: queryString
        },
      }
      axios.post('/customer/tenantInfo/queryTenant', query)
        .then(res => {
          let tableData = res.data.beanList;
          let values = [];
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i] && tableData[i].enterpriseTitle) {
              values.push({
                value: tableData[i].enterpriseTitle
              });
            }
          }
          let results = queryString ? values.filter(this.createStateFilter(queryString)) : values;
          cb(results);
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          })
        })
    }, 500, {
      leading: false,
      trailing: true
    }),
    createStateFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString.toLowerCase()) !== -1 || restaurant.value.indexOf(queryString.toUpperCase()) !== -1);
      };
    },
    handleSelect(val) {
      let query = {
        name: val.value
      };
      axios.post('/customer/tenantInfo/getTenantByName', query)
      .then(res => {
        this.inviteForm.contacts = res.data.contacts;
        this.inviteForm.mobile = res.data.mobile;
        this.inviteForm.inviteTenantId = res.data.tenantId;
      })
      .catch(err => {
        this.$message.error({
          message: err.response ? err.response.data : err
        })
      })
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.addSup {
  .subTitle{
    color: @lightGary;
  }
  p {
    width: 300px;
    margin: 0 auto;
    font-size: 12px;
    text-align: left;
    margin-bottom: 5px;
    em {
      color: #000;
      font-style: normal;
      font-weight: bold;
    }
  }
}

.form {
  width: 300px;
  margin: 0 auto;
  // position: relative;
  // .h1 {
  //   font-size: 18px;
  //   font-weight: bold;
  p {
    font-size: 12px;
    color: #F93;
    margin: 0;
  }
  .inviteForm {
    position: relative;
  }
  .info {
    position: absolute;
    width: 390px;
    top: 127px;
    left: -25px;
    color: @neutralGary;
    i {
      color: @warningYellow;
    }
    .infoName {
      color: @warningYellow;
    }
    .use {
      color: @blue;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.el-form-item{
  margin-bottom: 10px;
}
.icon {
  width: 100px;
  height: 100px;
}

.icon_big {
  font-size: 46px;
  color: #F93;
}
</style>
