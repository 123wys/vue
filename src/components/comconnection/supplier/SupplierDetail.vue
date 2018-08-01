<template>
  <div class="supplierDetail">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/supplierList'}">我的供应商</el-breadcrumb-item>
      <el-breadcrumb-item>供应商详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="basicInfo">
      <div class="supplierLogo">
        <img v-if='convertData.tenantFullInfo.tenantInfo.logoUrl' :src="convertData.tenantFullInfo.tenantInfo.logoUrl" alt="Logo" @error='imgErrorHandler(convertData.tenantFullInfo.tenantInfo)'>
        <img v-else :src='HeadLogo' alt="企业logo">
      </div>
      <div class="infodetail">
        <div>
          <span class="supplierName">{{convertData.tenantFullInfo.tenantInfo.enterpriseTitle}}</span>
          <span class="tenantType">供应商</span>
          <span v-if="convertData.tenantFullInfo.association.assocStatus === 1" class="relation">合作中</span>
          <span v-if="convertData.tenantFullInfo.association.assocStatus === 0" class="pending">待确认</span>
          <el-button size="small" type="text" @click="unAssocTenant(convertData.tenantFullInfo.association.assocId)">解除合作</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
          <router-link to='supplierUpdate' class='edit-user'><span class="icon iconfont icon-iconbianji editIcon"><span style="font-size:14px;">编辑</span></span></router-link>
        </div>
        <div>
          <div class="infoLeft">
            <div class="everyRow">
              <span class="flexLeft">联系人：</span>
              <span class="fontBold">{{convertData.tenantFullInfo.tenantInfo.contacts}}</span>
            </div>
            <div class="everyRow">
              <span class="flexLeft">手机号：</span>
              <span class="fontBold">{{convertData.tenantFullInfo.tenantInfo.mobile}}</span>
            </div>
            <div class="everyRow">
              <span class="flexLeft">固定电话：</span>
              <span class="fontBold">{{convertData.tenantFullInfo.tenantInfo.telephone}}</span>
            </div>
            <div class="everyRow">
              <span class="flexLeft">传真：</span>
              <span class="fontBold">{{convertData.tenantFullInfo.tenantInfo.fax}}</span>
            </div>
            <div class="everyRow">
              <span class="flexLeft">办公地址：</span>
              <span class="fontBold">
                {{convertData.tenantFullInfo.tenantInfo.locProvince}}&nbsp;{{convertData.tenantFullInfo.tenantInfo.locCity}}&nbsp;{{convertData.tenantFullInfo.tenantInfo.locDistrict}}&nbsp;{{convertData.tenantFullInfo.tenantInfo.locAddress}}
              </span>
            </div>
          </div>
          <div class="infoRight">
            <div class="everyRow">
              <span class="flexLeft">在售商品：</span>
              <span class="fontBold">{{convertData.productNum}}</span>
            </div>
            <div class="everyRow">
              <span class="flexLeft">结算规则：</span>
              <span class="fontBold">{{convertData.ruleNum}}</span>
            </div>
            <div class="everyRow">
              <span class="flexLeft">合同：</span>
              <span class="fontBold">0</span>
            </div>
            <div class="everyRow">
              <span class="flexLeft">邀请时间：</span>
              <span class="fontBold">{{convertData.tenantFullInfo.association.createTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="rightBtn">
        <el-button type="text" @click="matchProd()">
          <i class="icon iconfont icon-guanlianshangpin"></i>&nbsp;<span>关联商品</span>
        </el-button>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="商品" name="first">
          <supplierProdList></supplierProdList>
        </el-tab-pane>
        <el-tab-pane label="结算规则" name="second">
          <financeRuleList :supplierId="supplierId" v-if="activeName === 'second'"></financeRuleList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog v-model="showProdDialog" title="商品选择" size="small" top="10%" :close-on-click-modal="false">
      <prodSelectDialog @cancel="cancel" @confirm="confirm"></prodSelectDialog>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import HeadLogo from '../../../assets/img/HeadLogo.png'
import FinanceRuleList from '../../Finance/FinanceRuleList';
import SupplierProdList from '../../Prod/SupplierProdList';
import ProdSelectDialog from '../../Prod/ProdSelectDialog';
import bus from '../../../store/bus.js';
export default {
  name: 'supplier-detail',
  data() {
    return {
      HeadLogo: HeadLogo,
      activeName: 'first',
      supplierId: '',
      supplierType: '',
      showProdDialog: false,
      convertData: {
        'productNum': 1,
        'ruleNum': 2,
        'tenantFullInfo': {
          'association': {
            'applyTenantId': 100000000096,
            'assocId': 100000000211,
            'assocStatus': 1,
            'assocTenantId': 100000000205,
            'createOp': 100000000009,
            'createTime': '2017-04-24 16:33:36',
            'doneTime': '2017-04-24 16:33:36',
            'inviteId': 100000000099,
            'tenantId': 100000000096
          },
          'tenantInfo': {
            'authType': 0,
            'contacts': '毕飞芳',
            'createOp': 100000000009,
            'createTime': '2017-04-24 16:33:36',
            'doneTime': '2017-04-24 16:33:36',
            'enterpriseTitle': '小毕良品',
            'isStore': 0,
            'mobile': '18206180568',
            'tenantClass': 0,
            'tenantId': 100000000205,
            'tenantType': 1,
            'logoUrl': ''
          }
        }
      }
    }
  },
  components: {
    FinanceRuleList,
    SupplierProdList,
    ProdSelectDialog
  },
  methods: {
    getTenantInfo() {
      if (window.sessionStorage.supplierInfo) {
        this.convertData = JSON.parse(window.sessionStorage.supplierInfo);
        this.supplierId = this.convertData.tenantFullInfo.tenantInfo.tenantId;
        this.supplierType = this.convertData.tenantFullInfo.tenantInfo.isStore;
      }
    },
    matchProd() {
      if (this.supplierType === 1) {
        this.$confirm('检测到当前供应商类型为门店，多门店订单不需要单独关联商品，如果此处进行了“关联商品”操作，那么关联的商品将只能由该门店发货，其他门店将无法发货，请勿轻易操作!', '重要提醒！', {
          confirmButtonText: '继续关联',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.showProdDialog = true;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else {
        this.showProdDialog = true;
      }
    },
    imgErrorHandler(offering) {
      offering.logoUrlSrc = HeadLogo;
    },
    cancel() {
      this.showProdDialog = false;
    },
    confirm(selectProds) {
      let offeringIds = [];
      let offeringNames = [];
      for (var i = 0; i < selectProds.length; i++) {
        offeringIds[i] = selectProds[i].offeringId;
        offeringNames[i] = selectProds[i].offeringName;
      }
      axios.post('/product/prodoffering/setProductSupplier', {
        offeringIds: offeringIds,
        supplierTenantId: this.supplierId,
        offeringNames: offeringNames,
      }).then(() => {
        this.$message.success('关联成功');
        this.showProdDialog = false;
        bus.$emit('supplierProdList');
      }).catch(err => {
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    editMsg() {
      this.$router.push({
        path: '/supplierUpdate',
        query: {
          tenantId: this.supplierId
        }
      });
    },
    unAssocTenant(assocId) {
      let me = this;
      this.$confirm('您确定要取消和该供应商的合作吗？取消后如果再需要合作，需要通过系统重新邀请！', '重要提醒！', {
        confirmButtonText: '继续取消',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post('/customer/shopInfo/unAssocTenant', {
          assocId: assocId
        }).then(() => {
          me.$message.success('取消成功');
          // me.search();
          me.$router.push({
            path: '/supplierList'
          });
        }).catch(err => {
          me.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    }
  },
  activated() {
    this.getTenantInfo();
  }
}
</script>
<style lang="less" scoped>
@import '../../../main.less';
.supplierDetail { 
  padding: @baseSpace * 3;
}
.basicInfo {
  width: 100%;
  border: 1px solid @borderLine;
  background: @pageBg;
  padding: @baseSpace*4 @baseSpace*4 @baseSpace*3 @baseSpace*4;
  margin-bottom: @baseSpace*4;
}
.supplierLogo {
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border: 1px solid @borderLine;
  border-radius: 50%;
  overflow: hidden;
  transition: box-shadow 0.5s;
  margin-right: 20px;
  img {
    font-size: 12px;
    width: 80px;
    height: 80px;
    text-align: center;
  }
}
.infodetail {
  overflow:hidden;
}
.supplierName {
  font-size: 24px;
}
.tenantType {
  height: @baseSpace*3;
  line-height: @baseSpace*3;
  font-size: 12px;
  margin-left: @baseSpace*3;
  padding-left: @baseSpace;
  padding-right: @baseSpace;
  background: @primaryBlue;
  color: @white;
  border-radius: 7.5px;
}
.relation {
  height: @baseSpace*3;
  line-height: @baseSpace*3;
  font-size: 12px;
  margin-left: @baseSpace;
  margin-right: @baseSpace*3;
  padding-left: @baseSpace;
  padding-right: @baseSpace;
  background: @successGreen;
  color: @white;
  border-radius: 7.5px;
}
.pending {
  height: @baseSpace*3;
  line-height: @baseSpace*3;
  font-size: 12px;
  margin-left: @baseSpace;
  margin-right: @baseSpace*3;
  padding-left: @baseSpace;
  padding-right: @baseSpace;
  background: @warningYellow;
  color: @white;
  border-radius: 7.5px;
}
.editIcon {
  font-size: 16px;
  color: @lightGary;
}
.infoLeft {
  width: 50%;
  float: left;
  margin-bottom: @baseSpace*3;
  padding-right: @baseSpace*20;
  border-right: 1px solid @borderLine;
  font-size: 12px;
  color: @lightGary;
}
.infoRight {
  width: 50%;
  float: right;
  margin-bottom: @baseSpace*3;
  padding-left: @baseSpace*6;
  font-size: 12px;
  color: @lightGary;
}
.fontBold {
  font-weight: bold;
  color: @baseGary;
  padding-left: 30px;
}

.everyRow {
  margin-top: @baseSpace*3;
  display: flex;
}

.flexLeft {
  flex-basis: 60px;
}

.rightBtn {
  position: absolute;
  right: 2%;
  z-index: 2;
  margin-bottom: 10px;
}

.edit-user {
  text-decoration: none;
  color: @primaryBlue!important;
}

</style>
