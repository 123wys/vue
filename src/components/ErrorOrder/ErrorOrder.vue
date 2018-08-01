<template>
  <div class="err-order-page">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="fullPath === 'undisorder'">待分发订单</el-breadcrumb-item>
      <el-breadcrumb-item v-else-if="fullPath === 'deadorder'">缺SKU订单</el-breadcrumb-item>
      <el-breadcrumb-item v-else>问题订单</el-breadcrumb-item>
    </el-breadcrumb>
    <error-order-search ref="errorOrderSearch" :moreCheck="checkMore" :fullPath="fullPath" @actionCheck="checkToggle" @formSubmit="formSubmit">  
    </error-order-search>
    <error-order-list v-loading="loading" element-loading-text="拼命加载中" :order-data="orderData" :page-size="pageSize" :page-number="pageNumber" :fullPath="fullPath" ref="orderList" @action="actionHandler(...$event)" @batch-action="batchActionHandler" @actionCode="actionHandlerCode(...$event)" @size-change="sizeChangeHandler" @current-change="currentChangeHandler">
    </error-order-list>
    <error-order-dialog :action="action" :edited-orders="editedOrders" :edited-prods="editedProds" :dialog="dialog" @dialog-sure="dialogSure" @dialog-cancel="dialogCancel"></error-order-dialog>
  </div>
</template>
<script>
import ErrorOrderSearch from './ErrorOrderSearch'
import ErrorOrderList from './ErrorOrderList'
import ErrorOrderDialog from './ErrorOrderDialog'
import axios from 'axios'
// import Vue from 'vue'
import {
  // Loading,
  Message,
  MessageBox,
} from 'element-ui';
// import dateFormat from 'dateFormat'
// Vue.use(Loading)
let xgshxxUrl = 'order/order/editConsigneeOnline';
let jbzUrl = 'order/order/appendCommentOnline';
let cdlzUrl = 'order/order/batchConvert';
let xgzbbUrl = 'order/order/editItemSku';
let undisorderUrl = 'order/order/matchSupplier4Page';
export default {
  name: 'errororder',
  data() {
    return {
      checkMore: false, // 精确查询开关
      orderData: '',
      action: '',
      dialog: false, // 回退审核弹框
      editedOrders: [],
      editedProds: [],
      pageSize: 10,
      pageNumber: 1,
      loading: false,
      fullPath: '', // 当前路径
    }
  },
  methods: {
    actionHandler(i, action) {
      this.action = action;
      if (action === 'cdlz') { // 错单流转
        this.cdlz([this.orderData.custOrder4Iboss[i].ordId]);
        return
      }
      if (['jbz', 'xgshxx'].includes(action)) {
        this.dialog = true;
        this.editedOrders = [this.orderData.custOrder4Iboss[i]];
        return
      }
    },
    actionHandlerCode(i, j, action) {
      this.action = action;
      let order = this.orderData.custOrder4Iboss[i];
      let prod = order.custOrderDtl4Iboss[j];
      if (action === 'xgzbb') {
        this.dialog = true;
        this.editedOrders = [order];
        this.editedProds = [prod];
        return
      }
    },
    batchActionHandler(action) {
      if (action === 'all' && this.orderData.amount > 0) {
        this.$confirm('此操作将流转所有订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let nullOrder = [];
          this.cdlz(nullOrder);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
        return
      } else if (action === 'all' && this.orderData.amount <= 0) {
        this.$message({
          type: 'info',
          message: '当前页面没有订单数据，无需操做！'
        });
        return
      }
      if (!this.$refs.orderList.selection.length) {
        Message.error({
          message: '请至少选择一项！',
        })
        return;
      }
      this.action = action;
      let extOrderIds = this.$refs.orderList.selection.map(n => n.ordId);
      if (action === 'cdlz') {
        this.cdlz(extOrderIds);
        return
      }
      if (['jbz', 'xgshxx'].includes(action)) {
        this.dialog = true;
        this.editedOrders = this.$refs.orderList.selection;
        return
      }
    },
    cdlz(extOrderIds) { // 错单流转
      let postUrl = '';
      if (this.fullPath === 'undisorder') {
        postUrl = undisorderUrl;
      } else {
        postUrl = cdlzUrl;
      }
      this.changeOrder(axios.post(postUrl, {
        extOrderIds: extOrderIds,
      }, '正在更新订单状态', '流转成功！订单流转为“待发货”'));
    },
    xgzbb(extOrderId, prod) { // 修改自编码
      this.changeOrder(axios.post(xgzbbUrl, {
        extOrderId: extOrderId[0],
        prod: {
          extItemId: prod.extItemId,
          outerId: prod.outerId,
        },
      }));
    },
    xgshxx(order) { // 修改收货信息
      this.changeOrder(axios.post(xgshxxUrl, {
        extOrderId: order.ordId,
        receiverState: order.province,
        receiverCity: order.city,
        receiverDistrict: order.district,
        receiverAddress: order.receiverAddress,
        receiver_name: order.receiverName,
        receiverMobile: order.receiverMobile,
      }));
    },
    jbz(extOrderIds, order, append) { // 加备注
      this.changeOrder(axios.post(jbzUrl, {
        extOrderIds: extOrderIds,
        comment: order.remarks + append,
      }));
    },
    // 修改订单，默认修改订单信息
    changeOrder(xhrPromise, loadingMsg = '正在更新订单信息', successMsg = '订单信息更改成功') {
      let loading = this.$loading({
        text: loadingMsg
      });
      xhrPromise.then(response => {
        loading.close();
        Message.success({
          message: successMsg,
        });
        this.research();
      }).catch(err => {
        loading.close();
        MessageBox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    research() {
      this.$refs.errorOrderSearch.formSubmit();
      // this.formSubmit();
    },
    dialogSure(orderIds, order, append, prod) {
      // console.log(order);
      this.dialog = false;
      if (this.action === 'xgshxx') {
        this.xgshxx(order);
        return;
      }
      if (this.action === 'jbz') {
        this.jbz(orderIds, order, append);
      }
      if (this.action === 'xgzbb') {
        this.xgzbb(orderIds, prod);
      }
    },
    dialogCancel() {
      this.dialog = false;
    },
    sizeChangeHandler(args) {
      this.pageSize = args;
      this.research();
    },
    currentChangeHandler(args) {
      this.pageNumber = args;
      this.research();
    },
    checkToggle() {
      this.checkMore = !this.checkMore
    },
    formSubmit: function(...args) {
      this.loading = true;
      let query = {}
      query.queryCondition = {};
      query.pageSize = this.pageSize;
      query.pageNumber = this.pageNumber;
      query.queryCondition = args[0] || {};
      // query.queryCondition.beginPayTime = dateFormat(new Date().getTime() - 3600 * 1000 * 24 * 90, 'yyyy-mm-dd') + ' 23:59:59';
      // query.queryCondition.endPayTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      if (args[1]) {
        query.queryCondition.beginPayTime = args[1][0];
        query.queryCondition.endPayTime = args[1][1];
      }
      // query.queryCondition.beginCreateTime = dateFormat(new Date().getTime() - 3600 * 1000 * 24 * 90, 'yyyy-mm-dd') + ' 23:59:59';
      // query.queryCondition.endCreateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      if (args[2]) {
        query.queryCondition.beginCreateTime = args[2][0];
        query.queryCondition.endCreateTime = args[2][1];
      }
      if (this.fullPath === 'undisorder') {
        query.queryCondition.errorType = ['-8'];
      }
      if (this.fullPath === 'deadorder') {
        query.queryCondition.errorType = ['-1'];
      }
      if (query.queryCondition.errorType === '' || !query.queryCondition.errorType) {
        query.queryCondition.errorType = ['-2', '-3', '-4', '-5', '-6', '-7', '-999'];
      }
      axios.post('/order/order/queryErrorOrders', query).then(res => {
        this.loading = false;
        this.orderData = JSON.parse(res.request.response)
      }).catch((err) => {
        this.loading = false;
        MessageBox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
  },
  components: {
    ErrorOrderSearch,
    ErrorOrderList,
    ErrorOrderDialog,
  },
  activated() {
    this.fullPath = this.$route.fullPath.substring(1, this.$route.fullPath.length);
    this.formSubmit();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';

.err-order-page {
  padding: @normalSize;
}

.head {
  font-size: 14px;
  border-bottom: solid 1px @gary;
  padding: 8px 0 @normalSize 0;
}

.right-btn {
  position: absolute;
  right: 2%;
  z-index: 2;
}

.none {
  display: none;
}
</style>
