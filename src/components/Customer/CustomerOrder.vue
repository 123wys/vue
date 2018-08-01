<template>
  <div class="customerOrder">
    <div class="head">
      <svg class="icon" aria-hidden="true" style='font-size:15px;vertical-align:text-top'>
        <use xlink:href="#icon-zhanghao"></use>
      </svg>
      <span class="name">{{customerInfo.buyerNick}}</span>
      <span class="order-statistics">共<i>{{customerInfo.totalOrderNum}}</i>条订单，累计购买金额<i>{{customerInfo.totalPaidFee}}</i></span>
    </div>
    <div class="body">
      <div class="list-head">
        <div class="num">序号</div>
        <div class="name">商品</div>
        <div class="price">单价</div>
        <!-- <div class="sale">折扣</div> -->
        <div class="sale"></div>
        <div class="counts">数量</div>
      </div>
    </div>
    <customerOrderItem v-for='(item, index) in orderData.beanList' :orderItem = 'item' :key='item.extOrderId' :index='index'></customerOrderItem>
  </div>
</template>
<script>
import customerOrderItem from './CustomerOrderItem'
export default {
  name: 'customerOrder',
  data() {
    return {
      hideProd: true
    }
  },
  props: {
    //  用户信息
    customerInfo: {
      default: function() {
        return {}
      }
    },
    //  订单信息
    orderData: {
      default: function() {
        return {
          amount: 0,
          beanList: []
        }
      }
    }
  },
  components: {
    customerOrderItem
  },
  methods: {},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.customerOrder{
  position:relative;
}
.head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 20px;
  .name {
    margin: 0 15px 0 5px;
    font-size: 14px;
    color: @baseGary;
  }
  .order-statistics {
    font-size: 12px;
    color: @lightGary;
    i {
      font-style: normal;
      color: @warningYellow;
    }
  }
}

.body {
  margin-top: 20px;
  .list-head {
    background-color: #eff2f7;
    display: flex;
    font-size: 14px;
    padding: @normalSize;
    .num {
      flex-basis: 10%;
    }
    .name {
      flex-basis: 55%;
    }
    .price {
      text-align: right;
      box-sizing: border-box;
      padding-right: 15px;
      flex-basis: 11%;
    }
    .sale {
      text-align: right;
      box-sizing: border-box;
      padding-right: 15px;
      flex-basis: 11%;
    }
    .counts {
      text-align: right;
      box-sizing: border-box;
      padding-right: 15px;
      flex-basis: 13%;
    }
  }
}
</style>
<style lang="less">
.el-dialog__body {
  padding: 20px 15px;
}
</style>
