<template>
  <div class="err-order-parent">
    <div class="head">
      <div class="top">
        <div class="left">
          <el-checkbox v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" v-model="isSelect" class="checkbox"></el-checkbox>
          <i :class="icon"></i><strong v-text="shopEnum[order.shopId]" class="shop-name"></strong>
          <span>订单编号：<span v-text="order.ordId"></span></span><span>成交时间：<span v-text="order.payDate"></span></span>
        </div>
        <div class="right">
          实付金额：<strong v-text="(parseFloat(order.paidFee)/100).toFixed(2)"></strong> （共<span v-text="prodNum"></span>件商品）
          <!-- <span class="see-detail" @click='seeDetail'>
            查看详情<i class="el-icon-arrow-right gary"></i>
          </span> -->
        </div>
      </div>
    </div>
    <div class="errOperation">
      <div class="receiverAdd">
        <div style="flex-basis:85%;">
          收货地址：<span>{{order.receiverName}}-{{order.receiverMobile}}-{{order.province}}{{order.city}}{{order.district}}{{order.receiverAddress}}</span>
        </div>
        <!-- <div v-if="fullPath === 'undisorder'" style="flex-basis:15%;"><el-button size="small" type="primary" @click="actionHandler('cdlz')">流转</el-button></div> -->
      </div>
      <div v-if="fullPath !== 'undisorder' && fullPath !== 'deadorder'" class="bottom">
        <div class="remark">
          <span>问题订单原因：<span class="dangerRed" v-text="order.remarks"></span></span>
        </div>
        <div class="orderdeal">
          <el-button size="small" type="primary" @click="actionHandler('cdlz')">流转</el-button>
          <el-button size="small" @click="actionHandler('xgshxx')">改地址</el-button>
          <el-button size="small" @click="actionHandler('jbz')">加备注</el-button>
        </div>
      </div>
    </div>
    <error-order-prod v-if="!hideProd" v-for="(prod, i) of order.custOrderDtl4Iboss" :prod="prod" :fullPath="fullPath" :extOrdId="order.ordId" :key="prod.skuId" @actionCode="actionHandlerCode(i, ...$event)"></error-order-prod>
  </div>
</template>
<script>
import ErrorOrderProd from './ErrorOrderProd'
import debounce from 'lodash/debounce'
import Vue from 'vue'
import {
  Checkbox,
  Button,
} from 'element-ui'
Vue.use(Button);
Vue.use(Checkbox)
export default {
  name: 'error-order-parent',
  props: ['order', 'select', 'hideProd', 'fullPath'],
  components: {
    ErrorOrderProd,
  },
  computed: {
    icon() {
      if (this.$store.state.enumSet.platform[this.order.platformId] === undefined) {
        return 'icon iconfont icon-disanfangdianpu';
      }
      return this.$store.state.enumSet.platform[this.order.platformId];
    },
    prodNum() {
      let num = 0;
      num += this.order.custOrderDtl4Iboss.length;
      return num;
    },
    payTypeLabel() {
      return this.$store.state.enumSet.payType[this.order.payType];
    },
    shopEnum() {
      return this.$store.state.enumSet.shopEnum;
    },
    isSelect: {
      get() {
        return this.select;
      },
      set(val) {
        this.$emit('select-change-p', val);
      }
    },
  },
  methods: {
    actionHandler: debounce(function(...args) {
      this.$emit('action', args)
    }, 600, {
      leading: true,
      trailing: false,
    }),
    actionHandlerCode(...args) {
      console.log(args)
      this.$emit('actionCode', args)
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.err-order-parent {
  border: solid 1px @borderLine;
  width: 100%;
  > div + div{
    border-top: solid 1px @borderLine;
  }
}

.head {
  width: 100%;
  line-height: 20px;
  background-color: #e8f5ff;
  padding: @smallSize;
  display: flex;
  flex-direction: column;
}

.top {
  width: 100%;
  display: flex;
}

.checkbox {
  margin-right: @smallSize;
}

.left {
  flex-basis: 70%;
}

.right {
  text-align: right;
  flex-basis: 30%;
}

.icon-youzan {
  color: #ee0000;
  font-size: 18px;
}

.icon-taobao {
  color: #FC6420;
  font-size: 18px;
}

.icon-tianmao {
  color: #C20003;
  font-size: 18px;
}

.icon-jingdong {
  color: #C91523;
  font-size: 18px;
}

.left > span + span {
  margin-left: @largeSize + 5px;
}

.shop-name {
  font-size: 12px;
  color: @black;
  margin-left: @smallSize;
  margin-right: @baseSize*3;
}

.warning {
  color: @warning;
}

.el-icon-arrow-down {
  transition: transform .3s;
}

.rotate {
  transform: translateY(-20%) rotate(180deg);
}

.paymsg {
  padding: @normalSize 40px;
  height: 46px;
  > span + span {
    margin-left: @largeSize;
  }
}

.errOperation{
  padding: @baseSpace * 2;
}

.receiverAdd{
  margin-left: @baseSpace * 6;
  display: flex;
}

.bottom {
  margin-top: 10px;
  display: flex;
}

.remark {
  margin-left: @baseSpace * 6;
  border: solid 1px @dangerRed;
  border-radius: 5px;
  background-color: @dangerRedBg;
  display: inline-block;
  width: 40%;
  padding: @baseSpace @normalSize;
  .dangerRed{
    color: @dangerRed;
  }
}

.orderdeal {
  width: 60%;
  text-align: right;
}
</style>
