<template>
  <div>
    <div class="order" v-for="order of detaliList" :keys="order.orderId">
      <div class="order-head">
        <div class="order-msg">
          <div class="chunk">
            <div class="warehouse" v-text="order.warehouse"></div>
            <div class="orderId" v-text="order.orderId"></div>
          </div>
          <div class="chunk receiver">
            <div class="row">
              <div class="row-span">收货人：</div>
              <div v-text="order.receiverName + '-' + order.receiverMobile + '-' + order.province + order.city + order.receiverAddress"></div>
            </div>
            <div class="row">
              <div class="row-span">快递物流：</div>
              <div v-text="order.logisticsName"></div>
            </div>
            <div class="row">
              <div class="row-span">商家备注：</div>
              <div v-text="order.remarks"></div>
            </div>
            <div class="row">
              <div class="row-span">审核留言：</div>
              <div v-text="order.comment"></div>
            </div>
          </div>
          <div class="order-action">
            <div><i :class="showSatausIcon(order.status)"></i><span v-text="showSatausLabel(order.status)"></span></div>
            <div>
              <el-button size="small" type="primary" v-if="order.status==25">确认到货</el-button>
              <el-button size="small" v-if="order.status==25">修改收货信息</el-button>
              <el-button size="small" type="primary" v-if="order.status==22">审核通过</el-button>
              <el-button size="small" v-if="order.status==22">转预售</el-button>
              <el-button size="small" v-if="order.status==22">改仓</el-button>
              <el-button size="small" v-if="[22,25].includes(parseInt(order.status))">取消订单</el-button>
              <el-button size="small" type="primary" v-if="order.status==24">确认发货</el-button>
              <el-button size="small" v-if="order.status==24">回退审核</el-button>
              <el-button size="small" type="primary" v-if="order.status==21">生成售后</el-button>
              <el-button size="small" type="primary" v-if="order.status==26">确认退款</el-button>
              <el-button size="small" type="danger" v-if="order.status==26">拒绝退款</el-button>
              <el-button size="small">加备注</el-button>
              <el-button size="small" type="text">订单轨迹</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import {
  getOrderData
} from './testData';
import {
  Button
} from 'element-ui'
Vue.use(Button);
export default {
  name: 'order-detail-body',
  data() {
    return {
      detaliList: getOrderData().list[0].customerOrders
    }
  },
  computed: {
    orderType() {
      return this.$store.state.enumSet.orderType;
    }
  },
  methods: {
    showSatausLabel(status) {
      return this.orderType[status].label;
    },
    showSatausIcon(status) {
      return this.orderType[status].icon;
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.order-head {
  border: solid 1px @borderLine;
  padding: @largeSize;
  .chunk {
    div:not(:last-of-type) {
      margin-bottom: @smallSize;
    }
    .warehouse {
      font-size: 28px;
    }
    .orderId {
      color: @darkGary;
    }
  }
  .chunk:not(:last-of-type) {
    margin-bottom: @normalSize;
  }
  .receiver {
    display: flex;
  }
}
</style>
