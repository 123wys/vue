<template>
  <div class="warehouse-prod">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓库商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeComp">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="activeComp" :key="activeComp"></component>
    </keep-alive>
  </div>
</template>
<script>
import RegisterProd from './RegisterProd';
import ShareStock from './ShareStock.vue';
export default {
  name: 'warehouse-prod',
  components: {
    RegisterProd,
    ShareStock,
  },
  data() {
    return {
      tabs: [{
        label: '商品注册',
        name: 'RegisterProd',
      }, {
        label: '共享库存',
        name: 'ShareStock',
      }],
      activeComp: 'RegisterProd',
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
.warehouse-prod {
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
