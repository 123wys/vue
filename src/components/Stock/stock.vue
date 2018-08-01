<template>
  <div class="stock">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
    </el-breadcrumb>
    <waitProduct></waitProduct>
    <button @click = 'chuangjian'>获取待结算</button>
  </div>
</template>
<script>
export default {
  name: 'stock',
  data() {
    return {
      name: 'nihao'
    }
  },
  computed: {},
  activated() {

  },
  methods: {
    chuangjian() {
      var data = {
        queryCondition: {
          reportStatus: 1
        },
        pageNumber: 1,
        pageSize: 10
      }
      this.axios.post('/finance/report/queryReports', data).then(response => {
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.stock {
  color: @lightBlack;
  padding: @normalSize;
}
</style>
