<template>
  <div class="prodAction">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/supplierList'}">我的供应商</el-breadcrumb-item>
      <el-breadcrumb-item>商品设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="prodActionTitle">
      <span style="font-size:16px;font-weight: bold;">商品设置</span>&nbsp;
      <span>目前已选择<span style="color:#58B7FF;">&nbsp;{{prodArr.length}}</span>个商品</span>
    </div>
    <div class="tableData">
      <div class="head">
        <div class="prodName textIndent">商品名/规格</div>
        <div class="salePrice">销售价</div>
        <div class="buyPrice textCenter">采购价</div>
        <div class="financeRule textCenter">结算规则</div>
        <div class="action">操作</div>
      </div>
      <!-- <div class="tableaction batchBtn">
        <el-checkbox class="select-all" v-model="isSelectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        <div class="batchBtn">
          <el-button size="small" @click="batchActionHandle('plzf')">批量设置</el-button>
        </div>
      </div> -->
    </div>
    <template>
      <div class="prod" v-for="(offering,index) in prodArr" :key="offering.outerOfferingId">
        <div class="prodmsg">
          <div class="title">
            <div class="title-left">
              <!-- <el-checkbox class="check" v-model="selects[index]"></el-checkbox> -->
              <div class="check"></div>
              <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
                <img :src="offering.imageFileName">
                <img class="title-img" slot="reference" :src="offering.imageFileName" @error='imgErrorHandler(offering)'>
              </el-popover>
            </div>
            <div class="title-right">
              <div class="name" v-text="offering.offeringName"></div>
              <el-tag type="warning" v-if="offering.isPresale">预售</el-tag>
              <div class="shop"><i :class="getIcon(offering.platformId)"></i>{{shopEnum[offering.shopId]}}</div>
              <div class="catalog" v-text="offering.catalogName"></div>
            </div>
          </div>
          <div class="price"></div>
          <div class="price textCenter">
            <el-input v-model.trim="offering.supplyPrice" @blur="setSkuPrice(offering)"></el-input>&nbsp;元
          </div>
          <div class="skuRule textCenter"></div>
          <div class="action"><el-button size="small" @click="batchSetRule(index)">选择规则</el-button></div>
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
          <div class="price textCenter">
            <el-input v-model="sku.supplyPricee"></el-input>&nbsp;元
          </div>
          <div class="skuRule textCenter">
            <!-- <el-select v-model="sku.ruleId" placeholder="全部">
              <el-option v-for="item in ruleSelectList" :label="item.ruleName" :value="item.rule.ruleId" :key="item.rule.ruleId"></el-option>
            </el-select> -->
            <span>{{sku.ruleName}}</span>
            <!-- <el-input placeholder="点击右侧编辑规则按钮选择结算规则" :disabled="true" v-model="sku.ruleName"></el-input> -->
          </div>
          <div class="action">
            <el-button size="small" @click="showRuleSelect(sku)">选择规则</el-button>
          </div>
        </div>
      </div>
    </template>
    <div class="footOper">
      <el-button type="primary" size="small" @click="skuMatchRule()">确定</el-button>&nbsp;
      <el-button size="small" @click="resetData()">取消</el-button>
    </div>
    <ruleName-dialog :dialog="showRuleSelectDialog" @cancel="cancel" @confirm="confirm"></ruleName-dialog>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex';
import axios from 'axios';
// import Paging from '../common/Paging';
// import Pagination from '../common/Pagination';
import imgerr from '../../assets/img/imgerror.png'
import ruleNameDialog from '../Finance/ruleNameDialog'
export default {
  name: 'supplierProdList',
  props: ['activeName', 'supplierId'],
  data() {
    return {
      // pageNumber: 1,
      // pageSize: 10,
      showRuleSelectDialog: false,
      selectOffer: '',
      prodName: '',
      loading: false,
      prodArr: [],
      ruleSelectList: [],
      matchRuleList: [],
      currentSku: {},
      // batchRuleName: '',
      // batchRuleId: '',
      isBatchSet: false,
    }
  },
  computed: {
    ...mapState({
      supplierEnum: state => state.enumSet.supplierEnum,
      shopEnum: state => state.enumSet.shopEnum,
    }),
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
  },
  methods: {
    imgErrorHandler(offering) {
      offering.imageFileName = imgerr;
    },
    getIcon(platformId) {
      return this.$store.state.enumSet.platform[platformId];
    },
    resetData() {
      // for (var o = 0; o < this.prodArr.length; o++) {
      //   for (var p = 0; p < this.prodArr[o].skuList.length; p++) {
      //     this.prodArr[o].skuList[p].ruleId = '';
      //     this.prodArr[o].skuList[p].ruleName = '';
      //   }
      // }
      this.$router.push({
        path: '/supplierDetail',
        query: {
          supplierTenantId: JSON.parse(window.sessionStorage.supplierInfo).tenantFullInfo.tenantInfo.tenantId
        }
      });
    },
    skuMatchRule() {
      this.matchRuleList.splice(0, this.matchRuleList.length);
      for (var i = 0; i < this.prodArr.length; i++) {
        let skuList = this.prodArr[i].skuList;
        let supplierTenantId = this.prodArr[i].supplierTenantId;
        for (var j = 0; j < skuList.length; j++) {
          let matchRuleObj = {};
          matchRuleObj.offeringId = skuList[j].offeringId;
          matchRuleObj.skuId = skuList[j].skuId;
          matchRuleObj.shopId = skuList[j].shopId;
          matchRuleObj.supplierTenantId = supplierTenantId;
          // matchRuleObj.supplyPrice = parseFloat(skuList[j].supplyPricee) * 100;
          if (skuList[j].supplyPricee !== '') {
            matchRuleObj.supplyPrice = parseInt(100 * (skuList[j].supplyPricee * 1000) / 1000);
          } else {
            matchRuleObj.supplyPrice = '';
          }
          // matchRuleObj.supplyPrice = parseInt(100 * (skuList[j].supplyPricee * 1000) / 1000);
          matchRuleObj.ruleId = skuList[j].ruleId;
          this.matchRuleList.push(matchRuleObj);
        }
      }
      let sendFlag = true;
      if (this.matchRuleList.length > 0) {
        for (var k = 0; k < this.matchRuleList.length; k++) {
          if (!this.matchRuleList[k].ruleId) {
            sendFlag = false;
            this.$message.info('请给所有商品选择规则！');
            break;
          }
        }
      }
      if (sendFlag) {
        // let skuMatchings = this.matchRuleList;
        let query = {
          skuMatchings: this.matchRuleList
        }
        axios.post('/finance/rule/NewMatchingSettlementRule', query)
        .then(res => {
          this.$message.info('操作成功！');
          this.$router.push({
            path: '/supplierDetail'
          });
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
      }
    },
    showRuleSelect(sku) {
      if (sku) {
        this.currentSku = sku;
      }
      this.showRuleSelectDialog = true;
    },
    batchSetRule(offering) {
      this.selectOffer = offering;
      this.isBatchSet = true;
      this.showRuleSelectDialog = true;
    },
    cancel() {
      this.showRuleSelectDialog = false;
    },
    confirm(selectRule) {
      if (this.isBatchSet && selectRule) {
        // this.batchRuleName = selectRule.ruleName;
        // this.batchRuleId = selectRule.rule.ruleId;
        for (var i = 0; i < this.prodArr[this.selectOffer].skuList.length; i++) {
          this.prodArr[this.selectOffer].skuList[i].ruleName = selectRule.ruleName;
          this.prodArr[this.selectOffer].skuList[i].ruleId = selectRule.rule.ruleId;
        }
        this.isBatchSet = false;
      }
      if (this.currentSku && selectRule) {
        this.currentSku.ruleName = selectRule.ruleName;
        this.currentSku.ruleId = selectRule.rule.ruleId;
        this.showRuleSelectDialog = false;
      } else {
        this.$message.info('请重试');
      }
    },
    setSkuPrice(offering) {
      let offerPrice = offering.supplyPrice;
      for (var i = 0; i < offering.skuList.length; i++) {
        offering.skuList[i].supplyPricee = offerPrice;
      }
      // if (offerPrice !== '') {
      //   for (var i = 0; i < offering.skuList.length; i++) {
      //     offering.skuList[i].supplyPrice = offerPrice;
      //   }
      // }
    }
  },
  components: {
    ruleNameDialog
  },
  activated() {
    if (window.sessionStorage.prodArr) {
      // 给每个sku增加规则id属性
      let tempArr = JSON.parse(window.sessionStorage.prodArr);
      if (tempArr.length > 0) {
        for (var m = 0; m < tempArr.length; m++) {
          tempArr[m].supplyPrice = '';
          for (var n = 0; n < tempArr[m].skuList.length; n++) {
            if (typeof tempArr[m].skuList[n].ruleDetails !== 'undefined') {
              tempArr[m].skuList[n].ruleId = tempArr[m].skuList[n].ruleDetails[0].rule.ruleId;
              tempArr[m].skuList[n].ruleName = tempArr[m].skuList[n].ruleDetails[0].ruleName;
              if (typeof tempArr[m].skuList[n].ruleDetails[0].skuMatchings[0].supplyPrice !== 'undefined') {
                tempArr[m].skuList[n].supplyPricee = parseFloat(tempArr[m].skuList[n].ruleDetails[0].skuMatchings[0].supplyPrice / 100).toFixed(2) + '';
              } else {
                tempArr[m].skuList[n].supplyPricee = '';
              }
            } else {
              tempArr[m].skuList[n].ruleId = '';
              tempArr[m].skuList[n].ruleName = '';
              tempArr[m].skuList[n].supplyPricee = '';
            }
          }
        }
      }
      this.prodArr = tempArr;
    }
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.el-input{
  width: 320px;
}
.prodAction {
  padding: @baseSpace * 3;
}
.prodActionTitle {
  margin-bottom: @baseSpace * 3;
  padding-bottom: @baseSpace * 3;
  border-bottom: solid 1px @borderLine;
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
    flex-basis: 15%;
    margin-left: 15px;
  }
  .financeRule {
    flex-basis: 30%;
    margin-left: 15px;
  }
  .action {
    flex-basis: 15%;
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

.textCenter {
  text-align: center;
}

.price {
  width: 15%;
  padding-left: @baseSpace*3;
  .el-input {
    width: 100px;
  }
}

.skuRule {
  width: 30%;
  padding-left: @baseSpace*3;
  .el-input__inner {
    width: 250px;
  }
}

.action {
  width: 15%;
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

.footOper {
  margin-top: @baseSpace *3;
  .el-button--small {
    border-radius: 0px;
  }
}
</style>
<style lang="less">
@import '../../main.less';
.batchBtn {
  .el-button {
    padding-top: 5.5px;
    padding-bottom: 5.5px;
  }
}
.el-input__inner {
  height: 30px;
  border-radius: 0px;
}
</style>
