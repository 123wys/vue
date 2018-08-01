<template>
  <div class="finance">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>财务结算</el-breadcrumb-item>
      <el-breadcrumb-item>财务对账</el-breadcrumb-item>
      <!-- <el-breadcrumb-item v-if="show">{{goTo}}</el-breadcrumb-item> -->
    </el-breadcrumb>
    <el-tabs v-model="activeName">
      <el-tab-pane label="待出账" name="first">
        <charge-off></charge-off>
      </el-tab-pane>
      <el-tab-pane label="待对账" name="second">
        <reconciliation :btnName="'搜索对账单'" :activeName="activeName" v-if="activeName === 'second'"></reconciliation>
      </el-tab-pane>
      <el-tab-pane label="待结算" name="third">
        <reconciliation :btnName="'搜索结算单'" :activeName="activeName" v-if="activeName === 'third'"></reconciliation>
      </el-tab-pane>
      <el-tab-pane label="已结算" name="fourth">
        <settlement :btnName="'搜索结算单'" :activeName="activeName" v-if="activeName === 'fourth'"></settlement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ChargeOff from './ChargeOff';
import TheAccount from './TheAccount';
import Reconciliation from './Reconciliation';
import Settlement from './Settlement';
export default {
  name: 'finance',
  data() {
    return {
      activeName: 'first',
      checkDataA: [],
      checkDataB: [],
    }
  },
  components: {
    ChargeOff,
    TheAccount,
    Reconciliation,
    Settlement
  },
  mounted() {},
  computed: {},
  methods: {},
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.finance {
  color: @lightBlack;
}
</style>
<style lang="less">
@import '../../main.less';
.finance .el-tabs__header {
  margin-bottom: @baseSpace * 4;
}

.finance {
  .el-input {
    width: 270px;
    .el-input-group__append {
      width: 85px;
      background-color: @borderLine;
      border-color: @borderLine;
      color: @lightBlack;
      text-align: center;
      .el-button {
        width: 85px;
        padding: 0;
        height: 30px;
        // display: inline-block;
        // padding: @baseSpace * 2 @baseSpace * 6;
        // margin: 0;
      }
    }
    input {
      // font-size: 12px!important;
      // width: 288px;
      height: 30px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-color: @borderLine;
    }
  }
}
</style>
