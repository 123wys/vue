<template>
  <div class="callCenter">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>客服中心</el-breadcrumb-item>
    </el-breadcrumb>
    <waitProduct></waitProduct>
  </div>
</template>
<script>
export default {
  name: 'callCenter',
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
.callCenter {
  color: @lightBlack;
  padding: @normalSize;
}
</style>
