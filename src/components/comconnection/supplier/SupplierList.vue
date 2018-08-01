<template>
  <div class="supplierList">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>我的供应商</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input placeholder="输入供应商名称" v-model.trim="supplier"  @keyup.enter.native="search()">
      <template slot="append">
        <el-button @click="search()">搜索供应商</el-button>
      </template>
    </el-input>
    <div class="nav_right"><span class="invite_icon" @click="invite()"><i class="icon iconfont icon-yaoqinggongyingshang yaoqing"></i>邀请供应商</span></div>
    <div class="head">
      <div class="list-head">
        <div class="supplier textCenter">供应商名称</div>
        <div class="contact">联系人/联系方式</div>
        <!-- <div class="prodType textCenter">销售品类</div> -->
        <div class="prodSaling">在售商品</div>
        <!-- <div class="financeRule">结算规则</div> -->
        <div class="contract">合同</div>
        <div class="status">合作状态</div>
        <div class="operation textCenter">操作</div>
      </div>
      <div class="list-action">
        <div class="check"></div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='convertData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <div v-if="isSearch">
      <div class="head marginTop10" v-if="convertData.amount > 0" v-loading="loading" element-loading-text="页面加载中...">
        <div class="list-head whiteBg" v-for="(data, i) in convertData.beanList">
          <div class="supplier">
            <span class="bold ellipsis">{{data.tenantFullInfo.tenantInfo.enterpriseTitle}}</span>
            <span v-if="data.tenantFullInfo.tenantInfo.isStore === 1" class="radiusBk" style="background-color:#99a9bf;color: #FFFFFF;">门店</span>
          </div>
          <div class="contact" v-text="data.tenantFullInfo.tenantInfo.contacts + '/' + data.tenantFullInfo.tenantInfo.mobile"></div>
          <!-- <div class="prodType">默认</div> -->
          <div class="prodSaling"><span class="bold">{{data.productNum}}</span> 件</div>
          <!-- <div class="financeRule"><span class="bold">{{data.ruleNum}}</span> 个</div> -->
          <div class="contract"><span class="bold">0</span> 个</div>
          <div class="status">
            <span v-if="data.tenantFullInfo.association.assocStatus === 1" class="radiusBk" style="background-color:#71A834;color: #FFFFFF;">合作中</span>
            <span v-else-if="data.tenantFullInfo.association.assocStatus === 0" class="radiusBk" style="background-color:#F5A623;color: #FFFFFF;">待确认</span>
          </div>
          <div class="operation batchBtn textRight">
            <!-- <el-button size="small" type="primary" @click="unAssocTenant(data.tenantFullInfo.association.assocId)">解除合作</el-button> -->
            <el-button size="small" type='primary' v-if="data.tenantFullInfo.association.assocStatus === 0 && data.tenantFullInfo.association.applyTenantId !== jurisdiction.tenantId" @click="acceptChannel(data.tenantFullInfo.association.applyTenantId)">接受邀请</el-button>
            <el-button size="small" type="primary" @click="matchProd(data.tenantFullInfo.tenantInfo.isStore, data.tenantFullInfo.tenantInfo.tenantId)">关联商品</el-button>
            <el-button size="small" @click="showDetail(data)">结算规则</el-button>
          </div>
        </div>
      </div>
      <searchNull v-else></searchNull>
    </div>
    <pagination class="pl" :isShowSelect="false" :current-page="pageNumber" :page-sizes="[20, 50, 100]" :page-size="pageSize" :total="convertData.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
    <el-dialog v-model="showProdDialog" title="商品选择" size="small" top="10%" :lock-scroll="true" :close-on-click-modal="false">
      <prodSelectDialog @cancel="cancel" @confirm="confirm"></prodSelectDialog>
    </el-dialog>
  </div>
</template>
<script>
import Paging from '../../common/Paging';
import Pagination from '../../common/Pagination';
import axios from 'axios'
import ProdSelectDialog from '../../Prod/ProdSelectDialog';
import {
  mapGetters
} from 'vuex'
export default {
  name: 'supplier',
  data() {
    return {
      loading: true,
      showProdDialog: false,
      pageNumber: 1,
      pageSize: 20,
      isSearch: false,
      supplier: '',
      assoSupplierId: '',
      convertData: {},
    }
  },
  methods: {
    sizeChangeHandler(val) {
      this.pageSize = val;
      this.search();
    },
    currentChangeHandler(val) {
      this.pageNumber = val;
      this.search();
    },
    search() {
      this.loading = true;
      let query = {
        queryCondition: {
          enterpriseTitle: this.supplier,
          assocStatus: [0, 1],
          querySupplier: 1,
        },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      axios.post('/customer/tenantInfo/queryIntegrationTenant', query)
        .then(res => {
          this.convertData = res.data;
          this.isSearch = true;
          this.loading = false;
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          });
          this.loading = false;
        })
    },
    //  详情跳转
    showDetail(row) {
      window.sessionStorage.supplierInfo = JSON.stringify(row);
      this.$router.push({
        path: '/supplierDetail',
        query: {
          // supplierTenantId: row.tenantFullInfo.tenantInfo.tenantId
        }
      });
    },
    acceptChannel(tenantId) {
      var _self = this;
      var data = {
        assocStatus: 1,
        partnerTenantId: tenantId
      }
      this.axios.post('/customer/tenantInfo/approvalPartner', data).then(function(response) {
        _self.$message({
          message: '恭喜你，接受邀请成功',
          type: 'success'
        });
        _self.search();
      }).catch(function(error) {
        _self.$message.error(error.response.data);
      });
    },
    invite() {
      // this.$message.info('新版本开发中Orz！！！');
      // return;
      // if (!this.shopNum) {
      //   this.$message.error({
      //     message: '邀请供应商前，请先添加至少一个店铺！'
      //   })
      //   return false
      // }
      this.$router.push('/inviteSupplier')
    },
    matchProd(supplierType, supplierId) {
      // 供应商关联商品
      if (supplierType === 1) {
        this.$confirm('检测到当前供应商类型为门店，多门店订单不需要单独关联商品，如果此处进行了“关联商品”操作，那么关联的商品将只能由该门店发货，其他门店将无法发货，请勿轻易操作!', '重要提醒！', {
          confirmButtonText: '继续关联',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.assoSupplierId = supplierId;
          this.showProdDialog = true;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else {
        this.assoSupplierId = supplierId;
        this.showProdDialog = true;
      }
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
        supplierTenantId: this.assoSupplierId,
        offeringNames: offeringNames,
      }).then(() => {
        this.$message.success('关联成功');
        this.showProdDialog = false;
        this.search();
      }).catch(err => {
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    // unAssocTenant(assocId) {
    //   let me = this;
    //   this.$confirm('您确定要取消和该供应商的合作吗？取消后如果再需要合作，需要通过系统重新邀请！', '重要提醒！', {
    //     confirmButtonText: '继续取消',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     axios.post('/customer/shopInfo/unAssocTenant', {
    //       assocId: assocId
    //     }).then(() => {
    //       me.$message.success('取消成功');
    //       me.search();
    //     }).catch(err => {
    //       me.$msgbox({
    //         message: '操作失败，' + (err.response ? err.response.data : err),
    //         type: 'error',
    //       })
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消操作'
    //     });
    //   });
    // }
  },
  components: {
    Paging,
    Pagination,
    ProdSelectDialog
  },
  computed: {
    ...mapGetters([
      'ichannel',
      'jurisdiction'
    ]),
    // shopNum() {
    //   return Object.keys(this.$store.state.enumSet.shopEnum).length;
    // }
  },
  // beforeRouteLeave(to, from, next) {
  //   // this.search('', 1, 10, true);
  //   this.supplier = '';
  //   next();
  // },
  activated() {
    this.supplier = '';
    this.search();
  },
}
</script>
<style lang="less" scoped>
@import '../../../main.less';
.supplierList {
  padding: @baseSpace * 3;
}
.nav_right {
  float: right;
}
.invite_icon {
  font-size: 14px;
  color: @darkGary;
  cursor: pointer;
  float: right;
  margin: @normalSize @normalSize 0;
  .yaoqing {
    margin-right: 5px;
    font-size: 22px;
  }
}
.head {
  border: solid 1px @borderLine;
  margin-top: @baseSpace * 4;
  margin-bottom: @baseSpace * 2;
  &:nth-child(3) {
    margin-top: @baseSpace * 2;
  }
}

.list-head {
  background-color: @tabBg;
  display: flex;
  font-size: @fontSize14;
  padding: 0 @baseSpace * 3;
  min-height: @baseSpace * 8;
  line-height: @baseSpace * 8;
  &:not(:first-child) {
    border-top: 1px solid @borderLine;
  }
  > div:not(:first-child) {
    margin-left: @baseSpace * 3;
  }
  .supplier {
    flex-basis: 30%;
    margin-left: @baseSpace;
    overflow:hidden;
    text-overflow:ellipsis; 
  }
  .textCenter {
    text-align: center;
  }
  .textRight {
    text-align: right;
  }
  .contact {
    flex-basis: 15%;
    text-align: center;
    overflow:hidden;
    text-overflow:ellipsis; 
  }
  .prodType {
    flex-basis: 15%;
    margin-left: @baseSpace;
  }
  .prodSaling {
    flex-basis: 10%;
    text-align: center;
  }
  .contract {
    flex-basis: 8%;
    text-align: center;
  }
  .status {
    flex-basis: 10%;
    text-align: center;
  } 
  .operation {
    flex-basis: 25%;
  }
}

.list-action {
  padding: @baseSpace + 3px 0 0 @baseSpace * 3;
  display: flex;
  border-top: 1px solid @borderLine;
  align-items: baseline;
  height: @baseSpace * 8;
  .paging {
    padding: 0 @baseSpace * 2;
  }
  .check {
    flex-grow: 1;
  }
}

.bold {
  font-weight: bold;
}

.ellipsis {
  overflow:hidden;
  text-overflow:ellipsis; 
}

.whiteBg {
  background-color: @white;
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}

.marginTop10 {
  margin-top: 10px;
  .list-head {
    div {
      font-size: @baseFont;
    }
  }
}

.radiusBk {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 12px;
}
</style>
<style lang="less">
@import '../../../main.less';
.supplierList {
  .el-input {
    width: 320px;
    .el-input-group__append {
      width: 85px;
      background-color: @borderLine;
      border-color: @borderLine;
      color: @lightBlack;
      text-align: center;
      .el-button {
        width: 85px;
        padding: 0;
        height: 30px;
      }
    }
    input {
      height: 30px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-color: @borderLine;
    }
  }
}
.batchBtn {
  .el-button {
    padding-top: 5.5px;
    padding-bottom: 5.5px;
    border-radius: 0;
  }
}
</style>
