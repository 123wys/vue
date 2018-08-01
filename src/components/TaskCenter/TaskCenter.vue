<template>
  <div class="task-center">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>任务中心</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="taskName">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="taskName" :key="taskName"></component>
    </keep-alive>
  </div>
</template>
<script>
// import debounce from 'lodash/debounce'
import OrderExportTask from './OrderExportTask';
import ProdExportTask from './ProdExportTask';
import BatchDeliverTask from './BatchDeliverTask';
import AccountExportTask from './AccountExportTask';
import OrderImportTask from './OrderImportTask';
import FastExport from './FastExport';
export default {
  name: 'task-center',
  components: {
    orderExport: OrderExportTask,
    prodExport: ProdExportTask,
    batchDeliver: BatchDeliverTask,
    accountExport: AccountExportTask,
    orderImport: OrderImportTask,
    fastExport: FastExport
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
      }, {
        label: '商品导出',
        name: 'prodExport',
      }, {
        label: '订单导入',
        name: 'orderImport',
      }, {
        label: '快速对账导出',
        name: 'fastExport',
      }],
      taskName: '',
    }
  },
  computed: {
    storeTaskName() {
      return this.$store.state.toolbox.taskName;
    },
  },
  watch: {
    storeTaskName(val) {
      this.changeTaskName();
    }
  },
  methods: {
    changeTaskName() {
      this.taskName = this.tabs.some(n => n.name === this.storeTaskName) ? this.storeTaskName : 'orderExport';
    }
  },
  activated() {
    this.changeTaskName();
    if (this.$route.query.type === 'orderAdd') {
      this.taskName = 'orderImport';
    } else if (this.$route.query.type === 'fastExport') {
      this.taskName = 'fastExport'
    }
    if (this.$route.query.data) {
      this.taskName = this.$route.query.data;
    }
  },
  deactivated() {
    this.$store.commit('setTaskName', this.taskName);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.task-center {
  padding: @baseSpace*3;
  .el-table {
    font-size: 12px;
  }
}
</style>
