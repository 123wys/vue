<template>
  <div class="pad">
    <el-row class="order">
      <el-col v-for="(item, index) in orderLists" :span="24 / orderLists.length" class="border_right">
        <span @click="switchTo(item.pathTo, item.activeName)" style="display:inline-block">
          <span :class="'color' + index" v-text="item.num" @click="switchTo(item.pathTo, item.activeName)"></span>
        <br><span v-text="item.status"></span>
        </span>
      </el-col>
    </el-row>
    <div class="com-fun">
      <p>常用功能</p>
      <ul>
        <li v-for='(item, index) in funBox'>
            <i :class="item.icon" @click='quickGo(item.to,item.activeName)' style="cursor:pointer"></i>
            <router-link :to="{ path: item.to, query: { activeName: item.activeName ,mark: item.mark}}">
              <span>{{item.name}}</span>
            </router-link>
            <el-tooltip class="item" effect="light" content="点击查看帮助" placement="top-start">
              <i class="icon iconfont icon-bangzhu1 helpIcon" v-if="index === 0" @click="downloadHelp"></i>
            </el-tooltip>
        </li>
      </ul>
    </div>
    <el-row :gutter="10">
      <el-col :span="span" class="borderL">
        <el-row class="allShop">
          <el-col :span="16">
            <el-row>
              <span style="font-size:18px;">订单汇聚</span>
            </el-row>
            <el-row>
              <span class="refresh">总订单数 : <span v-text="inCountAll"></span></span>
            </el-row>
          </el-col>
          <el-col :span="8">
            <div class="table">
              <span v-for="(radio, index) in shopSelect" v-text="radio.label" :class="{'checked': radio.active}" @click="shopCheck(index, radio.statType)"></span>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row class="total">
          <el-col :span="4">
            <span class="fs">总订单数</span>
            <br>
            <span v-text="inCountAll" class="num"></span>
          </el-col> -->
          <!-- <el-col :span="20" style="padding-left:40px;">
        <span class="fs">总销售额</span>
        <br>
        <span v-text="totalPrice" class="num"></span>
      </el-col> -->
        <!-- </el-row> -->
        <el-row class="echart" id="shop-chart">
        </el-row>
      </el-col>
      <el-col :span="span" v-if="tenantType!==1" class="borderL">
        <el-row class="allChannel">
          <el-col :span="16">
            <el-row>
              <span style="font-size:18px;">订单分发</span>
            </el-row>
            <el-row>
              <span class="refresh">总订单数 : <span v-text="outCountAll"></span></span>
            </el-row>
          </el-col>
          <el-col :span="8">
            <div class="table">
              <span v-for="(radio, index) in chanellSelect" v-text="radio.label" :class="{'checked': radio.active}" @click="chanellCheck(index, radio.statType)"></span>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row class="total">
          <el-col :span="8">
            <span class="fs">总订单数</span>
            <br>
            <span v-text="outCountAll" class="num"></span>
          </el-col> -->
          <!-- <el-col :span="20" style="padding-left:40px;">
        <span class="fs">总销售额</span>
        <br>
        <span v-text="totalPrice" class="num"></span>
      </el-col> -->
        <!-- </el-row> -->
        <el-row class="echart" id="channel-chart">
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue'
import dateFormat from 'dateFormat'
import echarts from 'echarts'
import throttle from 'lodash/throttle'
import axios from 'axios'
let orderChartsUrl = 'order/order/orderCharts'
let orderCharts4SupplierUrl = 'order/order/orderCharts4Supplier'
let orderStatUrl = 'order/order/orderStat'
let orderErrorUrl = 'order/order/queryErrorOrders'
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
};
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
  name: 'index-left',
  data() {
    return {
      html: 'https://frontfile.oss-cn-hangzhou.aliyuncs.com/help/%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%95.html',
      doc: 'https://hgkcdn.oss-cn-shanghai.aliyuncs.com/Eboss/%E5%B0%8F%E4%BA%9A%E9%80%9A%E2%80%9C%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%95%E2%80%9D%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E4%BB%8B%E7%BB%8D.docx',
      funBox: [
        {
          icon: 'icon iconfont icon-piliangdadan fun-icon fun1',
          name: '批量打单',
          to: '/order',
          activeName: 1
        }, {
          icon: 'icon iconfont icon-piliangfahuo fun-icon fun2',
          name: '批量发货',
          to: '/order',
          activeName: 1
        }, {
          icon: 'icon iconfont icon-wodedianpu1 fun-icon fun4',
          name: '我的店铺',
          to: '/shop'
        }, {
          icon: 'icon iconfont icon-yaoqinggongyingshang1 fun-icon fun1',
          name: '邀请供应商',
          to: '/inviteSupplier'
        }, {
          icon: 'icon iconfont icon-shangpinguanliangongyingshang fun-icon fun5',
          name: '关联商品',
          to: '/production',
          mark: 'bindPro'
        }
      ],
      shopChart: {},
      chanellChart: {},
      date: dateFormat(new Date(), `yyyy-mm-dd`),
      queryDate: '近7日',
      orderLists: [{
      //   num: '',
      //   status: '待分发',
      //   pathTo: '/undisorder',
      // }, {
        num: '',
        status: '待审核',
        pathTo: '/order',
        activeName: 7
      }, {
        num: '',
        status: '待发货',
        pathTo: '/order',
        activeName: 1
      }, {
        num: '',
        status: '问题订单',
        pathTo: '/errororder',
        activeName: 999
      }],
      shopSelect: [{
        label: '近7日',
        active: true,
        statType: 0,
      }, {
        label: '近30天',
        active: false,
        statType: 1,
      // }, {
      //   label: '近一年',
      //   active: false,
      //   statType: 2,
      }],
      chanellSelect: [{
        label: '近7日',
        active: true,
        statType: 0,
      }, {
        label: '近30天',
        active: false,
        statType: 1,
      // }, {
      //   label: '近一年',
      //   active: false,
      //   statType: 2,
      }],
      inCountAll: 0,
      outCountAll: 0,
    }
  },
  methods: {
    downloadHelp() {
      var a = document.createElement('a');
      a.href = this.html;
      a.target = '_blank';
      a.click();
    },
    quickGo(path, activeName) {
      this.$router.push({
        path: path,
        query: {
          activeName
        }
      });
    },
    switchTo(val, activeName) {
      this.$router.push({
        path: val,
        query: {
          activeName
        }
      });
    },
    shopCheck(i) {
      this.shopSelect.forEach(ele => {
        ele.active = false;
      });
      this.shopSelect[i].active = true;
    },
    chanellCheck(i) {
      this.chanellSelect.forEach(ele => {
        ele.active = false;
      });
      this.chanellSelect[i].active = true;
    },
    loadChartsData(chart, countName, statTypes, url) {
      chart.showLoading();
      axios.post(url, {
        statTypes
      }).then(request => {
        chart.hideLoading();
        chart.setOption(Object.assign({}, option, request.data.chartsData), {
          notMerge: true,
        });
        this[countName] = request.data.countAll.toLocaleString();
      }).catch(err => {
        chart.hideLoading();
        this.$msgbox({
          title: '提示',
          message: '图形数据获取失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    getNum() {
      axios.post(orderStatUrl, {
        statTypes: [3, 4],
        // warrantyStatus: [0, 2, 5],
        // itemStatus: 1,
      }).then(response => {
        response.data.forEach(n => {
          if (n.type === 3) {
            this.orderLists[0].num = n.count;
          } else if (n.type === 4) {
            this.orderLists[1].num = n.count;
          }
        })
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
      axios.post(orderErrorUrl, {
        queryCondition: {
          errorType: ['-2', '-3', '-4', '-5', '-6', '-7', '-999'],
          // endCreateTime: dateFormat(new Date(), `yyyy-mm-dd HH:MM:ss`),
          // endPayTime: dateFormat(new Date(), `yyyy-mm-dd HH:MM:ss`)
        }
      }).then(res => {
        this.orderLists[2].num = res.data.amount;
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
      // axios.post(orderErrorUrl, {
      //   queryCondition: {
      //     errorType: ['-8'],
      //     // endCreateTime: dateFormat(new Date(), `yyyy-mm-dd HH:MM:ss`),
      //     // endPayTime: dateFormat(new Date(), `yyyy-mm-dd HH:MM:ss`)
      //   }
      // }).then(res => {
      //   this.orderLists[0].num = res.data.amount;
      // }).catch(err => {
      //   this.$msgbox({
      //     title: '提示',
      //     message: '获取订单统计数据失败，' + (err.response ? err.response.data : err),
      //     type: 'error',
      //   })
      // })
    },
    startCharts(val) {
      if (val === 1) {
        this.shopChart = chartsInit('shop-chart');
        this.loadChartsData(this.shopChart, 'inCountAll', [0], orderChartsUrl);
      } else {
        this.shopChart = chartsInit('shop-chart');
        this.chanellChart = chartsInit('channel-chart');
        this.loadChartsData(this.shopChart, 'inCountAll', [0], orderChartsUrl);
        this.loadChartsData(this.chanellChart, 'outCountAll', [0], orderCharts4SupplierUrl);
      }
    },
  },
  computed: {
    totalNum() {
      let num = this.countAll + '';
      num = parseFloat(num).toLocaleString();
      return num;
    },
    // totalPrice() {
    //   let num = 20391054.56;
    //   num = num.toFixed(2) + '';
    //   let count = 0;
    //   let str = '';
    //   for (let i = num.indexOf('.') - 1; i >= 0; i--) {
    //     if (count % 3 === 0 && count !== 0) {
    //       str = `${num.charAt(i)},${str}`;
    //     } else {
    //       str = `${num.charAt(i)}${str}`;
    //     }
    //     count++;
    //   }
    //   num = `${str}${`${num}`.substr(`${num}`.indexOf('.'), 3)}`;
    //   return num;
    // },
    activeShopStatType() {
      let asd;
      this.shopSelect.forEach(ele => {
        if (ele.active) {
          asd = ele.statType;
        }
      })
      return asd;
    },
    activeChanellStatType() {
      let asd;
      this.chanellSelect.forEach(ele => {
        if (ele.active) {
          asd = ele.statType;
        }
      })
      return asd;
    },
    tenantType() {
      return this.$store.getters.ichannel.tenantInfo.tenantType;
    },
    span() {
      if (this.tenantType === 1) {
        return 24
      }
      return 12
    }
  },
  watch: {
    activeShopStatType(val) {
      this.loadChartsData(this.shopChart, 'inCountAll', [val], orderChartsUrl);
    },
    activeChanellStatType(val) {
      this.loadChartsData(this.chanellChart, 'outCountAll', [val], orderCharts4SupplierUrl);
    },
    // '$route.path' (val) {
    //   if (val === '/index') {
    //     this.getNum();
    //   }
    // },
    tenantType(val) {
      if (val === '') return;
      Vue.nextTick(() => {
        this.startCharts(val);
      })
    }
  },
  activated() {
    this.getNum();
  },
  mounted() {
    if (this.tenantType !== '') {
      this.startCharts(this.tenantType);
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.helpIcon{
  margin-left: 3px;
  color: @lightGary;
  cursor: pointer;
}
a:link {
  text-decoration:none;
  color: #000;
}
a:hover{
  color: #000;
}
.com-fun {
  padding: 10px 0 0 15px;
  margin-bottom: @smallSize;
  border: 1px solid @borderLine;
  background-color: #FFF;
  p {
    margin: 0 0 10px 0;
    color: @lightGary;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0 0 10px 0;
    li {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 115px;
      margin: 0 50px 5px 0;
      a {
        font-size: 14px;
        color: #000;
        transition: all .3s;
      }
    }
    li:hover  a{
      color: @primaryBlue;
    }
    li:hover .fun-icon{
      transform: rotateY(180deg);
    }
  }
  .fun-icon {
    font-size: 25px;
    border-radius: 50%;
    color: #fff;
    margin-right: 10px;
    transition: all .3s;
  }
  .fun1 {
    background: @dangerRed;
  }
  .fun2 {
    background: @successGreen;
  }
  .fun3 {
    background: @primaryBlue;
  }
  .fun4 {
    background: @warningYellow;
  }
  .fun5 {
    background: @tipsBlue;
  }
  
}
.pad {
  padding-right: @smallSize;
}

.order {
  height: 97px;
  background-color: #FFF;
  margin-bottom: @smallSize;
  border: 1px solid @borderLine;
  padding: 15px 0;
  .border_right {
    text-align: center;
    font-size: 14px;
    span:first-child {
      cursor: pointer;
    }
    .color0,
    .color1,
    .color2,
    .color3 {
      font-size: 42px;
      color: @primaryBlue;
    }
    .color0 {
      color: @warningYellow;
    }
    .color1 {
      color: @tipsBlue;
    }
    .color2 {
      color: @dangerRed;
    }
    .color3 {
      color: @dangerRed;
    }
    &:not(:nth-last-child(1)) {
      border-right: 1px solid @lightGary;
    }
  }
}

.borderL{
  // border: 1px solid @borderLine;
  > div{
    border: 1px solid @borderLine;
    &:not(:last-child){ 
      border-bottom: 0;
    }
  }
}

.allShop,
.allChannel {
  height: 60px;
  background-color: @darkWhite;
  padding: @baseSpace * 2 @baseSpace * 2 5px @baseSpace * 4;
  // border: 1px solid @borderLine;
  .refresh {
    font-size: 12px;
    color: @darkGary;
    span{
      font-size: 14px;
      color: @primaryBlue;
      font-weight: bold;
    }
  }
  .table {
    // margin-top: @normalSize;
    float: right;
    width: 100%;
    height: 32px;
    border: 1px solid rgb(211, 220, 230);
    border-radius: 3px;
    line-height: 32px;
    span {
      font-size: 12px;
      height: 100%;
      display: inline-block;
      // width: 33.33%;
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

.total {
  height: 85px;
  background-color: #FFF;
  // margin: 2px 0;
  padding: 19px @normalSize;
  .total_border {
    border-right: 1px solid @lightGary;
  }
  .fs {
    font-size: 14px;
    color: @darkGary;
  }
  .num {
    font-size: 24px;
    color: @lightBlack;
  }
}

.echart {
  padding-top: @baseSize*6;
  height: 390px;
  background-color: #FFF !important;
}
</style>
