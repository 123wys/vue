<template>
  <div class="dataCenter">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>数据中心</el-breadcrumb-item>
    </el-breadcrumb>
    <waitProduct></waitProduct>
  </div>
</template>
<script>
export default {
  name: 'dataCenter',
  data() {
    return {

    }
  },
  computed: {},
  methods: {},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.dataCenter {
  color: @lightBlack;
  padding: @normalSize;
}

</style>
