<template>
  <div class="customerCenter">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <CustomerCenterSearch :moreCheck='checkMore' @actionCheck="checkToggle" @formSubmit='formSubmit'></CustomerCenterSearch>
    <CustomerTable :pageNumber='pageNumber' :pageSize='pageSize' :customerData='customerData' @size-change="sizeChangeHandler" @current-change="currentChangeHandler" @refreshTabel='refreshTabel' @sortChange='sortChange' v-loading="loading" element-loading-text="拼命加载中"></CustomerTable>
  </div>
</template>
<script>
import CustomerCenterSearch from './CustomerCenterSearch'
import CustomerTable from './CustomerTable'
// import Edata from './checkdata.js'
export default {
  name: 'customerCenter',
  data() {
    return {
      loading: false,
      checkMore: false,
      customerData: {
        amount: 0,
        beanList: []
      },
      pageSize: 20,
      pageNumber: 1,
      queryCondition: {},
      sortType: {
        sortType: '',
        direction: ''
      }
    }
  },
  components: {
    CustomerCenterSearch,
    CustomerTable
  },
  mounted() {},
  activated() {
    this.queryCondition = {};
    this.sortType = {};
    if (this.$route.query.group) {
      this.queryCondition.group = this.$route.query.group;
      this.checkMore = true;
    };
    this.getcustomerData(this.queryCondition);
  },
  computed: {},
  methods: {
    sortChange(obj) {
      // console.log(obj);
      if (obj.prop) {
        this.sortType.sortType = obj.prop;
        this.sortType.direction = obj.order.toUpperCase();
      } else {
        this.sortType = {};
      }
      this.getcustomerData(this.queryCondition);
    },
    checkToggle() {
      this.checkMore = !this.checkMore;
    },
    formSubmit(...args) {
      this.queryCondition = args[0];
      if (args[1]) {
        var beginDoneTime = args[1][0];
        var endDoneTime = args[1][1];
        this.queryCondition.beginPayTime = beginDoneTime;
        this.queryCondition.endPayTime = endDoneTime;
      }
      this.getcustomerData(this.queryCondition);
    },
    getcustomerData(queryCondition) {
      this.loading = true;
      var data = {
        queryCondition: queryCondition || {},
        sortType: this.sortType,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      this.axios.post('/customer/customer/queryCustomer', data).then(res => {
        this.customerData = res.data;
        this.loading = false;
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    currentChangeHandler(args) {
      this.pageNumber = args;
      this.getcustomerData(this.queryCondition);
    },
    sizeChangeHandler(args) {
      this.pageSize = args;
      this.getcustomerData(this.queryCondition);
    },
    refreshTabel() {
      this.getcustomerData(this.queryCondition);
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.customerCenter {
  color: @lightBlack;
  padding: @normalSize;
  min-width: 900px;
}
</style>
