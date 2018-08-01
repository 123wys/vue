<template>
  <div class="orderAnalysis">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>数据中心</el-breadcrumb-item>
      <el-breadcrumb-item>订单分析</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="订单指标分析" name="OrderTapOne"><OrderTapOne></OrderTapOne></el-tab-pane>
      <el-tab-pane label="渠道订单" name="OrderTapTwo"><OrderTapTwo></OrderTapTwo></el-tab-pane>
      <el-tab-pane label="供应商订单" name="OrderTapThree"><OrderTapThree></OrderTapThree></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import OrderTapOne from './OrderTapOne'
import OrderTapTwo from './OrderTapTwo'
import OrderTapThree from './OrderTapThree'
import bus from '../../store/bus.js'
export default {
  name: 'orderAnalysis',
  data() {
    return {
      activeName: 'OrderTapOne'
    }
  },
  computed: {},
  components: {
    OrderTapOne,
    OrderTapTwo,
    OrderTapThree,
    // ProductAnalysis
  },
  mounted() {
    bus.$emit('OrderTapOne')
  },
  methods: {
    handleClick(tab, event) {
      // if (tab.name === 'second') {
      //   bus.$emit('OrderTapTwo');
      // } else if (tab.name === 'third') {
      //   bus.$emit('OrderTapThree');
      // } else {
      //   bus.$emit('OrderTapOne')
      // }
    }
  },
  watch: {
    activeName(val, oldVal) {
      bus.$emit(val);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.orderAnalysis {
  color: @lightBlack;
  padding: @normalSize;
}
</style>
