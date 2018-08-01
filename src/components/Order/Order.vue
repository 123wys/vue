<template>
  <div class="order-page">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>所有订单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="right-btn">
      <!-- <el-button type="text" @click="openUpload('order')"><i class="icon iconfont icon-daoru"></i><span>导入订单</span>
      </el-button> -->
      <!-- <el-button type="text"><i class="icon iconfont icon-xinjiandingdan"></i><span>新建订单</span></el-button> -->
      <el-button type="text" @click="orderInport"><i class="icon iconfont icon-daoru1 orderExport" style="font-size:14px"></i><span>导入外部订单</span></el-button>
      <el-button type="text" @click="orderExport"><i class="icon iconfont icon-daochu orderExport"></i><span>导出订单</span></el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="labelChange">
      <el-tab-pane v-for='labelName in labelNames' v-bind:name="labelName.status">
        <span slot="label">
          {{labelName.label}}
          <i v-if="7 == labelName.status" class="orderamount">{{orderamount.auditNum}}</i>
          <i v-else-if="1 == labelName.status" class="orderamount">{{orderamount.presellNum}}</i>
          <i v-else-if="6 == labelName.status"  class="orderamount">{{orderamount.shipNum}}</i>
        </span>
      </el-tab-pane>
    </el-tabs>
    <order-search ref="orderSearch" :state="activeName" :moreCheckToggle="checkMore" @actionCheck="checkToggle" @formSubmit="formSubmit"></order-search>
    <div v-if="searchedFlag" v-loading="loading" element-loading-text="拼命加载中">
      <order-list :order-data="orderData" :status="activeName" :page-size="pageSize" :page-number="pageNumber" ref="orderList" @action="actionHandler(...$event)" @batch-action="batchActionHandler" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></order-list>
    </div>
    <order-dialog :action="action" :edited-orders="editedOrders" :dialog="dialog" @dialog-sure="dialogSure" @dialog-cancel="dialogCancel" ref="orderDialog"></order-dialog>
    <el-dialog v-model="orderTrackShow" title="订单轨迹" size="small" custom-class="orderTrackDialog">
      <order-track :orderTrack="orderTrack"></order-track>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="orderTrackShow = false">确 定</el-button>
      </span>
    </el-dialog>
    <upload :url="uploadUrl" @callback="uploadCallback" v-model="uploadDialog">
      <div slot="content-bottom" class="reminder">导入文件请通过
        <el-button type="text" @click="orderExport">导出订单</el-button> 功能下载</div>
    </upload>
    <print-order-dialog v-if="searchedFlag" ref="printOrderDialog" @printConfirm="printConfirm"></print-order-dialog>
    <cn-print v-if="searchedFlag && doConnect" ref="cnPrint" :selectOrders="selectOrders"></cn-print>
    <div id="electronic" v-show="false">
      <!--打印电子面单专用-->
    </div>
  </div>
</template>
<script>
import BreadcrumbNav from '../common/BreadcrumbNav';
import Upload from '../common/Upload';
import OrderSearch from './OrderSearch';
import OrderList from './OrderList';
import OrderTrack from './OrderTrack';
import OrderDialog from './OrderDialog';
import axios from 'axios';
import dateFormat from 'dateFormat';
import bus from '../../store/bus.js';
import getLodop from '../../LodopFuncs.js';
import callPrint from '../../print_busi.js';
import PrintOrderDialog from './PrintOrderDialog';
import CnPrint from './CnPrint';
import {
  getSingleNum,
  addSpecial,
  addGoodsDetail,
  styleAdjust
} from '../../assets/orderPrintStyle.js';
import {
  doConnect
} from '../../assets/printWebSocket.js';
let shtgUrl = 'order/order/auditOrder';
let xgshxxUrl = 'order/order/editConsignee';
// let gcUrl = 'order/order/modifyRepository';
let ppgysUrl = 'order/order/matchSupplier'
let fhUrl = 'order/order/delivery';
let zysUrl = 'order/order/returnPresell';
let qxddUrl = 'order/order/cancelled';
let thshUrl = 'order/order/returnAudit';
let jbzUrl = 'order/order/appendComment';
let qrdhUrl = 'order/order/arrivalStock';
let uploadOrderUrl = 'upload/importOrder';
let uploadLogisticsUrl = 'upload/importLogistics';
let orderStatUrl = 'order/order/orderStat';
export default {
  name: 'order',
  data() {
    return {
      checkMore: false, // 精确查询开关
      orderData: {
        amount: 0,
        beanList: [],
      },
      activeName: 'all',
      labelNames: [{
        label: '全部订单',
        status: 'all'
      }, {
        label: '待审核',
        status: '7',
      }, {
        label: '待发货',
        status: '1'
      }, {
        label: '已发货',
        status: '3'
      }, {
        label: '有售后',
        status: 'sixth'
      }, {
        label: '周期送',
        status: 'cycleSend',
      }],
      // {
      //   label: '已关闭',
      //   status: '-1'
      // }, {
      //   label: '已完成',
      //   status: '4'
      // }, {
      //   label: '三个月前订单',
      //   status: 'nineth'
      // }
      // ],
      orderamount: {
        auditNum: 0,
        presellNum: 0,
        shipNum: 50
      },
      action: '', // 订单执行动作
      dialog: false, // 回退审核弹框
      editedOrders: [],
      pageSize: 20,
      pageNumber: 1,
      uploadUrl: '',
      loading: false,
      searchedFlag: false,
      orderTrack: [],
      orderTrackShow: false,
      orderId: '',
      uploadDialog: false,
      selectOrders: [],
    }
  },
  computed: {
    operatorEnum() {
      return this.$store.state.enumSet.operatorEnum;
    },
    jurisdiction() {
      return this.$store.getters.jurisdiction;
    },
    doConnect() {
      return doConnect();
    },
  },
  methods: {
    // tab切换
    labelChange() {
      let status = this.activeName;
      if (status === 'all') status = '';
      if (status === '3') {
        this.formSubmit({
          orderStatus: ['-1', 3, 4, 999]
        });
        return;
      }
      if (status === 'sixth') {
        this.formSubmit({
          orderStatus: '',
          warrantyStatus: [1, 3, 4, 6, 7],
        })
        return;
      }
      if (status === 'cycleSend') {
        this.formSubmit({
          orderKind: 5,
        })
        return;
      }
      this.formSubmit({
        orderStatus: status
      })
    },
    //  订单导入
    orderInport() {
      this.$router.push({
        path: '/orderAdd'
      })
    },
    actionHandler(i, j, action) {
      this.action = action;
      if (action === 'qrdh') { // 确认到货
        this.qrdh([this.orderData.beanList[i].orders[j].orderId]);
        return
      }
      if (action === 'ppgys') { // 匹配供应商
        this.ppgys([this.orderData.beanList[i].orders[j].orderId]);
        return
      }
      if (action === 'shtg') { //  审核通过
        this.shtg([this.orderData.beanList[i].orders[j].orderId]);
        return;
      }
      if (action === 'zys') { //  转预售
        this.zys([this.orderData.beanList[i].orders[j].orderId]);
        return;
      }
      if (['thsh', 'jbz', 'xgshxx', 'gc', 'qxdd', 'fh'].includes(action)) {
        this.dialog = true;
        this.editedOrders = [this.orderData.beanList[i].orders[j]];
        return
      }
    },
    batchActionHandler(action) {
      // if (['dywld', 'dyfhd', 'cnes'].includes(action)) { // 打印权限管理
      //   //todo
      // }
      if (action === 'cyd') { //  传运单
        this.openUpload('logistics');
        return;
      }
      if (!this.$refs.orderList.selection.length) {
        this.$message.error({
          message: '请至少选择一项！',
        })
        return;
      }
      this.action = action;
      let orderIds = this.$refs.orderList.selection.map(n => n.orderId);
      if (action === 'qrdh') {
        this.qrdh(orderIds);
        return
      }
      if (action === 'shtg') {
        this.shtg(orderIds);
        return;
      }
      if (action === 'zys') {
        this.zys(orderIds);
        return;
      }
      if (action === 'ppgys') {
        this.ppgys(orderIds);
        return;
      }
      if (action === 'dyfhd') { // 打印发货单
        if (this.isSafari()) {
          this.$message.info('打印插件仅支持windows系统');
          this.action = '';
          return;
        }
        let myLodop;
        try {
          myLodop = getLodop();
        } catch (e) {
          console.log(e);
        }
        if (!myLodop) {
          this.$message.info('请安装打印插件，并重启浏览器');
          return;
        }
        this.$refs.printOrderDialog.dialogShow = true;
        this.$refs.printOrderDialog.makeSure = true;
        // callPrint(this.dataFormat(this.$refs.orderList.selection, 1));
        return
      }
      if (action === 'cnes') { // 打印菜鸟面单
        if (this.doConnect) {
          if (this.$refs.orderList.selection.length > 10) {
            this.$message.info('菜鸟提醒您，批量打印每次不要超过 10 个哦~');
            return;
          }
          this.selectOrders = this.$refs.orderList.selection;
          this.$refs.cnPrint.dialogShow = true;
          return;
        } else {
          var result = window.confirm('请先安装菜鸟打印组件，安装完成后重启浏览器即可');
          if (result) {
            window.open('https://www.cainiao.com/markets/cnwww/print');
          }
          return;
        }
      }
      if (['thsh', 'jbz', 'xgshxx', 'gc', 'qxdd', 'fh', 'dywld'].includes(action)) {
        if (action === 'dywld') {
          if (this.isSafari()) {
            this.$message.info('打印插件仅支持windows系统');
            this.action = '';
            return;
          }
          let myLodop;
          try {
            myLodop = getLodop();
          } catch (e) {
            console.log(e);
          }
          if (!myLodop) {
            this.action = '';
            this.$message.info('请安装打印插件，并重启浏览器');
            return;
          }
        }
        this.dialog = true;
        this.editedOrders = this.$refs.orderList.selection;
        return
      }
    },
    qrdh(orderIds) { // 确认到货
      this.changeOrder(axios.post(qrdhUrl, {
        orderIds: orderIds,
      }), '正在发送到货请求', '请求成功，请稍后查再看订单状态', 1000);
    },
    ppgys(orderIds) { // 匹配供应商
      this.changeOrder(axios.post(ppgysUrl, {
        orderIds: orderIds,
      }), '正在发送匹配请求', '请求成功，请稍后查再看订单', 1000);
    },
    shtg(orderIds) { // 审核通过
      this.changeOrder(axios.post(shtgUrl, {
        orderIds: orderIds,
        approved: true,
      }), '正在更新订单状态', '审核通过！订单流转为“待发货”');
    },
    zys(orderIds) { // 转预售
      this.changeOrder(axios.post(zysUrl, {
        orderIds: orderIds,
      }), '正在更新订单状态', '订单流转为“预售”');
    },
    xgshxx(order) { // 修改收货信息
      this.changeOrder(axios.post(xgshxxUrl, {
        orderId: order.orderId,
        receiverState: order.receiverState,
        receiverCity: order.receiverCity,
        receiverDistrict: order.receiverDistrict,
        receiverTown: '',
        receiverAddress: order.receiverAddress,
        receiverName: order.receiverName,
        receiverMobile: order.receiverMobile,
      }));
    },
    // gc(orderIds, order) { // 改仓
    //   this.changeOrder(axios.post(gcUrl, {
    //     orderIds: orderIds,
    //     warehouseId: order.warehouseId,
    //   }));
    // },
    fh(order, itemIds) { // 发货
      let content = {
        orderId: order.orderId,
        deliveryInfos: [{
          companyCode: order.logisticsCompanyId,
          deliveryNo: order.logisticsNo,
        }],
      };
      if (itemIds) {
        content.deliveryInfos[0].itemIds = itemIds;
      }
      this.changeOrder(axios.post(fhUrl, content), '正在发送发货请求', '请求成功，请稍后查看订单状态”', 1000);
    },
    qxdd(orderIds, order, append) { // 取消订单
      this.changeOrder(axios.post(qxddUrl, {
        orderIds: orderIds,
        comment: order.remarks + append,
      }), '正在更新订单状态', '订单已取消！');
    },
    jbz(orderIds, order, append) { // 加备注
      this.changeOrder(axios.post(jbzUrl, {
        orderIds: orderIds,
        comment: order.remarks + append,
      }));
    },
    thsh(orderIds, order) { // 退回审核
      this.changeOrder(axios.post(thshUrl, {
        orderIds: orderIds,
        comment: order.comment,
      }), '正在更新订单状态', '退审成功！订单流转为“待审核”');
    },
    // 修改订单，默认修改订单信息
    changeOrder(xhrPromise, loadingMsg = '正在更新订单信息', successMsg = '订单信息更改成功', researchTime) {
      let loading = this.$loading({
        text: loadingMsg
      });
      xhrPromise.then(response => {
        loading.close();
        this.$message.success({
          message: successMsg,
        });
        window.setTimeout(() => {
          this.research();
        }, researchTime);
      }).catch(err => {
        loading.close();
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    research() {
      this.$refs.orderSearch.formSubmit();
      this.getOrderAmount();
    },
    dialogSure(orderIds, order, append, itemId) {
      this.dialog = false;
      if (this.action === 'xgshxx') {
        this.xgshxx(order);
        return;
      }
      if (this.action === 'gc') {
        this.gc(orderIds, order);
        return;
      }
      if (this.action === 'fh') {
        this.fh(order, itemId);
        return;
      }
      if (this.action === 'qxdd') {
        this.qxdd(orderIds, order, append);
      }
      if (this.action === 'jbz') {
        this.jbz(orderIds, order, append);
      }
      if (this.action === 'thsh') {
        this.thsh(orderIds, order);
      }
      if (this.action === 'dywld') { // 打印相关
        let copyData = Object.assign({}, order);
        let arr = this.$refs.orderList.selection.filter(n => n.orderStatus === 1);
        if (arr.length === 0) {
          this.$message.info('请选择" 待发货 "订单进行打印');
          return;
        }
        if (order.isElectronic > 0) { // 电子面单
          var key = {
            num: 1
          }; // 存储开关;
          let length = 0; // 最后一次打单完成后，重查一次订单
          // let _self = this;
          for (let i = 0; i < arr.length; i++) { // 快递鸟仅支持 20次/s 的并发处理
            length++;
            setTimeout(() => {
              this.printEle(arr, arr[i], order, copyData, length, key);
            }, (i + 1) * 333)
              // (function(arr, arrBean, order, copyData, length, key, i, self) {
              //   setTimeout(function() {
              //     self.printEle(arr, arrBean, order, copyData, length, key);
              //   }, (i + 1) * 333)
              // })(arr, arr[i], order, copyData, length, key, i, _self);
              // this.printEle(arr, arr[i], order, copyData, length, key);
          }
        } else { // 物流单
          this.$refs.orderDialog.createInfo(copyData.isCreate, copyData);
          let newArr = this.dataFormat(arr, 2, order.logisticType, order);
          newArr[4] = order.printer;
          newArr[3][8] = order.monthlyCoding;
          callPrint(newArr);
          this.logOrderPrint(order);
        }
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
      let query = {}; // 查询条件
      query.queryCondition = {};
      query.pageSize = this.pageSize;
      query.pageNumber = this.pageNumber;
      query.queryCondition = Object.assign({}, args[0]);
      // if (query.queryCondition.orderStatus === '' && !query.queryCondition.mix) { // 默认不显示已签收（完成）
      //   query.queryCondition.orderStatus = [1, 2, 3, 5, 6, 7];
      // }
      if (['1', '7'].includes(this.activeName) && !query.queryCondition.warrantyStatus) { // 待审核 待发货 加入字段 warrantyStatus = 0
        if (this.activeName === '1') {
          query.queryCondition.warrantyStatus = [0, 2, 5];
          query.queryCondition.itemStatus = 1;
        }
      }
      // 手动选择 全部售后状态
      if (query.queryCondition.warrantyStatus === 'all') query.queryCondition.warrantyStatus = '';
      // 添加默认时间
      // 全部默认三个月
      // if (this.activeName === 'all' || this.activeName === 'sixth') {
      if (!query.queryCondition.mix) {
        // 默认时间
        query.queryCondition.beginCreateTime = dateFormat(Date.now() - 3600 * 1000 * 24 * 90, 'yyyy-mm-dd') + ' 00:00:00';
        query.queryCondition.endCreateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      } else {
        // 当有mix参数时默认不加时间范围
        query.queryCondition.beginCreateTime = '';
        query.queryCondition.endCreateTime = '';
      }
      // }
      // 除周期购页面，限定结束时间为当前时间，避免查出未来的周期送订单
      if (this.activeName !== 'cycleSend') {
        query.queryCondition.endCreateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
      }
      if (args[1]) { // 付款时间
        query.queryCondition.beginPayTime = args[1][0];
        query.queryCondition.endPayTime = args[1][1];
      }
      if (Object.keys(query.queryCondition).includes('haveSupplier')) {
        if (query.queryCondition.haveSupplier) {
          query.queryCondition.haveSupplier = 'isNull';
        } else {
          delete query.queryCondition.haveSupplier;
        }
      }
      if (Object.keys(query.queryCondition).includes('haveMemo')) {
        if (query.queryCondition.haveMemo) {
          query.queryCondition.haveMemo = 'notNull';
        } else {
          delete query.queryCondition.haveMemo;
        }
      }
      // 排序
      if (this.activeName === 'cycleSend') {
        query.sortType = {
          sortType: 'createTime',
          direction: 'ASCENDING',
        }
      } else {
        query.sortType = {
          sortType: 'payTime',
          direction: 'DESCENDING',
        }
      }
      axios.post('/order/order/queryOrderSimple', query).then(res => {
        this.loading = false;
        this.orderData = JSON.parse(res.request.response);
        this.searchedFlag = true;
      }).catch((err) => {
        this.loading = false;
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    getOrderAmount: function() {
      axios.post(orderStatUrl, {
        statTypes: [3, 4],
        // warrantyStatus: [0, 2, 5],
        // itemStatus: 1,
      }).then(response => {
        response.data.forEach(n => {
          if (n.type === 3) {
            this.orderamount.auditNum = n.count;
          } else if (n.type === 4) {
            this.orderamount.presellNum = n.count;
          }
        })
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    openUpload(type) {
      if (type === 'logistics') {
        this.uploadUrl = uploadLogisticsUrl;
        this.uploadDialog = true;
      } else if (type === 'order') {
        this.uploadUrl = uploadOrderUrl;
      }
    },
    uploadCallback() {
      this.$confirm('上传成功，稍后可在任务中心查看处理情况！', '提示', {
        cancelButtonText: '稍后再说',
        confirmButtonText: '现在前往',
        type: 'success',
      }).then(() => {
        this.$router.push('/taskcenter')
      });
      this.$store.commit('addTask', 'batchDeliver');
      this.research();
    },
    printConfirm(args) { // 打印发货单
      if (args[0]) {
        if (args[1].printType === 'a4') {
          let arr = this.dataFormat(this.$refs.orderList.selection, 1);
          arr[4] = args[2];
          callPrint(arr);
        } else {
          let arrElse = this.$refs.orderList.selection;
          for (let i = 0; i < arrElse.length; i++) {
            let newArr = [4, [
              ['']
            ], '', '', ''];
            newArr[3] = new Array(8).fill(' ');
            newArr[3][0] = this.operatorEnum[this.jurisdiction.opId];
            newArr[3][7] = this.jurisdiction.mobile;
            if (arrElse[i].supplierTenantId) {
              arrElse[i].shopTranslation = this.$store.getters.tenantEnum[arrElse[i].supplierTenantId];
            } else {
              arrElse[i].shopTranslation = this.$store.getters.tenantEnum[arrElse[i].tenantId];
            }
            callPrint(newArr, [], [arrElse[i], args[1].printType, args[2]]); // 开始打印
            //                     ↑订单orders  ↑ 物流公司     ↑ 打印机序号
          }
        }
        this.logOrderPrint(null, null, true); // 打印记录
      }
      this.$refs.printOrderDialog.dialogShow = false;
    },
    // 打印电子面单
    printEle(arr, arrBean, order, copyData, length, key) {
      let data = {
        eSheet: {
          Commodity: [], // 商品
          CustomerName: order.tenantAccount, // 电子面单账号 自行申请
          CustomerPwd: order.tenantSecret, // 电子面单密码
          ExpType: '1', // 快件类型 1.标准快件
          PayType: 1, // 快递付费方式 1.寄方付
          ShipperCode: order.logisticType, // 快递公司编码
          OrderCode: arrBean.orderId, // 订单编号
          IsReturnPrintTemplate: 1, // 返回电子面单模板 1.需要
          templateSize: order.templateSize,
          Sender: { // 发件人
            Name: order.senderName,
            Mobile: order.senderMobile,
            ProvinceName: order.senderProvince,
            CityName: order.senderCity,
            ExpAreaName: order.senderDistrict,
            Address: order.senderAdd,
          },
          Receiver: { // 收件人
            Name: arrBean.receiverName,
            Mobile: arrBean.receiverMobile,
            ProvinceName: arrBean.receiverState,
            CityName: arrBean.receiverCity,
            ExpAreaName: arrBean.receiverDistrict,
            Address: arrBean.receiverAddress
          },
        },
        elecId: order.elecId,
      };
      switch (order.logisticType) { // 各家物流公司 单独调试 单独加 入参
        case 'STO':
        case 'GTO':
        case 'HHTT':
        case 'XFEX':
          data.eSheet.SendSite = order.extraCode;
          break;
        case 'SF':
        case 'YTO':
          data.eSheet.MonthCode = order.extraCode;
          break;
        case 'ZJS':
          data.eSheet.LogisticCode = order.extraCode;
          break;
        case 'DBL':
          data.eSheet.PayType = 3;
          break;
      }
      for (let k = 0; k < arrBean.orderItems.length; k++) {
        data.eSheet.Commodity.push({
          GoodsName: arrBean.orderItems[k].skuTitle,
        });
      }
      axios.post('electronicSheet/es/es', data)
        .then(res => {
          if (res.data.Success || (res.data.PrintTemplate && res.data.PrintTemplate.startsWith('<!DOCTYPE html>'))) {
            if (key.num > 0) { // 仅新建发件、密钥
              this.$refs.orderDialog.createInfo(copyData.isCreate, copyData);
              key.num = 0;
            }
            if (order.autoDelivery > 0) { // 自动发货
              length === arr.length ? this.autoDelivery(res.data.Order, 1) : this.autoDelivery(res.data.Order);
            }
            document.querySelector('#electronic').innerHTML = res.data.PrintTemplate;
            // let tdDom = document.querySelectorAll('.print_paper')[document.querySelectorAll('.print_paper').length - 1].querySelector('td.xx10');
            if (['ZTO', 'STO'].includes(order.logisticType)) { // 去除双号码
              getSingleNum(order.logisticType, arrBean, order);
            }
            if (order.logisticType === 'STO') { // 申通电子面单样式更改
              styleAdjust(order.logisticType);
              addGoodsDetail(order.logisticType, arrBean);
              // addGoodsDetail(order.logisticType, tdDom, arrBean);
              if (order.special) { // 申通加专线
                addSpecial(order.logisticType);
              }
            }
            let logisticInfo = {
              logisticType: order.logisticType,
              templateSize: order.templateSize,
            };
            let strHTML = document.querySelector('#electronic').innerHTML;
            callPrint([3, [
              ['']
            ], '', '', ''], [strHTML, logisticInfo, order.printer]); // 开始打印
            this.logOrderPrint(order, res.data.Order.LogisticCode, false, arrBean); // 打印记录
          } else {
            this.$message.info(res.data.Reason);
            return;
          }
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
        })
    },
    // 格式化订单数据，供打单使用
    dataFormat(danjy, printType = 0, logistic = 0, order) {
      var aa = [printType, [],
        [],
        []
      ];
      for (var i = 0; i < danjy.length; i++) {
        aa[1][i] = [];
        aa[1][i].push(danjy[i].extOrderId);
        aa[1][i].push(danjy[i].receiverMobile);
        aa[1][i].push(danjy[i].receiverName);
        aa[1][i].push('');
        aa[1][i].push(danjy[i].receiverState);
        aa[1][i].push(danjy[i].receiverCity);
        aa[1][i].push(danjy[i].receiverDistrict);
        aa[1][i].push(danjy[i].receiverAddress);
        aa[1][i].push(danjy[i].buyerMessage);
        aa[2][i] = [logistic, 1, []];
        for (var j = 0; j < danjy[i].orderItems.length; j++) {
          aa[2][i][2][j] = [];
          aa[2][i][2][j].push(j + 1);
          aa[2][i][2][j].push(danjy[i].extOrderId);
          aa[2][i][2][j].push(danjy[i].orderItems[j].extSkuTitle);
          aa[2][i][2][j].push(danjy[i].orderItems[j].num);
          aa[2][i][2][j].push(danjy[i].orderItems[j].price);
          aa[2][i][2][j].push(danjy[i].orderItems[j].totalFee);
          if (danjy[i].supplierTenantId) {
            aa[2][i][2][j].push(this.$store.getters.tenantEnum[danjy[i].supplierTenantId]);
          } else {
            aa[2][i][2][j].push(this.$store.getters.tenantEnum[danjy[i].tenantId]);
          }
        };
      };
      if (order) {
        // 发件人信息
        aa[3].push(order.senderName);
        aa[3].push(order.senderCity);
        aa[3].push('');
        aa[3].push(order.senderProvince);
        aa[3].push(order.senderCity);
        aa[3].push(order.senderDistrict);
        aa[3].push(order.senderAdd);
        aa[3].push(order.senderMobile);
      } else {
        aa[3] = ['', '', '', '', '', '', '', ''];
      }
      return aa;
    },
    // 打单记录
    logOrderPrint(order, deliveryNo, isBillOfSale, arrBean) {
      let arr = this.$refs.orderList.selection;
      if (isBillOfSale) { // 打印出货单
        let printBeans = [];
        for (let i = 0; i < arr.length; i++) {
          printBeans.push({
            orderId: arr[i].orderId,
            sheetType: 2, // 面单类型 0.普通 1.电子面单 2.出货单
            autoDelivery: 0,
            companyName: 'NaN',
          });
        }
        axios.post('order/order/logOrderPrint', {
          printBeans
        }).catch(err => {
          this.$message.error(err.response ? err.response : err);
        })
      } else { // 打印快递单
        if (order.isElectronic > 0) {
          let logOrder = {
            printBeans: [{
              orderId: arrBean.orderId,
              sheetType: order.isElectronic,
              autoDelivery: order.autoDelivery,
              companyName: order.logisticType,
              deliveryNo,
            }],
          };
          axios.post('order/order/logOrderPrint', logOrder)
            .catch(err => {
              this.$message.error(err.response ? err.response : err);
            })
        } else {
          let printBeans = [];
          for (let i = 0; i < arr.length; i++) {
            printBeans.push({
              orderId: arr[i].orderId,
              sheetType: order.isElectronic, // 面单类型 0.普通 1.电子面单
              autoDelivery: 0, // 自动发货， 0.否, 1.是
              companyName: order.logisticType,
            });
          }
          axios.post('order/order/logOrderPrint', {
            printBeans
          }).catch(err => {
            this.$message.error(err.response ? err.response : err);
          })
        }
      }
    },
    // 打印电子面单后自动发货
    autoDelivery(resData, researchFlag) {
      let content = {
        orderId: resData.OrderCode,
        deliveryInfos: [{
          // companyCode: resData.logisticType,
          deliveryNo: resData.LogisticCode,
        }],
      };
      switch (resData.ShipperCode) {
        case 'YD':
          content.deliveryInfos[0].companyCode = 'YUNDA';
          break;
        case 'HHTT':
          content.deliveryInfos[0].companyCode = 'TTKDEX';
          break;
        case 'XFEX':
          content.deliveryInfos[0].companyCode = 'XFWL';
          break;
        default:
          content.deliveryInfos[0].companyCode = resData.ShipperCode;
          break;
      }
      axios.post(fhUrl, content)
        .then(() => {
          if (researchFlag > 0) {
            this.research();
          }
        })
        .catch(err => {
          this.$message.error(err.response ? err.response : err);
        })
    },
    // 订单轨迹模态框方式显示
    orderTrackHandle(orderId) {
      axios.post('/order/order/queryOperationLogs', {
        orderId
      }).then(res => {
        this.orderTrack = res.data;
        this.orderTrackShow = true;
      }).catch(err => {
        this.$message.error(err.response ? err.response : err);
      })
    },
    // 订单导出
    orderExport() {
      this.uploadDialog = false; //  下载框共用需要
      this.$refs.orderSearch.exportDialog = true;
    },
    isSafari() { // 判断是否为safari
      let browser = window.navigator.userAgent;
      if (browser.indexOf('Safari') > 0 && browser.indexOf('Chrome') < 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  components: {
    BreadcrumbNav,
    Upload,
    OrderSearch,
    OrderList,
    OrderDialog,
    OrderTrack,
    PrintOrderDialog,
    CnPrint
  },
  mounted() {
    let _self = this;
    bus.$on('orderTrack', function(orderId) {
      // console.log(orderId, platformId);
      _self.orderTrackHandle(orderId);
    })
  },
  activated() {
    this.$store.dispatch('setShopEnum');
    this.$store.dispatch('setPlatformEnum');
    this.getOrderAmount();
    if (this.$route.query.activeName) {
      this.activeName = `${this.$route.query.activeName}`;
    }
    this.labelChange();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.order-page {
  padding: @normalSize;
  position: relative;
}

.right-btn {
  position: absolute;
  right: 2%;
  z-index: 2;
  top: 42px;
}

.none {
  display: none;
}

.orderExport {
  font-size: 22px;
  margin-right: 5px;
}

.orderamount {
  color: @red;
  font-style: normal;
  font-weight: bold;
}

.reminder {
  margin-top: @baseSpace*2;
}
</style>
<style lang="less">
@import '../../main.less';
#app .order-page .orderTrackDialog {
  .el-dialog__title {
    font-size: @fontSize14;
  }
  .el-dialog__body {
    padding: @baseSpace * 4 @baseSpace * 3 @baseSpace * 6;
  }
}
</style>
