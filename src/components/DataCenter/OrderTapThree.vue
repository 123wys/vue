<template>
  <div class="OrderTapThree">
    <div class="OrderTapThree-header">
      <el-row class="allShop">
        <el-col :span="10">
          <el-row>
            <span style="font-size:14px;">累计总订单数<span v-text="inCountAll" class="num"></span></span>
          </el-row>
        </el-col>
        <el-col :span="14">
          <div class="table">
            <span v-for="(radio, index) in shopSelect" v-text="radio.label" :class="{'checked': radio.active}" @click="shopCheck(index, radio.statType)"></span>
          </div>
        </el-col>
      </el-row>
      <el-row class="echart" id="shop-chart-three">
      </el-row>
    </div>
    <div class="content-two">
      <h1 class="title-search">
        <span style='margin-right:20px'>所有供应商订单数据</span>
        <el-input size='mini' v-model.trim="supplierName" placeholder="输入供应商名称" style='width:200px;margin-right:10px'></el-input>
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
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loadingTable" element-loading-text="拼命加载中"
        >
        <el-table-column
          align="left"
          label="供应商名称">
          <template scope="scope">
            <span v-text='supplierNameEnum[scope.row.supplierId]'></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNum"
          align="right"
          label="订单总数">
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import dateFormat from 'dateFormat'
import echarts from 'echarts'
import throttle from 'lodash/throttle'
import axios from 'axios'
import bus from '../../store/bus.js'
let orderCharts4SupplierUrl = 'order/order/orderCharts4Supplier'
let queryOrderSuppTable = 'dataCenter/orderCenter/queryOrderSuppTable'
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
  color: ['#4A90E2', '#71A834', '#F5A623', '#FF6161', '#99A9BF'],
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
  name: 'OrderTapThree',
  data() {
    let threeMonthAgo = new Date();
    threeMonthAgo.setMonth(new Date().getMonth() - 3, new Date().getDate() + 1)
    return {
      loadingTable: false,
      shopChart: null,
      date: dateFormat(new Date(), `yyyy-mm-dd`),
      shopSelect: [{
        label: '近7日',
        active: true,
        statType: 0,
      }, {
        label: '近30天',
        active: false,
        statType: 1,
      }],
      inCountAll: 0,
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
      tableData: [],
      //  查询条件
      dateValue: [threeMonthAgo, new Date()],
      supplierName: '',
      queryCondition: {},
      //  分页条件
      pageNumber: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    bus.$on('OrderTapThree', () => {
      this.$nextTick(function () {
        this.refreshChart();
      })
    })
  },
  activated() {
    this.queryCondition = {};
    this.pageNumber = 1;
    this.pageSize = 10;
    // this.dateValue = [];
    this.supplierName = '';
    this.queryOrderSuppTable();
  },
  computed: {
    activeShopStatType() {
      let asd;
      this.shopSelect.forEach(ele => {
        if (ele.active) {
          asd = ele.statType;
        }
      })
      return asd;
    },
    supplierNameEnum() {
      return this.$store.state.enumSet.supplierEnum;
    }
  },
  methods: {
    refreshChart() {
      if (this.shopChart) {
        this.shopChart.resize();
        this.loadChartsData(this.shopChart, 'inCountAll', [this.activeShopStatType], orderCharts4SupplierUrl);
      } else {
        this.shopChart = chartsInit('shop-chart-three');
        this.loadChartsData(this.shopChart, 'inCountAll', [this.activeShopStatType], orderCharts4SupplierUrl);
      }
    },
    searchTabel() {
      //  如果不对日期组件进行任何操作则time为undfined
      this.queryCondition.enterpriseTitle = this.supplierName;
      if (this.dateValue && this.dateValue[0] && this.dateValue[1]) {
        this.queryCondition.beginPayTime = dateFormat(this.dateValue[0], 'yyyy-mm-dd') + ' 00:00:00'
        this.queryCondition.endPayTime = dateFormat(this.dateValue[1], 'yyyy-mm-dd') + ' 23:59:59'
      }
      this.queryOrderSuppTable(this.queryCondition);
    },
    shopCheck(i) {
      this.shopSelect.forEach(ele => {
        ele.active = false;
      });
      this.shopSelect[i].active = true;
    },
    queryOrderSuppTable(queryCondition) {
      this.loadingTable = true;
      if (queryCondition) {
        queryCondition.querySupplier = 1;
        queryCondition.assocStatus = 1;
      }
      let data = {
        queryCondition: queryCondition || { querySupplier: 1, assocStatus: 1 },
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      this.axios.post(queryOrderSuppTable, data).then(res => {
        this.tableData = res.data.beanList;
        this.total = res.data.amount;
        this.loadingTable = false;
      }).catch(err => {
        this.loadingTable = false;
        this.$msgbox({
          title: '提示',
          message: '获取统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    loadChartsData(chart, countName, statTypes, url) {
      this.shopChart.showLoading();
      // this.shopChart.clear();
      // this.shopChart = chartsInit('shop-chart-three')
      if (window.sessionStorage[statTypes + url]) {
        var chartsData = JSON.parse(window.sessionStorage[statTypes + url])
        // this.shopChart.setOption(chartsData.data)
        this.shopChart.setOption(Object.assign({}, option, chartsData.data), {
          notMerge: true,
        });
        this[countName] = chartsData.count.toLocaleString();
        this.shopChart.hideLoading();
        return;
      }
      axios.post(url, {
        statTypes
      }).then(res => {
        chart.hideLoading();
        // chart.setOption(res.data.chartsData);
        chart.setOption(Object.assign({}, option, res.data.chartsData), {
          notMerge: true,
        });
        this[countName] = res.data.countAll.toLocaleString();
        window.sessionStorage[statTypes + url] = JSON.stringify({data: res.data.chartsData, count: res.data.countAll.toLocaleString()});
      }).catch(err => {
        chart.hideLoading();
        this.$msgbox({
          title: '提示',
          message: '图形数据获取失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  分页尺寸变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryOrderSuppTable(this.queryCondition);
    },
    //  当前页
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.queryOrderSuppTable(this.queryCondition);
    }
  },
  watch: {
    activeShopStatType(val) {
      this.loadChartsData(this.shopChart, 'inCountAll', [val], orderCharts4SupplierUrl);
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.OrderTapThree {}
.OrderTapThree-header{
  border:1px solid @borderLine;
}
.allShop,
.allChannel {
  height: 60px;
  background-color: @darkWhite;
  border-bottom: 1px solid @borderLine;
  padding: @baseSpace * 3 @baseSpace * 2 0 @baseSpace * 4;
  // border: 1px solid @borderLine;
  .refresh {
    font-size: 12px;
    color: @darkGary;
  }
  .table {
    // margin-top: @normalSize;
    float: right;
    width: 140px;
    height: 32px;
    border: 1px solid rgb(211, 220, 230);
    border-radius: 3px;
    line-height: 32px;
    span {
      font-size: 12px;
      height: 100%;
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

.num {
  font-size: 18px;
  color: @lightBlack;
  margin-left: 10px;
}

.echart {
  padding-top: @baseSize*6;
  height: 390px;
  background-color: #FFF !important;
}

.content-two{
  .title-search{
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
.pagination{
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