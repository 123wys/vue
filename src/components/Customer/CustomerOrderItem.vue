<template>
  <div class="customerOrderItem">
    <div class="head">
      <div class="left">
        <i :class="icon(orderItem.platformId)" style='margin-right:10px'></i><strong v-text="shopEnum[orderItem.shopId]" class="shop-name"></strong>
        <span>商城单号：<span v-text="orderItem.extOrderId"></span></span><span>成交时间：<span v-text="orderItem.payTime"></span></span>
      </div>
      <div class="right">
        总额：<strong v-text="orderItem.totalFee"></strong> （共
        <span v-text="prodNum"></span>件商品，分成<span v-text="orderItem.orders.length" class="warning"></span>个包裹）
      </div>
    </div>
    <div class="body">
      <div v-for='orderSon in orderItem.orders' :key = 'orderSon.orderId'>
        <div class="msg">
          <div>
            <span>
              <span v-text="index+1" class="SerialNum"></span>
              <!-- <span class="warehouse" v-text="tenantEnum[orderSon.supplierTenantId]"></span> -->
              <span class="sum" v-text="'(共' + orderSon.orderItems.length + '件商品)'" style='margin-left:5px;'></span>
            </span>
            <!-- <span>
              系统单号：<span v-text="orderSon.orderId"></span>
            </span> -->
            <span>订单状态：<span :style="statusColor(orderSon.orderStatus)" v-text="showSatausLabel(orderSon.orderStatus)"></span></span>
            <template v-if="orderSon.companyName">
              <span>物流公司：{{orderSon.companyName}}</span>
              <span>物流单号：{{orderSon.deliveryNo}}</span>
            </template>
          </div>
          <div class="receiver">
            <span>收货信息：<span v-text="orderSon.receiverName"></span>
            <span v-text="orderSon.receiverMobile"></span><span v-text="orderSon.receiverState+orderSon.receiverCity+orderSon.receiverDistrict+orderSon.receiverAddress"></span></span>
          </div>
          <div class="remark" v-show="orderSon.buyerMessage || orderSon.orderMemo || orderSon.comment">
            <div v-if="orderSon.buyerMessage">
              <span>买家留言：</span><span class="buyer" v-text="orderSon.buyerMessage"></span>
            </div>
            <div v-if="orderSon.orderMemo">
              <span>商家备注：</span><span class="orderMemo" v-text="orderSon.orderMemo"></span>
            </div>
            <div v-if="orderSon.comment">
              <span>审核留言：</span><span class="comment" v-text="orderSon.comment"></span>
            </div>
          </div>
        </div>
        <order-prod v-for="prod of orderSon.orderItems" :prod="prod" :key="prod.outerId"></order-prod>
      </div>
    </div>
  </div>
</template>
<script>
import OrderProd from './OrderProd'
export default {
  name: 'customerOrderItem',
  data() {
    return {}
  },
  props: ['orderItem', 'index'],
  components: {
    OrderProd
  },
  computed: {
    orderType() {
      return this.$store.state.enumSet.orderType;
    },
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
    supplierNameEnum() {
      return this.$store.state.enumSet.supplierEnum;
    },
    shopEnum() {
      return this.$store.state.enumSet.allShopInfo;
    },
    prodNum() {
      let num = 0;
      this.orderItem.orders.forEach(n => {
        num += n.orderItems.length;
      });
      return num;
    },
  },
  methods: {
    showSatausLabel(status) {
      return this.orderType[status].label;
    },
    statusColor(orderStatus) {
      let color = this.orderType[parseInt(orderStatus)].color;
      return {
        color
      };
    },
    icon(platformId) {
      return this.$store.state.enumSet.platform[platformId]
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.customerOrderItem {
  margin-bottom: 10px;
  border: solid 1px @borderLine;
  background-color: @white;
}
.SerialNum{
  margin-left: 10px;
  color: @primaryBlue;
  font-size: 14px!important;
  font-style: italic;
  font-weight: 600;
}

.head {
  background-color: #e8f5ff;
  line-height: 20px;
  padding: @smallSize;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.body{
  transition: background-color 0.3s;
}
.body:hover{
  background-color: #eef0f6;
}
.left > span + span {
  margin-left: @largeSize + 5px;
}
.warning{
  color: @warning;
}
.msg {
  flex-basis: 60%;
  span{
    font-size:12px;
  }
  > div:first-child {
    color: @baseGary;
  }
  > div > span + span {
    margin-left: @largeSize;
  }
  > div + div {
    margin-top: @smallSize;
  }
}

.warehouse {
  font-size: 14px!important;
  color: @baseGary;
  margin-right: @baseSpace;
  margin-left:15px;
}

.receiver {
  margin-left: @baseSpace * 3;
  span + span {
    margin-left: @smallSize;
  }
}

.sum {
  color: @darkGary;
}

.remark {
  border: solid 1px #ffdda4;
  border-radius: 5px;
  background-color: #fefce8;
  display: inline-block;
  margin-left: @baseSpace * 2;
  min-width: 60%;
  padding: @smallSize @normalSize;
  .buyer {
    color: @danger;
  }
  .orderMemo {
    color: @blue;
  }
  .comment {
    color: @warning;
  }
  >div+div {
    margin-top: @smallSize - 3px;
  }
}
</style>
