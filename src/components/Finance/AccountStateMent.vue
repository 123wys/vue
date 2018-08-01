<template>
  <div class="statement">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>财务结算</el-breadcrumb-item>
      <el-breadcrumb-item>对账单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form">
      <el-form label-width="80px" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="售卖渠道">
              <el-select placeholder="请选择" v-model="queryCondition.platformId" filterable key="platA" clearable size='small'>
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
          <el-form-item label=" ">
            <el-button type="primary" @click='queryVerify' size='small' style='width:68px'>查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%">
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
          <span v-text='timeFormat(dateValue)[0].slice(0,10)'></span>&nbsp~&nbsp<span v-text='timeFormat(dateValue)[1].slice(0,10)'></span>
        </template>
      </el-table-column>
      <el-table-column label="销售商品总数（件）" width="170" class='hello'>
        <template scope="scope">
          <div v-text='numMap(scope.row.totalNum)' style="padding-left:20px"></div>
        </template>
      </el-table-column>
      <el-table-column prop="totalMoney" label="销售总额（元）" align="right"  width="150">
        <template scope="scope">
          <div v-text='moneyMap(scope.row.totalMoney)' style="padding-right:20px"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right">
        <template scope="scope">
          <el-button size="small" @click="goDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
import dateFormat from 'dateFormat'
// var testDate = {
//   'amount': 117,
//   'beanList': [{
//     'shopId': 100000000001,
//     'supplierId': 100000000001,
//     'totalMoney': 7291420,
//     'totalNum': 285
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000002,
//     'totalMoney': 57833400,
//     'totalNum': 3517
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000003,
//     'totalMoney': 26116500,
//     'totalNum': 1375
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000004,
//     'totalMoney': 8316400,
//     'totalNum': 355
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000006,
//     'totalMoney': 1030460,
//     'totalNum': 98
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000007,
//     'totalMoney': 1205840,
//     'totalNum': 156
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000008,
//     'totalMoney': 38437000,
//     'totalNum': 1168
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000009,
//     'totalMoney': 1761800,
//     'totalNum': 100
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000011,
//     'totalMoney': 3016000,
//     'totalNum': 190
//   }, {
//     'shopId': 100000000001,
//     'supplierId': 100000000012,
//     'totalMoney': 745000,
//     'totalNum': 25
//   }]
// }
let queryVerifyUrl = '/finance/report/queryVerify'
export default {
  name: 'account-statement',
  data() {
    let threeMonthAgo = new Date();
    threeMonthAgo.setTime(threeMonthAgo.getTime() - 3600 * 1000 * 24 * 90);
    return {
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
      dateValue: [threeMonthAgo, new Date()],
      queryCondition: {
        platformId: '', //  售卖渠道
        supplierTenantId: '', //  供应商 --(目前是供应商)
        beginPayTime: '',
        endPayTime: ''
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
        group[2].options['allChannel'] = '全部渠道';
        group[2].options = this.objReverse(group[2].options);
      }
      if (Object.keys(this.myShop).length > 1) {
        group[1].options['allShop'] = '全部店铺';
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
    this.queryVerify();
  },
  methods: {
    goDetail(row) {
      var data = Object.assign({
        beginPayTime: this.dateValue[0],
        endPayTime: this.dateValue[1]
      }, row);
      window.sessionStorage.freeReport = JSON.stringify(data);
      console.log(window.sessionStorage.freeReport);
    },
    numMap(num) {
      return Number(num).toLocaleString()
    },
    moneyMap(money) {
      return Number(money).toFixed(2).toLocaleString()
    },
    timeFormat: function(time) {
      if (time[0] === null && time[1] === null) {
        return ['', ''];
      };
      if (time.length > 0) {
        let t = time;
        t[0] = dateFormat(t[0], 'yyyy-mm-dd') + ' 00:00:00';
        t[1] = dateFormat(t[1], 'yyyy-mm-dd') + ' 23:59:59';
        if (new Date(t[1]).getTime() - new Date(t[0]).getTime() > 3600 * 1000 * 24 * 91) {
          return false;
        }
        return t;
      }
    },
    queryVerify() {
      let time = this.timeFormat(this.dateValue);
      if (time) {
        this.queryCondition.beginPayTime = time[0];
        this.queryCondition.endPayTime = time[1];
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
        // console.log(data, queryVerifyUrl);
      this.axios.post(queryVerifyUrl, data).then(res => {
        this.tableData = res.data.beanList;
        this.total = res.data.amount;
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
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
