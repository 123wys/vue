<template>
  <div class="statement">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>财务结算</el-breadcrumb-item>
      <el-breadcrumb-item>对账单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form">
      <el-form label-width="100px" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="售卖渠道">
              <el-select placeholder="请选择" v-model="queryCondition.shopId" filterable key="platA" clearable size='small'>
                <el-option-group v-for="group in allChannel" :label="group.label" v-if="group.show">
                  <el-option v-for="(key, value) in group.options" :label="key" :value="value">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-select v-model="queryCondition.supplierTenantId" placeholder="全部" :disabled="[1, 2].includes(ichannel.tenantInfo.tenantType)" filterable key="supA" clearable size='small'>
                <el-option v-for="item in supplierIdEnum" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账期">
              <div>
                <el-date-picker size='small' v-model="dateValue" type="daterange" align="left" placeholder="选择日期范围" :picker-options="pickerOptions">
                </el-date-picker>
                <!-- <el-button size='small'>记住账期</el-button> -->
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算订单">
              <div>
                <el-checkbox-group v-model="typeArr">
                  <el-checkbox label="1" name="type">待发货</el-checkbox>
                  <el-checkbox label="2" name="type">已发货</el-checkbox>
                  <el-checkbox label="3" name="type">已完成</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="售后单类型" v-show="false">
              <div>
                <el-checkbox-group v-model="typeArr">
                  <el-checkbox label="4" name="type">退款中</el-checkbox>
                  <el-checkbox label="5" name="type">退款关闭</el-checkbox>
                  <el-checkbox label="6" name="type">退款成功</el-checkbox>
                  <el-checkbox label="7" name="type">退货中</el-checkbox>
                  <el-checkbox label="8" name="type">退货关闭</el-checkbox>
                  <el-checkbox label="9" name="type">退货成功</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label=" ">
            <el-button type="primary" @click='queryVerify' size='small' style='width:68px'>查询</el-button>
            <el-button type="success" @click='goTask' size='small' style='width:68px'>查看导出</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column label="售卖渠道" width="140">
        <template scope="scope">
          <span v-text='shopEnum[scope.row.shopId]'></span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" width="140">
        <template scope="scope">
          <span v-text='supplierNameEnum[scope.row.supplierId]'></span>
        </template>
      </el-table-column>
      <el-table-column label="结算日期">
        <template scope="scope">
          <span v-text="dateString"></span>
        </template>
      </el-table-column>
      <el-table-column label="销售商品总数（件）" width="170" class='hello'>
        <template scope="scope">
          <div v-text='numMap(scope.row.totalNum)' style="padding-left:20px"></div>
        </template>
      </el-table-column>
      <el-table-column prop="totalMoney" label="销售总额（元）" align="right" width="150">
        <template scope="scope">
          <div v-text='moneyMap(scope.row.totalMoney)' style="padding-right:20px"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right">
        <template scope="scope">
          <el-button size="small" @click="exportFast(scope.row)" v-if="supplierNameEnum[scope.row.supplierId]">导出账单</el-button>
          <el-button size="small" @click="goDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination ref="hello" class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import dateFormat from 'dateFormat'
let queryVerifyUrl = '/finance/report/queryVerify'
let exportFast = '/finance/report/requestFastExcel'
export default {
  name: 'account-statement',
  data() {
    let aMonthAgo = new Date();
    aMonthAgo.setMonth(new Date().getMonth() - 1, new Date().getDate() + 1)
    return {
      dateString: '',
      loading: false,
      tableData: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now() || Date.now() - time.getTime() > 3600 * 1000 * 24 * 90;
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      //  查询条件
      orderVerifyTypeEnum: {
        1: 'tobeShipped',
        2: 'delivery',
        3: 'signed',
        4: 'refunding',
        5: 'refundCancel',
        6: 'refundSuccess',
        7: 'returning',
        8: 'returnCancel',
        9: 'returnSuccess'
      },
      typeArr: ['2', '3', '5', '8'],
      dateValue: [aMonthAgo, new Date()],
      queryCondition: {
        shopId: '', //  售卖渠道
        supplierTenantId: '', //  供应商 --(目前是供应商)
        beginPayTime: '',
        endPayTime: '',
        orderVerifyType: {},
      }
    }
  },
  computed: {
    ...mapGetters([
      'ichannel',
    ]),
    //  所有店铺枚举
    shopEnum() {
      return this.$store.state.enumSet.shopEnum;
    },
    supplierIdEnum() {
      let supplierenum = this.getArr(this.$store.state.enumSet.supplierEnum);
      return supplierenum
    },
    supplierNameEnum() {
      return this.$store.state.enumSet.supplierEnum;
    },
    myChannel() {
      let channelEnum = this.$store.state.enumSet.channelEnum;
      let id = this.$store.getters.ichannel.tenantInfo.tenantId;
      delete channelEnum[id];
      return channelEnum;
    },
    myShop() {
      return this.$store.state.enumSet.shopEnum;
    },
    allChannel() {
      let group = [{
        label: '全部',
        options: {
          '': '所有店铺与渠道',
        },
        show: false,
      }, {
        label: '我的店铺',
        options: {
          // 'allShop': '全部店铺',
          ...this.myShop,
        },
        show: true,
      }, {
        label: '我的分销渠道',
        options: {
          // 'allChannel': '全部渠道',
          ...this.myChannel,
        },
        show: true,
      }];
      if (Object.keys(this.myChannel).length === 0) {
        group[2].show = false;
      }
      if (Object.keys(this.myShop).length === 0) {
        group[1].show = false;
      }
      if (Object.keys(this.myShop).length && Object.keys(this.myChannel).length) {
        group[0].show = true;
      }
      if (Object.keys(this.myChannel).length > 1) {
        // group[2].options['allChannel'] = '全部渠道';
        group[2].options[''] = '全部渠道';
        group[2].options = this.objReverse(group[2].options);
      }
      if (Object.keys(this.myShop).length > 1) {
        // group[1].options['allShop'] = '全部店铺';
        group[1].options[''] = '全部店铺';
        group[1].options = this.objReverse(group[1].options);
      }
      return group;
    },
    warrantyStatus() {
      let options = this.getArr(this.$store.state.enumSet.warrantyStatus);
      options.forEach(ele => {
        if (ele.value === '0') {
          ele.label = '没有售后';
        }
        if (ele.label === '全部') {
          ele.value = 'all';
        }
      })
      return options;
    },
    orderStatus() {
      let obj = this.$store.state.enumSet.orderType;
      let arr = [];
      for (var k in obj) {
        arr.push({
          value: k,
          label: obj[k].label
        })
      }
      let result = arr.filter(ele => {
        return ele.label !== '已关闭' && ele.label !== '全部'
      })
      result.push({
        value: ['-1', '999'],
        label: '已关闭'
      });
      result.unshift({
        value: '',
        label: '全部'
      });
      return result
    },
    exportOrderStatus() {
      let obj = this.$store.state.enumSet.orderType;
      let arr = [];
      for (var k in obj) {
        arr.push({
          value: k,
          label: obj[k].label
        })
      }
      let result = arr.filter(ele => {
        return ele.label !== '已关闭' && ele.label !== '全部'
      })
      result.push({
        value: 999,
        label: '已关闭'
      });
      return result;
    },
  },
  activated() {
    // console.log(this.$refs.hello.$el.previousElementSibling)
    this.queryVerify();
  },
  methods: {
    goTask() {
      this.$router.push({
        path: '/taskCenter',
        query: {
          type: 'fastExport'
        }
      })
    },
    exportFast(item) {
      var data = {
        shopId: item.shopId,
        supplierTenantId: item.supplierId,
        beginDate: dateFormat(this.dateValue[0], 'yyyy-mm-dd') + ' 00:00:00',
        endDate: dateFormat(this.dateValue[1], 'yyyy-mm-dd') + ' 23:59:59'
      }
      this.axios.post(exportFast, data).then(res => {
        if (res.data === 1) {
          this.$message.success('导出快速对账单操作成功');
        } else {
          this.$message.error('操作失败，请重试')
        }
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '导出快速对账单失败' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    getDate(dateValue, type) {
      if (!dateValue) {
        return false;
      } else {
        if (!dateValue[0]) {
          return false;
        } else {
          return dateValue[type];
        }
      }
    },
    goDetail(row) {
      var data = Object.assign({
        beginPayTime: dateFormat(this.dateValue[0], 'yyyy-mm-dd') + ' 00:00:00',
        endPayTime: dateFormat(this.dateValue[1], 'yyyy-mm-dd') + ' 23:59:59',
        orderVerifyType: this.queryCondition.orderVerifyType
      }, row);
      window.sessionStorage.freeReport = JSON.stringify(data);
      this.$router.push({
        path: '/freeReport/freeReportDetail'
      })
    },
    numMap(num) {
      return Number(num).toLocaleString()
    },
    moneyMap(money) {
      return Number(money).toFixed(2).toLocaleString()
    },
    queryVerify() {
      this.loading = true;
      this.queryCondition.orderVerifyType = {
        tobeShipped: '',
        delivery: '',
        signed: '',
        refunding: '',
        refundCancel: '',
        refundSuccess: '',
        returning: '',
        returnCancel: '',
        returnSuccess: ''
      };
      for (var i = this.typeArr.length - 1; i >= 0; i--) {
        this.queryCondition.orderVerifyType[this.orderVerifyTypeEnum[this.typeArr[i]]] = this.typeArr[i];
      };
      if (this.dateValue && this.dateValue[0] && this.dateValue[1]) {
        this.queryCondition.beginPayTime = dateFormat(this.dateValue[0], 'yyyy-mm-dd') + ' 00:00:00'
        this.queryCondition.endPayTime = dateFormat(this.dateValue[1], 'yyyy-mm-dd') + ' 23:59:59'
        this.dateString = this.queryCondition.beginPayTime.slice(0, 10) + '~' + this.queryCondition.endPayTime.slice(0, 10);
      } else {
        this.$message({
          message: '只支持三个月内账单查询',
          type: 'warning'
        });
        return false;
      }
      let data = {
        queryCondition: this.queryCondition || {},
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      this.axios.post(queryVerifyUrl, data).then(res => {
        this.tableData = res.data.beanList;
        this.total = res.data.amount;
        this.loading = false;
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取账单数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
        this.loading = false;
      })
    },
    getArr(obj) {
      let arr = [];
      for (var k in obj) {
        arr.push({
          value: k,
          label: obj[k]
        })
      }
      arr.unshift({
        value: '',
        label: '全部'
      })
      return arr
    },
    objReverse(val) {
      var arr = [];
      var obj = {};
      for (var k in val) {
        arr.unshift({
          label: k,
          value: val[k]
        })
      }
      for (var i = 0; i < arr.length; i++) {
        (function(i) {
          obj[arr[i].label] = arr[i].value
        })(i)
      }
      return obj;
    },
    //  分页尺寸变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryVerify();
    },
    //  当前页
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.queryVerify();
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.statement {
  color: @lightBlack;
  padding: 15px;
}

.el-form-item {
  margin-bottom: 10px;
}

.pagination {
  text-align: right;
  margin: 20px 0 20px 0;
}
</style>
