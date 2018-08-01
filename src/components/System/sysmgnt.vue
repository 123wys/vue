<template>
  <div class="sysmgnt">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="我的订购" name="mygoods"><mygoods></mygoods></el-tab-pane> -->
      <el-tab-pane label="用户管理" name="system"><system v-if="activeName === 'system'"></system></el-tab-pane>
      <el-tab-pane label="角色管理" name="role"><role v-if="activeName === 'role'"></role></el-tab-pane>
      <el-tab-pane label="系统设置" name="paramset"><paramset v-if="activeName === 'paramset'"></paramset></el-tab-pane>
      <!-- <el-tab-pane label="账号管理" name="accmgnt"><accmgnt v-if="activeName === 'accmgnt'"></accmgnt></el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import mygoods from './mygoods'
import system from './system'
import role from './role'
import paramset from './paramset'
// import accmgnt from './accmgnt'
// import bus from '../../store/bus.js'
export default {
  name: 'sysmgnt',
  data() {
    return {
      activeName: 'system'
    }
  },
  computed: {},
  components: {
    mygoods,
    system,
    role,
    paramset,
    // accmgnt
  },
  mounted() {
    // bus.$emit('OrderTapOne')
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
      // bus.$emit(val);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.sysmgnt {
  color: @lightBlack;
  padding: @normalSize;
}
</style>
