<template>
  <div class="cycleSend">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/production'}">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>周期送配送规则</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product" v-if="prodList.skuList.length">
      <span class="productTitle">当前商品:</span>
      <div class="productDetail">
        <p v-text="prodList.offeringName"></p>
        <p v-text="sku.skuCharSpec"></p>
        <p v-text="sku.outerId"></p>
      </div>
    </div>
    <div class="tableBorder">
      <div class="num">
        <div class="option">配送的SKU和数量</div>
        <div class="select">
          <div class="hasProd" v-if="hasDetails.length > 0 && hasDetails[0] && hasDetails[0].skuName">
            <div class="skuDetail">
              <p v-for="option in hasDetails">
                <span>{{option.skuName}}</span>
                <span>{{option.num}}件</span>
              </p>
            </div>
            <div class="skuButton">
              <el-button size="small" @click="dialogShow">修改</el-button>
            </div>
          </div>
          <div class="noProd" v-else>
            <el-button size="small" @click="dialogShow">请选择(可多选)</el-button>
          </div>
        </div>
      </div>
      <div class="cycle">
        <div class="option">配送周期</div>
        <div class="cycleSet">
          <span>每隔</span>
          <div class="numInput">
            <el-input type="number" v-if="skuRule.rule" v-model="skuRule.rule.cycle" size="small" @change="hasChanged"></el-input>
            <el-input type="number" v-else v-model="cycle" size="small"></el-input>
          </div>
          <span>天配送一次</span>
        </div>
      </div>
      <div class="total">
        <div class="option">配送次数</div>
        <div class="totalNum">
          <span>总共配送</span>
          <div class="numInput">
            <el-input type="number" v-if="skuRule.rule" v-model="skuRule.rule.times" size="small" @change="hasChanged"></el-input>
            <el-input type="number" v-else v-model="times" size="small"></el-input>
          </div>
          <span>次</span>
        </div>
      </div>
    </div>
    <div class="csfooter">
      <el-button type="primary" @click="addRule" :disabled="!btnDisable">确定</el-button>
      <el-button @click="goBack">返回</el-button>
    </div>
    <sku-dialog :dialog="dialog" @dialog-cancel="dialogCancel" @dialog-sure="dialogSure"></sku-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import SkuDialog from './SkuDialog';
export default {
  name: 'cycle-send',
  data() {
    return {
      dialog: false,
      prodList: {
        skuList: [],
        prodIndex: 0,
      },
      skuRule: {},
      selectSku: [],
      isChanged: false,
      cycle: 0,
      times: 0,
      hasDetails: [],
    };
  },
  computed: {
    sku() {
      return this.prodList.skuList[this.prodList.prodIndex];
    },
    btnDisable() {
      return this.selectSku.length > 0 || this.isChanged;
    },
  },
  components: {
    SkuDialog,
  },
  methods: {
    hasChanged() {
      this.isChanged = true;
    },
    getSkuDistributeRule(sku) {
      this.isChanged = false;
      let query = {
        skuId: sku.skuId,
      };
      axios.post('product/prodoffering/getSkuDistributeRule', query)
        .then(res => {
          if (res.data) {
            this.skuRule = res.data;
            this.querySkuName(this.skuRule.ruleDetails[0]);
          } else {
            this.hasDetails = [];
          }
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
        })
    },
    querySkuName(args) {
      if (!args) return;
      let query = {
        queryCondition: {
          skuId: []
        }
      };
      args.forEach(ele => {
        query.queryCondition.skuId.push(ele.skuId)
      })
      axios.post('product/prodoffering/querySku', query)
        .then(res => {
          args.forEach(m => {
            res.data.beanList.forEach(n => {
              if (m.skuId === n.skuId) {
                m.skuName = n.skuName
              }
            })
          })
          this.hasDetails = args;
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
        })
    },
    addRule() {
      let cycleStr = `${this.cycle}`;
      let timesStr;
      if (!this.skuRule.rule) {
        timesStr = `${this.times}`;
      } else {
        timesStr = `${this.skuRule.rule.times}`;
      }
      if (this.cycle < 1 || cycleStr.indexOf('.') > 0 || timesStr < 1 || timesStr.indexOf('.') > 0) {
        this.$message.info('请输入正确数值！');
        return;
      }
      let add = {
        rule: {
          // skuId: this.sku.skuId,
          cycle: this.cycle,
          times: this.times
        },
        ruleDetails: []
      };
      if (this.selectSku.length) { // 如果新选择sku
        add.ruleDetails = [];
        this.selectSku.forEach(m => {
          add.ruleDetails.push({
            skuId: m.sku.skuId,
            num: m.num
          })
        })
      }
      if (this.skuRule.rule) { // 有规则就调用修改规则
        add.rule.ruleId = this.skuRule.rule.ruleId;
        add.rule.cycle = this.skuRule.rule.cycle;
        add.rule.times = this.skuRule.rule.times;
        if (this.selectSku.length === 0) {
          this.skuRule.ruleDetails[0].forEach(ele => {
            add.ruleDetails.push({
              skuId: ele.skuId,
              num: ele.num
            })
          })
        }
        axios.post('product/prodoffering/modifySkuDistributeRule', add)
          .then(res => {
            if (res.data) {
              this.$message.success('修改配送规则成功！');
              this.$router.push('/production');
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      } else {
        add.rule.skuId = this.sku.skuId;
        axios.post('product/prodoffering/addSkuDistributeRule', add)
          .then(res => {
            if (res.data) {
              this.$message.success('添加配送规则成功！');
              this.$router.push('/production');
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      }
    },
    goBack() {
      this.$router.go('-1');
    },
    dialogShow() {
      this.dialog = true;
    },
    dialogSure(args) {
      this.selectSku = args;
      this.isChanged = true;
      this.dialog = false;
    },
    dialogCancel() {
      this.dialog = false;
    },
  },
  activated() {
    this.selectSku = [];
    this.skuRule = {};
    this.prodList = JSON.parse(window.sessionStorage.cycleSendData);
    this.getSkuDistributeRule(this.sku);
  },
  watch: {
    selectSku(val) {
      if (val.length) {
        let arr = [];
        val.forEach(ele => {
          arr.push({
            num: ele.num,
            ...ele.sku
          });
        })
        this.hasDetails = arr;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!window.sessionStorage.cycleSendData) {
      next('/production');
    } else {
      next();
    }
  }
}
</script>
<style scoped lang="less">
@import '../../main.less';
.cycleSend {
  padding: @baseSpace * 3;
  .product {
    display: flex;
    .productTitle {
      font-size: 14px;
    }
    .productDetail {
      margin-left: 15px;
      > p {
        margin: 0;
      }
    }
  }
  .tableBorder {
    border: 1px solid @borderLine;
    background-color: @white;
    width: 800px;
    margin: 10px 0;
    .num,
    .cycle,
    .total {
      display: flex;
      align-items: center;
    }
    .num,
    .cycle {
      border-bottom: 1px solid @borderLine;
    }
    .num {
      padding: 5px 0;
    }
    .option {
      border-right: 1px solid @borderLine;
      flex-basis: 150px;
      text-align: center;
      line-height: 25px;
    }
    .select,
    .cycleSet,
    .totalNum {
      flex-grow: 1;
      padding-left: 10px;
    }
    .hasProd {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .skuDetail {
      p {
        margin: 0;
        span {
          margin-right: 10px;
        }
      }
    }
    .cycleSet,
    .totalNum {
      height: 50px;
      display: flex;
      align-items: center;
      .numInput {
        width: 100px;
        margin: 0 10px;
      }
    }
  }
  .csfooter {
    padding: 5px 0;
  }
}
</style>
