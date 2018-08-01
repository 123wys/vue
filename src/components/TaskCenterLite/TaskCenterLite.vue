<template>
  <div class="task-center-lite">
    <el-tabs v-model="taskName" class="tabs">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component class="taskcomp" :is="taskName" :key="taskName"></component>
    </keep-alive>
    <div class="close"><i class="iconfont icon-shouqi" @click="close"></i></div>
    <div class="more">
      <el-button type="text" size="small" @click="more">更多记录<i class="iconfont icon-jiantou"></i></el-button>
    </div>
  </div>
</template>
<script>
// import debounce from 'lodash/debounce'
import OrderExportTaskLite from './OrderExportTaskLite';
import BatchDeliverTaskLite from './BatchDeliverTaskLite';
import AccountExportTaskLite from './AccountExportTaskLite';
export default {
  name: 'task-center-lite',
  components: {
    orderExport: OrderExportTaskLite,
    batchDeliver: BatchDeliverTaskLite,
    accountExport: AccountExportTaskLite,
  },
  data() {
    return {
      tabs: [{
        label: '订单导出',
        name: 'orderExport',
      }, {
        label: '批量发货',
        name: 'batchDeliver',
      }, {
        label: '账单导出',
        name: 'accountExport',
      }],
      taskName: '',
    }
  },
  methods: {
    more() {
      this.$router.push('/taskcenter')
      this.$emit('close');
    },
    close() {
      this.$emit('close');
    },
  },
  activated() {
    let taskName = this.$store.state.toolbox.taskName;
    this.taskName = this.tabs.some(n => n.name === taskName) ? taskName : 'orderExport';
  },
  deactivated() {
    this.$store.commit('setTaskName', this.taskName);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.task-center-lite {
  position: relative;
  width: 350px;
  height: 350px;
  padding: 0 @baseSpace*2;
  background-color: @white;
  box-shadow: 0px -2px 10px 0px @borderLine;
}

.taskcomp {
  height: 300px;
}

.close {
  color: @lightGary;
  position: absolute;
  right: @baseSpace*4;
  top: @baseSpace*2+2;
  cursor: pointer;
  transform: rotate(90deg);
}

.more {
  position: absolute;
  right: @baseSpace;
  bottom: @baseSpace*2;
}
</style>
<style lang="less">
@import '../../main.less';
.task-center-lite .el-tabs__header {
  margin: 0;
}
.task-center-lite .nodata {
  color: @neutralGary;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
</style>
