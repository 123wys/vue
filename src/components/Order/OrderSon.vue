<template>
  <div class="order-son">
    <div class="head">
      <el-checkbox v-model="isSelect" class="checkbox"></el-checkbox>
      <div class="msg">
        <div>
          <span>
          <span class="warehouse" v-text="tenantEnum[orderSon.supplierTenantId]"></span><span class="sum" v-text="'(共' + getProdNum(orderSon.orderItems) + '件商品)'"></span>
          </span>
          <span>系统单号：<span v-text="orderSon.orderId"></span></span><span>订单状态：<span  :class="orderType[orderSon.orderStatus].color" v-text="orderType[orderSon.orderStatus].label"></span></span>
          <span v-if="repositoryEnum[orderSon.wmsId]">仓库：{{repositoryEnum[orderSon.wmsId]}}</span>
          <template v-if="orderSon.companyName">
            <span>物流公司：{{orderSon.companyName}}</span>
            <span>物流单号：{{orderSon.deliveryNo}}</span>
          </template>
        </div>
        <div class="receiver">
          <span>收货信息：<span v-text="orderSon.receiverName"></span>
          <span v-text="orderSon.receiverMobile"></span><span v-text="orderSon.receiverState+orderSon.receiverCity+orderSon.receiverDistrict+orderSon.receiverAddress"></span></span>
        </div>
        <div class="remark" v-show="orderSon.buyerMessage || orderSon.buyerMemo || orderSon.sellerMemo || orderSon.orderMemo || orderSon.comment">
          <div v-if="orderSon.buyerMessage||orderSon.buyerMemo">
            <span>买家留言：</span>
            <template v-if="orderSon.buyerMessage">
              <span class="buyer" v-text="orderSon.buyerMessage"></span>
              <br>
            </template>
            <span class="buyer memo" v-text="orderSon.buyerMemo"></span>
          </div>
          <div v-if="orderSon.sellerMemo">
            <span>商城商家备注：</span><span class="orderMemo" v-text="orderSon.sellerMemo"></span>
          </div>
          <div v-if="orderSon.orderMemo">
            <span>商家备注：</span><span class="orderMemo" v-text="orderSon.orderMemo"></span>
          </div>
          <div v-if="orderSon.comment">
            <span>审核留言：</span><span class="comment" v-text="orderSon.comment"></span>
          </div>
        </div>
      </div>
      <div class="action">
        <el-button size="small" type="primary" v-if="orderSon.orderStatus==6" @click="actionHandler('qrdh')">确认到货</el-button>
        <el-button size="small" type="primary" v-if="orderSon.orderStatus==7" @click="actionHandler('shtg')">审核通过</el-button>
        <el-button size="small" type="primary" v-if="orderSon.orderStatus==1" @click="actionHandler('fh')">发货</el-button>
        <el-button size="small" v-if="orderSon.orderStatus==1" @click="actionHandler('zys')">转预售</el-button>
        <!-- <a href="#/orderprint" target="_blank" class="orderPrint" type="button" v-if="orderSon.orderStatus==1" @click="printOrder">打单</a> -->
        <el-button size="small" v-if="[1,6].includes(parseInt(orderSon.orderStatus))" @click="actionHandler('thsh')">退回审核</el-button>
        <!--   <el-button size="small" v-if="orderSon.orderStatus==7" @click="actionHandler('gc')">改仓</el-button> -->
        <!-- <el-button size="small" v-if="[1,7].includes(parseInt(orderSon.orderStatus))" @click="actionHandler('ppgys')">匹配供应商</el-button> -->
        <el-button size="small" v-if="[0,1,7].includes(parseInt(orderSon.orderStatus))" @click="actionHandler('xgshxx')">修改收货信息</el-button>
        <el-button size="small" v-if="orderSon.orderStatus > 0 && orderSon.orderStatus < 8 && orderSon.orderItems.some(m => [0, 2, 5].includes(m.warrantyStatus))" @click="goAfterSale(1)">转售后</el-button>
        <!-- <el-button size="small" v-if="orderSon.warrantyStatus!=0" @click="goAfterSale(0)">售后单</el-button> -->
        <el-button size="small" v-if="orderSon.orderStatus==7" @click="actionHandler('qxdd')">取消订单</el-button>
        <el-button size="small" v-if="![1,7].includes(parseInt(orderSon.orderStatus))" @click="actionHandler('jbz')">加备注</el-button>
        <a href="javascript:void(0);" @click="storageId(orderSon.orderId)">订单轨迹</a>
      </div>
    </div>
    <order-prod v-if="!hideProd" v-for="prod of orderSon.orderItems" :prod="prod" :orderSon="orderSon" :key="prod.outerId" @warranty="getWarranty(orderSon)"></order-prod>
  </div>
</template>
<script>
import OrderProd from './OrderProd'
import debounce from 'lodash/debounce'
import bus from '../../store/bus.js'
import {
  mapGetters
} from 'vuex';
export default {
  name: 'order-son',
  props: ['orderSon', 'select', 'hideProd', 'platformId'],
  data() {
    return {}
  },
  components: {
    OrderProd,
  },
  computed: {
    orderType() {
      return this.$store.state.enumSet.orderType;
    },
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    },
    repositoryEnum() {
      return this.$store.state.enumSet.repositoryEnum;
    },
    statusColor() {
      let color = this.orderType[parseInt(this.orderSon.orderStatus)].color;
      return {
        color
      };
    },
    isSelect: {
      get() {
        return this.select;
      },
      set(val) {
        this.$emit('select-change-s', val);
      }
    },
    ...mapGetters([
      'ichannel'
    ]),
  },
  methods: {
    storageId(orderId) {
      bus.$emit('orderTrack', orderId);
    },
    actionHandler: debounce(function(...args) {
      this.$emit('action', args)
    }, 600, {
      leading: true,
      trailing: false,
    }),
    goAfterSale(create = 1) { // 0是查看,1是新建
      let extOrderId = this.$parent.order.extOrderId;
      this.$store.commit('setASOrder', {
        extOrderId,
        create
      });
      this.$router.push('aftersale');
    },
    getWarranty(args) {
      let state = {
        create: 0,
        extOrderId: args.extOrderId,
      };
      this.$store.commit('setASOrder', state);
      this.$router.push('/aftersale');
    },
    getProdNum(orderItems) {
      return orderItems.reduce((prv, prod) => {
        prv += prod.num;
        return prv;
      }, 0)
    }
    // printOrder: debounce(function() {
    //   window.localStorage.orderPrint = JSON.stringify([this.orderSon]);
    // }, 600, {
    //   leading: true,
    //   trailing: false,
    // })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.order-son {
  border-top: solid 1px @borderLine;
}

.order-son:hover {
  background-color: @tabBg;
  transition: background-color 0.3s;
}

.head {
  padding: @smallSize;
  display: flex;
  align-items: baseline;
  +div {
    border-top: solid 1px @borderLine;
  }
  .checkbox {
    margin-right: @smallSize;
  }
  .msg {
    flex-basis: 50%;
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
  .action {
    flex-grow: 1;
    text-align: end;
    a {
      text-decoration: none;
      color: @primaryBlue;
      margin-left: @smallSize;
    }
    .orderPrint {
      font-size: 12px;
      line-height: 1;
      display: inline-block;
      padding: 7px 9px;
      color: @black;
      border: 1px solid #bfcbd9;
      border-radius: 4px;
      margin-right: 10px;
      background-color: #FFF;
      &:hover {
        color: @primaryBlue;
        border: 1px solid @primaryBlue;
      }
      ;
    }
  }
}

.warehouse {
  font-size: 14px;
  color: @baseGary;
  margin-right: @baseSpace;
}

.receiver {
  margin-left: @baseSpace * 2;
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
