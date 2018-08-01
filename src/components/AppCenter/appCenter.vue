<template>
  <div class="appCenter">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>应用中心</el-breadcrumb-item>
    </el-breadcrumb>
    <waitProduct></waitProduct>
  </div>
</template>
<script>
export default {
  name: 'appCenter',
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

.appCenter {
  color: @lightBlack;
  padding: @normalSize;
}
</style>
