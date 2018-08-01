<template>
  <div class="invite">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item v-if="type === 1" :to="{path: '/myChannel'}">我的渠道商</el-breadcrumb-item>
      <el-breadcrumb-item v-else :to="{path: '/supplierList'}">我的供应商</el-breadcrumb-item>
      <el-breadcrumb-item v-if="type === 1">邀请渠道商</el-breadcrumb-item>
      <el-breadcrumb-item v-else>邀请供应商</el-breadcrumb-item>
    </el-breadcrumb>
    <!--   <el-tabs v-model="activeName" style="margin-top: 10px;">
      <el-tab-pane label="手动邀请" name="first"> -->
    <div class="form">
      <!-- <span class="h1">被邀请供应商基本信息</span> -->
      <p>请输入商家完整信息,邀请其入驻</p>
      <el-form class="inviteForm" label-width="90px" label-position="right" :model="inviteForm" ref="inviteForm" :rules="rules1" v-loading="loading" element-loading-text="发送邀请中，请稍后">
        <el-form-item label="商家名称" prop="enterpriseTitle">
          <el-autocomplete placeholder="商家名称" v-model.trim="inviteForm.enterpriseTitle" :fetch-suggestions="querySearchAsync" style="width:100%" :trigger-on-focus="false" @select="handleSelect">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model.trim="inviteForm.contacts" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.trim="inviteForm.mobile" @change="phoneInfo"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button size="large" type="primary" @click="invite">发送邀请</el-button>
          <el-button size="large" @click="goBack">返回</el-button>
        </el-form-item>
        <div class="info" v-if="tenantInfo.amount === 1"><i class="el-icon-warning"></i>该手机号已被“<span class="infoName" v-text="tenantInfo.beanList[0].enterpriseTitle"></span>”注册，<span class="use" @click="useIt">发送邀请</span> 或 重新输入</div>
      </el-form>
    </div>
    <!-- </el-tab-pane>
      <el-tab-pane label="在线邀请" name="second">
        <el-form label-width="80px" style="margin-top: 10px;" :model="onlineForm" ref="onlineForm">
          <el-row>
            <el-col :span="6">
              <el-form-item label="商家名称" prop="shopName">
                <el-input v-model="onlineForm.shopName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号" prop="shopPhone">
                <el-input v-model="onlineForm.shopPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="主营类目" prop="option">
                <el-select v-model="onlineForm.option" placeholder="全部">
                  <el-option v-for="item in options" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item>
                <el-button type="primary" size="small" style="width:68px;" @click="search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'assocStatus', order: 'descending'}">
          <el-table-column prop="enterpriseTitle" label="商家名称">
          </el-table-column>
          <el-table-column label="主营类目" prop="category">
            <template scope="scope">
              <div style="padding:10px 0 10px 0">
                <span v-for='item in scope.row.category'>{{item}}&nbsp;</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系人">
            <template scope="scope">
              <div style="padding:10px 0 10px 0">
                <div>{{scope.row.contacts}}</div>
                <div>{{scope.row.mobile}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="地址">
            <template scope="scope">
              <span>{{scope.row.locProvince}}{{scope.row.locCity}}{{scope.row.locDistrict}}{{scope.row.locAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="assocStatus">
            <template scope="scope">
              <el-button size="small" type="primary" :disabled="[0,1].includes(scope.row.assocStatus)" @click=sendInvite(scope.row)>发送邀请</el-button>
              <el-button size="small" @click="shopInfo(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <template slot="empty">
            <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sousuojieguoweikong"></use>
        </svg>
        <p>查询结果为空,请尝试其它条件</p>
          </template>
        </el-table> -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <el-row>
        <el-col :span="4"><i class="el-icon-warning icon_big"></i></el-col>
        <el-col :span="20">
          <el-row style="font-size: 20px;">确定发送邀请？</el-row>
          <el-row>商家 : <span v-text="tenantInfo.beanList[0].enterpriseTitle"></span></el-row>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogConfirm">确 定</el-button>
          </span>
    </el-dialog>
    <!--  <el-pagination style="float:right;margin-top:40px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" class='pagination' layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>
<script>
import axios from 'axios'
import {
  mobileCheck,
  contactsCheck,
  etCheck
} from '../../../assets/validatorEnum.js'
import debounce from 'lodash/debounce'
export default {
  name: 'inviteSupplier',
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
      dialogVisible: false,
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
          trigger: 'blur'
        }],
        contacts: [{
          validator: contactsCheck,
          trigger: 'blur'
        }],
        mobile: [{
          validator: mobileCheck,
          trigger: 'blur'
        }]
      },
      // options: [{
      //   value: '全部',
      //   label: '全部'
      // }, {
      //   value: '服装/鞋帽/配饰',
      //   label: '服装/鞋帽/配饰'
      // }, {
      //   value: '童装/玩具/孕产/母婴用品',
      //   label: '童装/玩具/孕产/母婴用品'
      // }, {
      //   value: '美妆/洗护/保健',
      //   label: '美妆/洗护/保健'
      // }, {
      //   value: '图书/影音/培训学习',
      //   label: '图书/影音/培训学习'
      // }, {
      //   value: '珠宝/眼镜/手表',
      //   label: '珠宝/眼镜/手表'
      // }, {
      //   value: '运动/户外/乐器',
      //   label: '运动/户外/乐器'
      // }, {
      //   value: '游戏/动漫/影视',
      //   label: '游戏/动漫/影视'
      // }, {
      //   value: '生鲜/零食/烟酒',
      //   label: '生鲜/零食/烟酒'
      // }, {
      //   value: '鲜花/宠物/农资',
      //   label: '鲜花/宠物/农资'
      // }, {
      //   value: '家居/厨具/家纺',
      //   label: '家居/厨具/家纺'
      // }, {
      //   value: '办公/DIY/五金电子',
      //   label: '办公/DIY/五金电子'
      // }, {
      //   value: '百货/收纳/家庭保健',
      //   label: '百货/收纳/家庭保健'
      // }, {
      //   value: '本地上门服务',
      //   label: '本地上门服务'
      // }, {
      //   value: '其他',
      //   label: '其他'
      // }, {
      //   value: '其他',
      //   label: '其他'
      // }],
      // onlineForm: {
      //   shopName: '',
      //   shopPhone: '',
      //   option: ''
      // },
      // tableData: [],
    }
  },
  computed: {
    type() {
      return this.$route.query.type;
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
      this.$refs.inviteForm.resetFields();
    },
    invite: debounce(function() {
      this.$refs.inviteForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let query = this.inviteForm;
          query.tenantType = 1;
          let inviteUrl = '';
          if (this.type === 1) {
            inviteUrl = '/customer/tenantInfo/inviteChannel';
          } else {
            inviteUrl = '/customer/tenantInfo/inviteTenant';
          }
          axios.post(inviteUrl, query)
            .then(res => {
              this.$message({
                showClose: false,
                message: '合作邀请已发送，请耐心等待对方回复',
                type: 'success',
                duration: 2000
              });
              this.$refs.inviteForm.resetFields();
              this.loading = false;
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
            if (res.data.beanList.length > 0) {
              this.tenantInfo = res.data;
            }
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
    // sendInvite(val) {
    //   this.supplier = val.enterpriseTitle;
    //   this.destTenantId = val.tenantId;
    //   this.dialogVisible = true;
    // },
    useIt() {
      this.dialogVisible = true;
    },
    dialogConfirm() { //  确认邀请框
      this.dialogVisible = false;
      let query = {};
      query.tenantType = 1;
      query.enterpriseTitle = this.tenantInfo.beanList[0].enterpriseTitle;
      query.contacts = this.tenantInfo.beanList[0].contacts;
      query.mobile = this.tenantInfo.beanList[0].mobile;
      query.inviteTenantId = this.tenantInfo.beanList[0].tenantId;
      let inviteUrl = '';
      if (this.type === 1) {
        inviteUrl = '/customer/tenantInfo/inviteChannel';
      } else {
        inviteUrl = '/customer/tenantInfo/inviteTenant';
      }
      axios.post(inviteUrl, query)
        .then(res => {
          this.$message({
            showClose: false,
            message: '邀请信息已发送,请提醒对方登录小亚通查看。',
            type: 'success',
            duration: 2000
          });
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          })
        })
      // axios.post('/customer/tenantInfo/assocTenant', {
      //   destTenantId: this.tenantInfo.beanList[0].tenantId
      // })
      //   .then(() => {
      //     // this.search();
      //     this.$message.success({
      //       message: '邀请信息已发送,请提醒对方登录小亚通查看。'
      //     })
      //   })
      //   .catch(err => {
      //     this.$message.error({
      //       message: err.response ? err.response.data : err
      //     })
      //   })
      this.$refs['inviteForm'].resetFields();
      this.tenantInfo = {
        amount: 0,
        beanList: [{
          enterpriseTitle: '',
        }]
      };
    },
    // shopInfo(val) {
    //   window.sessionStorage.channel = JSON.stringify(val);
    //   this.$router.push({
    //     path: '/channelDetail',
    //     query: {
    //       tenantId: val.tenantId,
    //       origin: 'inviteSupplier'
    //     }
    //   });
    // },
    querySearchAsync: debounce(function(queryString, cb) {
      let query = {
        queryCondition: {
          enterpriseTitle: queryString
        },
      }
      axios.post('/customer/tenantInfo/queryTenant', query)
        .then(res => {
          // console.log(res.data);
          let tableData = res.data.beanList;
          let values = [];
          for (let i = 0; i < tableData.length; i++) {
            values.push({
              value: tableData[i].enterpriseTitle
            });
          }
          cb(values);
          // let results = queryString ? values.filter(this.createStateFilter(queryString)) : values;
          // let results = values;
          // clearTimeout(this.timeout);
          // this.timeout = setTimeout(() => {
          // cb(results);
          // }, 500 * Math.random());
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
    // createStateFilter(queryString) {
    //   return (restaurant) => {
    //     return (restaurant.value.indexOf(queryString.toLowerCase()) !== -1 || restaurant.value.indexOf(queryString.toUpperCase()) !== -1);
    //   };
    // },
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
  // activated() {
  //   this.search();
  // },
  beforeRouteLeave(to, from, next) {
    this.$refs.inviteForm.resetFields();
    this.tenantInfo = {
      amount: 0,
      beanList: [{
        enterpriseTitle: '',
      }]
    };
    next();
  },
}
</script>
<style lang="less" scoped>
@import '../../../main.less';
.invite {
  padding: @normalSize;
  .form {
    width: 480px;
    position: relative;
    margin: @normalSize;
    // position: relative;
    // .h1 {
    //   font-size: 18px;
    //   font-weight: bold;
    p {
      font-size: 12px;
      color: #F93;
      margin: @smallSize 0;
    }
    .info {
      position: absolute;
      width: 390px;
      top: 155px;
      left: 500px;
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
  .icon {
    width: 100px;
    height: 100px;
  }
  .icon_big {
    font-size: 46px;
    color: #F93;
  }
}
</style>
