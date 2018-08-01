<template>
  <div class="order_track">
    <!-- <p>订单轨迹</p> -->
      <div class="order_details details_title">
        <section class="time">时间</section>
        <section class="orderStatus">订单状态</section>
        <section class="operation">操作员</section>
        <section class="operationAction">业务操作</section>
        <section class="description">描述</section>
      </div>
      <div class="order_details details_content" v-for="detail in orderTrack">
        <section class="time" v-text="detail.createTime"></section>
        <section class="orderStatus">{{orderStatus[detail.orderStatus].label}}</section>
        <section class="operation">{{operatorEnum[detail.createOp]}}</section>
        <section class="operationAction" v-text="detail.busiType"></section>
        <section class="description" :title="detail.comments">{{detail.comments | substr}}</section>
      </div>
  </div>
</template>
<script>
export default {
  name: 'order-track',
  props: {
    platformId: {
      default: '',
    },
    orderTrack: {
      type: Array,
    }
  },
  data() {
    return {}
  },
  computed: {
    operatorEnum() {
      return this.$store.state.enumSet.operatorEnum;
    },
    orderStatus() {
      return this.$store.state.enumSet.orderType;
    },
  },
  filters: {
    substr(val) {
      if (!val || val.length < 15) return val;
      val += '';
      let str = val.substr(0, 15) + '...';
      return str;
    },
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.order_track {
  font-size: 12px;
  background-color: @white;
}

.order_details {
  display: flex;
  // padding-left: 38px;
  // margin-top: 20px;
  .time {
    flex-basis: 90px;
    text-align: center;
  }
  .orderStatus {
    flex-basis: 100px;
    padding-left: @baseSpace * 3;
  }
  .operation {
    flex-basis: 95px;
  }
  .operationAction {
    flex-basis: 160px;
  }
  .description {
    flex-basis: 180px;
  }
}

.details_title {
  padding-bottom: @baseSpace * 3;
  margin-bottom: @baseSpace * 3;
  border-bottom: 1px dashed @borderLine;
  > section {
    font-size: 12px;
    color: #7C869D;
  }
}

.details_content {
  .orderStatus {
    position: relative;
    border-left: 1px dashed @borderLine;
    &::before {
      content: '·';
      font-size: 50px;
      line-height: 14px;
      color: @blue;
      left: -9px;
      top: 2px;
      // padding-left: @normalSize;
      position: absolute;
    }
  }
}
</style>
