<template>
  <div class="OrderTapOne">
    <el-row class="index">
      <el-col class="index_left">
        <h1 class="left-title">
          <span>订单实时数据</span>
          <span  @click='getNum'>
            <svg class="icon refresh" aria-hidden="true">
                <use xlink:href="#icon-shuaxin"></use>
            </svg>
          </span>
        </h1>
        <div class="dataList"
          v-loading="numLoading"
          element-loading-text="拼命加载中"
        >
          <el-form ref="form" label-width="140px">
            <el-form-item v-for="item in orderLists" :label="item.status">
              <div v-text='numMap(item.num)' :style="{ color: item.color}" class="numStyle"></div>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col class="index_right">
        <h1>
          <el-row class="allShop">
          <el-col :span="18" class="right-header">
            <span v-for='(item, index) in orderTypes' v-text='item.label' :class="{'orderTypeChecked': item.active}" @click="orderTypeCheck(index)"></span>
          </el-col>
          <el-col :span="6" class='left-header'>
            <div class="table">
              <span v-for="(radio, index) in dateSelect" v-text="radio.label" :class="{'checked': radio.active}" @click="dateCheck(index, radio.statType)"></span>
            </div>
          </el-col>
        </el-row>
        </h1>
        <div class="echart" id="order-chart">
        </div>
      </el-col>
    </el-row>
    <div class="content-two">
      <h1 class="title-search">
        <span style='margin-right:20px'>历史成交订单数据</span>
        <el-date-picker
          size='mini'
          v-model="dateValue"
          type="daterange"
          align="left"
          placeholder="选择日期范围"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="info" size='mini' @click='searchTabel'>搜索</el-button>
      </h1>
      <el-table :data="tableData" style="width: 100%" v-loading="loadingTable" element-loading-text="拼命加载中">
        <el-table-column prop="payTime" align="center" label="成交日期">
        </el-table-column>
        <el-table-column prop="totalOrder" align="right" label="日订单总数">
        </el-table-column>
        <el-table-column prop="auditOrder" align="right" label="待审核">
        </el-table-column>
        <el-table-column prop="waitingOrder" align="right" label="待发货">
        </el-table-column>
        <el-table-column prop="aftersales" align="right" label="售后单">
        </el-table-column>
        <el-table-column prop="errorOrder" align="right" label="问题订单">
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import throttle from 'lodash/throttle'
import dateFormat from 'dateFormat'
import bus from '../../store/bus.js'
import debounce from 'lodash/debounce'
let orderStatUrl = 'order/order/orderStat'
let orderErrorUrl = 'order/order/queryErrorOrders'
let aftersaleUrl = 'afterSale/afterSale/query'
let queryOrderDayTableUrl = 'dataCenter/orderCenter/queryOrderDayTable'
let queryOrderDayImageUrl = 'dataCenter/orderCenter/queryOrderDayImage'
let option = {
  tooltip: {
    trigger: 'axis',
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    },
    top: 15,
    right: 20,
  },
  color: ['#4A90E2', '#00C0C2', '#EDC241', '#ED7C27', '#DB355A'],
  legend: {
    data: []
  },
  xAxis: {
    boundaryGap: false,
    data: [],
  },
  yAxis: {},
}
let chartsInit = function(id) {
  let charts = echarts.init(document.getElementById(id));
  window.addEventListener('resize', throttle(() => {
    if (document.getElementById(id)) {
      charts.resize();
    }
  }, 200), false);
  //  自适应部分代码end
  charts.hideLoading();
  charts.setOption(option);
  return charts;
}
export default {
  name: 'OrderTapOne',
  data() {
    return {
      loadingTable: false,
      numLoading: false,
      orderChat: null,
      orderTotal: 1000,
      dateSelect: [{
        label: '近7日',
        active: true,
        statType: 0,
      }, {
        label: '近30天',
        active: false,
        statType: 1,
      }],
      orderTypes: [{
        label: '日订单总数',
        active: true,
        type: 0
      }, {
        label: '待审核',
        active: false,
        type: 1
      }, {
        label: '待发货',
        active: false,
        type: 2
      }, {
        label: '售后单',
        active: false,
        type: 3
      }, {
        label: '问题订单',
        active: false,
        type: 4
      }],
      pickerOptions: {
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
      dateValue: [],
      tableData: [],
      queryCondition: {},
      //  分页条件
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      orderLists: [{
        num: '',
        status: '待分发：',
        pathTo: '/undisorder',
        color: '#4A90E2'
      }, {
        num: '',
        status: '待审核：',
        pathTo: '/order',
        activeName: 7,
        color: '#F5A623'
      }, {
        num: '',
        status: '待发货：',
        pathTo: '/order',
        activeName: 1,
        color: '#4A90E2'
      }, {
        num: '',
        status: '售后单：',
        pathTo: '/order',
        activeName: 3,
        color: '#66728C'
      }, {
        num: '',
        status: '问题订单：',
        pathTo: '/errororder',
        activeName: null,
        color: '#FF6161'
      }],
    }
  },
  computed: {
    activeDateStatType() {
      let asd;
      this.dateSelect.forEach(ele => {
        if (ele.active) {
          asd = ele.statType;
        }
      })
      return asd;
    },
    orderType() {
      let asd;
      this.orderTypes.forEach(ele => {
        if (ele.active) {
          asd = ele.type;
        }
      })
      return asd;
    }
  },
  mounted() {
    bus.$on('OrderTapOne', () => {
      this.$nextTick(function() {
        this.refreshChart();
      })
    })
  },
  activated() {
    this.getNum();
    this.queryCondition = {};
    this.pageNumber = 1;
    this.pageSize = 10;
    this.dateValue = [];
    this.queryOrderDayTable();
  },
  watch: {
    activeDateStatType(val, oldVal) {
      this.refreshChart();
    },
    orderType(val, oldVal) {
      this.refreshChart();
    }
  },
  methods: {
    refreshChart() {
      if (this.orderChat) {
        this.orderChat.resize();
        this.getChartsArr();
      } else {
        this.orderChat = chartsInit('order-chart');
        this.getChartsArr();
      }
    },
    getChartsArr() {
      this.orderChat.showLoading();
      if (window.sessionStorage[this.activeDateStatType + 'OrderTapOne']) {
        var chartsData = JSON.parse(window.sessionStorage[this.activeDateStatType + 'OrderTapOne']);
        this.orderChat.setOption(chartsData[this.orderType].chartsData);
        this.orderChat.hideLoading();
        return;
      }

      var data = {
        dateTypes: this.activeDateStatType || 0
      };
      this.axios.post(queryOrderDayImageUrl, data).then(res => {
        this.orderChat.setOption(res.data[this.orderType].chartsData);
        window.sessionStorage[this.activeDateStatType + 'OrderTapOne'] = JSON.stringify(res.data);
        this.orderChat.hideLoading();
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取图标统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    getNum: debounce(function() {
      this.numLoading = true;
      this.axios.post(orderStatUrl, {
        statTypes: [3, 4],
      }).then(response => {
        response.data.forEach(n => {
          if (n.type === 3) {
            //  待审核
            this.orderLists[1].num = n.count;
          } else if (n.type === 4) {
            //  待发货
            this.orderLists[2].num = n.count;
          }
        })
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
      this.axios.post(aftersaleUrl, {
        queryCondition: {},
        pageSize: 1,
        pageNumber: 1
      }).then(res => {
        //  售后单
        this.orderLists[3].num = res.data.amount;
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
      this.axios.post(orderErrorUrl, {
        queryCondition: {
          errorType: ['-2', '-3', '-4', '-5', '-6', '-7', '-999'],
        }
      }).then(res => {
        //  问题订单
        this.orderLists[4].num = res.data.amount;
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
      this.axios.post(orderErrorUrl, {
        queryCondition: {
          errorType: ['-8'],
        }
      }).then(res => {
        //  待分发
        this.orderLists[0].num = res.data.amount;
        this.numLoading = false;
      }).catch(err => {
        this.numLoading = false;
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    }, 1000, {
      leading: true,
      trailing: false
    }),
    timeFormat: function(time) {
      if (!time) {
        return ['', ''];
      }
      if (time[0] === null && time[1] === null) {
        return ['', ''];
      };
      if (time.length > 0) {
        let t = time;
        t[0] = dateFormat(t[0], 'yyyy-mm-dd') + ' 00:00:00'
        t[1] = dateFormat(t[1], 'yyyy-mm-dd') + ' 23:59:59'
        return t;
      }
    },
    numMap(num) {
      return Number(num).toLocaleString()
    },
    dateCheck(i) {
      this.dateSelect.forEach(ele => {
        ele.active = false;
      });
      this.dateSelect[i].active = true;
    },
    orderTypeCheck(i) {
      this.orderTypes.forEach(ele => {
        ele.active = false;
      });
      this.orderTypes[i].active = true;
    },
    searchTabel() {
      //  如果不对日期组件进行任何操作则time为undfined
      let time = this.timeFormat(this.dateValue);
      if (time) {
        this.queryCondition.beginPayTime = time[0];
        this.queryCondition.endPayTime = time[1];
      }
      this.queryOrderDayTable(this.queryCondition);
    },
    queryOrderDayTable(queryCondition) {
      this.loadingTable = true;
      let data = {
        queryCondition: queryCondition || {},
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      this.axios.post(queryOrderDayTableUrl, data).then(res => {
        this.tableData = res.data.beanList;
        this.total = res.data.amount;
        this.loadingTable = false;
      }).catch(err => {
        this.loadingTable = false;
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  分页尺寸变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryOrderDayTable(this.queryCondition);
    },
    //  当前页
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.queryOrderDayTable(this.queryCondition);
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.OrderTapOne {}
.left-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.index {
  display: flex;
  justify-content: space-between;
  h1 {
    height: 45px;
    line-height: 45px;
    padding: 0 15px 0 15px;
    background-color: @pageBg;
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    border-bottom: 1px solid @borderLine;
    .refresh {
      margin-left: 10px;
      cursor: pointer;
      color: @primaryBlue;
      transition: all 1s;
    }
    .refresh:hover{
      color: darken(@primaryBlue, 50%);
    }
  }
  .index_left {
    flex-basis: 250px;
    height: 350px;
    margin-right: 10px;
    border: 1px solid @borderLine;
    background: #fff;
    .dataList {
      min-height: 250px;
      padding-top: 20px;
      .numStyle {
        font-weight: bold;
        font-size: 24px;
      }
    }
  }
  .index_right {
    flex: 1;
    border: 1px solid @borderLine;
    background: #fff;
  }
}

.right-header {
  span {
    margin-left: 15px;
    cursor: pointer;
  }
  .orderTypeChecked {
    color: @primaryBlue;
  }
}

.left-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.allShop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: @darkWhite;
  // padding-right: 20px;
  .table {
    float: right;
    width: 140px;
    height: 32px;
    line-height: 28px;
    border: 1px solid rgb(211, 220, 230);
    border-radius: 3px;
    span {
      font-size: 12px;
      height: 28px;
      display: inline-block;
      width: 50%;
      color: @darkGary;
      text-align: center;
      cursor: pointer;
      background-color: #FFF;
      &:not(:nth-last-child(1)) {
        border-right: 1px solid rgb(211, 220, 230);
      }
    }
    .checked {
      background-color: @darkWhite;
      color: @lightBlack;
    }
  }
}

.echart {
  padding-top: @baseSize*6;
  height: 300px;
  background-color: #FFF !important;
}

.content-two {
  .title-search {
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    margin: 15px 0 10px 0;
    font-size: 14px;
    font-weight: normal;
    border: 1px solid @borderLine;
    background: #fff;
  }
}

.pagination {
  text-align: right;
  margin: 20px 0 20px 0;
}

.el-button--info {
  background-color: @primaryBlue;
  border-color: @primaryBlue;
}

.el-button--info:hover {
  background-color: lighten(@primaryBlue, 10%);
  border-color: lighten(@primaryBlue, 10%);
}
</style>
<style>
.OrderTapOne .el-form-item__label {
  text-align: left;
  padding-left: 30px;
}

.OrderTapOne .el-form-item__content {
  text-align: right;
  padding-right: 30px;
}

.OrderTapOne .el-form-item {
  margin-bottom: 8px;
}
</style>
