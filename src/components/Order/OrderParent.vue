<template>
  <div class="order-parent">
    <div class="head">
      <div class="left">
        <i :class="icon"></i><strong v-text="shopEnum[order.shopId]" class="shop-name"></strong>
        <span>商城单号：<span v-text="order.extOrderId"></span></span><span v-if="order.orders[0]&&order.orders[0].orderKind===5">配送时间：<span v-text="order.createTime"></span></span><span v-else>付款时间：<span v-text="order.payTime"></span></span>
        <span v-if="order.orders[0]&&order.orders[0].orderKind===5" class="cycle">
          <svg class="icon cycleIcon" aria-hidden="true">
              <use xlink:href="#icon-zhouqipei"></use>
          </svg>
        </span>
      </div>
      <div class="right">
        实付金额：<strong v-text="order.paidFee"></strong> （共
        <span v-text="prodNum"></span>件商品，分成<span v-text="order.orders.length" class="warning"></span>个包裹）
        <!-- <span class="see-detail" @click='seeDetali'>查看详情<i class="el-icon-arrow-right gary
"></i></span> -->
      </div>
    </div>
    <order-son v-for="(orderSon, i) of order.orders" :order-son="orderSon" :select="selectInner[i]" :hide-prod="hideProd" :key="order.orderId" @select-change-s="selectChangeS(i, $event)" @action="actionHandler(i, ...$event)" :platformId="order.platformId"></order-son>
  </div>
</template>
<script>
import OrderSon from './OrderSon'
export default {
  name: 'order-parent',
  props: ['order', 'selectInner', 'hideProd'],
  components: {
    OrderSon,
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
      this.order.orders.forEach(n => {
        num += n.orderItems.length;
      });
      return num;
    },
    payTypeLabel() {
      return this.$store.state.enumSet.payType[this.order.payType];
    },
    shopEnum() {
      return this.$store.state.enumSet.allShopInfo;
    }
  },
  methods: {
    selectChangeS(...args) {
      this.$emit('select-change-p', args);
    },
    actionHandler(...args) {
      this.$emit('action', args);
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.order-parent {
  border: solid 1px @borderLine;
  background-color: @white;
}

.head {
  background-color: #e8f5ff;
  line-height: 20px;
  padding: @smallSize;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
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

.see-detail {
  margin-left: @normalSize;
  cursor: pointer;
  user-select: none;
  color: @lightBlack;
}

.el-icon-arrow-down {
  transition: transform .3s;
}


/*
.rotate {
  transform: translateY(-20%) rotate(180deg);
}*/

.gary {
  color: @gary;
}

.paymsg {
  padding: @normalSize 40px;
  height: 46px;
  > span + span {
    margin-left: @largeSize;
  }
}

.cycle {
  .cycleIcon {
    width: 20px;
    height: 20px;
    /*margin-top: 3px;*/
  }
}
</style>
