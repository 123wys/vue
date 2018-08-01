<template>
  <div class="suppProdList">
    <el-input v-model="prodName" placeholder="输入商品名称" @keyup.enter.native="queryProduct">
      <template slot="append">
        <el-button @click="queryProduct">搜索</el-button>
      </template>
    </el-input>
    <div class="tableData">
      <div class="head">
        <div class="prodName textIndent">商品名/规格</div>
        <div class="salePrice">销售价</div>
        <div class="buyPrice">采购价</div>
        <div class="financeRule">结算规则</div>
        <div class="action">操作</div>
      </div>
      <div class="tableaction batchBtn">
        <el-checkbox class="select-all" v-model="isSelectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        <div class="batchBtn">
          <el-button size="small" @click="batchActionHandle()">批量设置</el-button>
        </div>
        <paging class="paging" :page-size="pageSize" :page-number="pageNumber" :total='offeringData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <template v-if="offeringData && offeringData.amount">
      <div class="body" v-loading.body="loading" element-loading-text="拼命加载中...">
        <div class="prod" v-for="(offering,index) of offeringData.offeringList" :key="offering.outerOfferingId">
          <div class="prodmsg">
            <div class="title">
              <div class="title-left">
                <el-checkbox class="check" v-model="selects[index]"></el-checkbox>
                <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
                  <img :src="offering.imageFileName">
                  <img class="title-img" slot="reference" :src="offering.imageFileName" @error='imgErrorHandler(offering)'>
                </el-popover>
              </div>
              <div class="title-right">
                <div class="name" v-text="offering.offeringName"></div>
                <el-tag type="warning" v-if="offering.isPresale">预售</el-tag>
                <div class="shop"><svg class="icon iconfont" aria-hidden="true"><use :xlink:href="'#' + getIcon(offering.platformId).split(' ')[2]"></use></svg>{{shopEnum[offering.shopId]}}</div>
                <div class="catalog" v-text="offering.catalogName"></div>
              </div>
            </div>
            <div class="titleOperation">
              <el-button size="small" @click="prodAction(offering)">编辑</el-button>
            </div>
          </div>
          <div class="sku" v-for="sku of offering.skuList" :key="sku.outerId">
            <div class="title">
              <div class="title-left"></div>
              <div class="title-right">
                <div class="name" v-text="sku.skuCharSpec"></div>
                <div class="catalog">商家自编码：<span v-text="sku.outerId"></span></div>
              </div>
            </div>
            <div class="price" v-text="sku.price"></div>
            <div class="price">
              <span v-if="sku.ruleDetails && sku.ruleDetails[0].skuMatchings">{{sku.ruleDetails[0].skuMatchings[0].supplyPrice | numberFmt}}</span>
            </div>
            <div class="skuRule">{{sku | ruleNameCvt}}</div>
            <div class="action">
              <!-- <el-button size="small">编辑</el-button> -->
            </div>
          </div>
        </div>
      </div>
    </template>
    <searchNull v-else></searchNull>
    <pagination class="pl" v-model="isSelectAll" :indeterminate="isIndeterminate" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="offeringData.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex';
import axios from 'axios';
import Paging from '../common/Paging';
import Pagination from '../common/Pagination';
import imgerr from '../../assets/img/imgerror.png'
import bus from '../../store/bus.js';
export default {
  name: 'supplierProdList',
  // props: {
  //   activeName: '',
  //   supplierId: ''
  // },
  data() {
    return {
      pageNumber: 1,
      pageSize: 10,
      selects: [],
      offeringData: {
        amount: 0,
        offeringList: [],
      },
      prodName: '',
      loading: false,
    }
  },
  computed: {
    isSelectAll: {
      get() {
        return this.selects.length > 0 && this.selects.every(n => n);
      },
      set(val) {
        this.selects.forEach((n, i) => {
          this.selects.splice(i, 1, val);
        })
      }
    },
    sellectedIds() {
      // return this.offeringData.offeringList.filter((n, i) => this.selection[i]).map(n => n.ruleId);
      let sellectedIds = [];
      this.selects.forEach((n, i) => {
        if (n) {
          sellectedIds.push(this.offeringData.offeringList[i])
        }
      });
      return sellectedIds;
      // return this.offeringData.offeringList.filter((n, i) => this.selects[i]).map(n => n);
    },
    isIndeterminate() {
      return this.sellectedIds.length > 0 && this.sellectedIds.length < this.offeringData.offeringList.length;
    },
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
    ...mapState({
      supplierEnum: state => state.enumSet.supplierEnum,
      shopEnum: state => state.enumSet.shopEnum,
    })
  },
  methods: {
    currentChangeHandler(val) {
      this.pageNumber = val;
      this.queryProduct();
    },
    sizeChangeHandler(val) {
      this.pageSize = val;
      this.queryProduct();
    },
    batchActionHandle() {
      if (this.sellectedIds.length === 0) {
        this.$message.error('请至少选择一个商品！');
        return;
      }
      this.batchProdAction(this.sellectedIds);
    },
    imgErrorHandler(offering) {
      offering.imageFileName = imgerr;
    },
    queryProduct() {
      this.loading = true;
      // let state = this.activeName === 'first' ? 1 : 0;
      let query = {
        queryCondition: {
          nameOrOuterId: this.prodName,
          supplierTenantId: JSON.parse(window.sessionStorage.supplierInfo).tenantFullInfo.tenantInfo.tenantId
          // supplierTenantId: this.supplierId
        },
        querySettlementRule: 'true',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      axios.post('/product/prodoffering/queryProducts', query)
        .then(res => {
          this.loading = false;
          this.offeringData = res.data;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
    },
    getIcon(platformId) {
      if (this.$store.state.enumSet.platform[platformId] === undefined) {
        return 'icon iconfont icon-disanfangdianpu';
      }
      return this.$store.state.enumSet.platform[platformId];
    },
    prodAction(prod) {
      let prodArr = [];
      prodArr.push(prod);
      this.batchProdAction(prodArr);
    },
    batchProdAction(prodArr) {
      window.sessionStorage.prodArr = JSON.stringify(prodArr);
      if (prodArr && prodArr.length > 0) {
        this.$router.push({
          path: '/supplierProdAction'
        });
      }
    }
  },
  filters: {
    ruleNameCvt(sku) {
      if (typeof sku.ruleDetails !== 'undefined') {
        let ruleName = sku.ruleDetails[0].ruleName;
        return ruleName;
      }
      return '';
    },
    numberFmt(val) {
      if (typeof val !== 'undefined') {
        let s = parseFloat(val / 100).toFixed(2) + '';
        return s;
      }
      return '';
    }
  },
  components: {
    Paging,
    Pagination
  },
  mounted() {
    this.prodName = '';
    bus.$on('supplierProdList', this.queryProduct);
    this.queryProduct();
  },
  activated() {
    this.queryProduct();
  },
  watch: {
    offeringData: {
      handler(val) {
        let length = val.offeringList.length
        this.selects = new Array(length).fill(false);
      },
      immediate: true,
    }
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.el-input{
  width: 320px;
}

.tableData {
  margin-top: @baseSpace * 4;
  margin-bottom: @baseSpace * 2;
  border: solid 1px @borderLine;
  &:nth-child(3) {
    margin-top: @baseSpace * 2;
  }
}

.tableborder {
  border-left: solid 1px @borderLine;
  border-right: solid 1px @borderLine;
  border-top: solid 1px @borderLine;
}

.head {
  background-color: @tabBg;
  display: flex;
  font-size: @fontSize14;
  padding: 0 @baseSpace * 3;
  height: @baseSpace * 8;
  line-height: @baseSpace * 8;
  &:not(:first-child) {
    border-top: 1px solid @borderLine;
  }
  .prodName {
    flex-basis: 30%;
    margin-left: 15px;
  }
  .textIndent {
    text-indent: @baseSpace;
  }
  .salePrice {
    flex-basis: 10%;
    margin-left: 15px;
  }
  .buyPrice {
    flex-basis: 10%;
    margin-left: 15px;
  }
  .financeRule {
    flex-basis: 30%;
    margin-left: 15px;
  }
  .action {
    flex-basis: 20%;
    margin-right: 15px;
    text-align: end;
  }
}

.tableaction {
  padding: @baseSpace + 3px 0 0 @baseSpace * 3;
  display: flex;
  border-top: 1px solid @borderLine;
  align-items: baseline;
  height: @baseSpace * 8;
  .select-all {
    font-size: @baseFont;
  }
  .batchBtn,
  .paging {
    font-size: @baseFont;
    padding: 0 @baseSpace * 2;
  }
  .batchBtn {
    flex-grow: 1;
  }
  .paging {
    margin-left: 10px;
    border-left: solid 1px @borderLine;
  }
}

.body {
  background-color: @white;
}

.prod {
  border: solid 1px @borderLine;
  /*border-top: none;*/
  + .prod {
    border: solid 1px @borderLine;
    margin-top: @baseSpace*2;
  }
}

.prod:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.prodmsg {
  background-color: #e8f5ff;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.prodmsg,
.sku {
  display: flex;
  padding: @baseSize*2 @baseSize*3;
}

.sku {
  padding-left: @baseSize*3;
  .title {
    padding-left: 87px;
  }
}

.prodmsg + .sku {
  border-top: solid 1px @borderLine;
}

.sku + .sku {
  border-top: dashed 1px @borderLine;
}

.title {
  width: 30%;
  display: flex;
  .title-img {
    height: @prodImg;
    width: @prodImg;
    margin-right: @baseSize*2;
    display: block;
  }
  .title-left {
    display: flex;
    align-items: center;
    .check {
      margin-right: @baseSpace;
    }
  }
  .title-right {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    .name {
      width: 100%;
    }
    >*:not(:first-child) {
      margin-right: @baseSize;
    }
    .catalog {
      color: @darkGary;
    }
  }
}

.titleOperation {
  height: @prodImg;
  line-height: @prodImg;
  .el-button--small {
    border-radius: 0px;
  }
}

.price {
  width: 10%;
  text-align: left;
  padding-left: @baseSpace*3;
}

.skuRule {
  width: 30%;
  text-align: left;
  padding-left: @baseSpace*3;
}

.action {
  width: 20%;
  text-align: right;
  .el-button--small {
    border-radius: 0px;
  }
}

.foot {
  text-align: end;
  padding: @smallSize;
}

.dialog-body {
  text-align: center;
  > .el-select {
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}

.select {
  width: 100%;
}

.production-list .pl {
  padding-left: @baseSpace*3 + 1;
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}
</style>
<style lang="less">
@import '../../main.less';
.suppProdList {
  .batchBtn {
    .el-button {
      padding-top: 5.5px;
      padding-bottom: 5.5px;
      // border-radius: 0;
    }
  }
}
</style>
