<template>
  <div class="in-out-stock">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>出入库</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeComp">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name"></el-tab-pane>
    </el-tabs>
    <div class="right-btn" v-if="activeComp==='ProcurementPlan'">
      <el-button type="text" @click="addProcurementPlan"><i class="icon iconfont icon-chushihua"></i><span>新建采购计划</span></el-button>
    </div>
    <keep-alive>
      <component :is="activeComp" :key="activeComp"></component>
    </keep-alive>
  </div>
</template>
<script>
import ProcurementPlan from './ProcurementPlan';
import InStock from './InStock';
import OutStock from './OutStock';
// import ShopSellableStock from './ShopSellableStock.vue';
export default {
  name: 'in-out-stock',
  components: {
    ProcurementPlan,
    InStock,
    OutStock,
  },
  data() {
    return {
      tabs: [{
        label: '采购计划',
        name: 'ProcurementPlan',
      }, {
        label: '入库单',
        name: 'InStock',
      }, {
        label: '出库单',
        name: 'OutStock',
      }],
      activeComp: 'ProcurementPlan',
    }
  },
  computed: {},
  activated() {},
  methods: {
    addProcurementPlan() {
      this.$store.commit('setPlan', '');
      this.$router.push('/procurementplan');
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.in-out-stock {
  padding: @baseSpace*3;
  position: relative;
}

.right-btn {
  position: absolute;
  right: 2%;
  z-index: 2;
  top: 42px;
}
</style>
