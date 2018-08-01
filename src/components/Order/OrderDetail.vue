<template>
  <div class="order-detail">
    <order-detail-head></order-detail-head>
    <order-detail-body></order-detail-body>
  </div>
</template>
<script>
import OrderDetailHead from './OrderDetailHead'
import OrderDetailBody from './OrderDetailBody'
export default {
  name: 'order-detail',
  data() {
    return { // 测试数据放置
    }
  },
  components: {
    OrderDetailHead,
    OrderDetailBody,
  },
  methods: {},
  watch: {
    '$route'(to, from) {
      if (to.path.includes('orderdetail')) {
        console.log(this.$root.orderMsg)
        this.$root.orderMsg = to.path;
      }
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.order-detail {
  padding: @largeSize;
}
</style>
