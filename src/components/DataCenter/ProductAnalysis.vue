<template>
  <div class="productAnalysis">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>数据中心</el-breadcrumb-item>
      <el-breadcrumb-item>商品分析</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="head">
      <div>热销商品排行</div>
      <div class="table">
        <span v-for="(radio, index) in dateSelect" v-text="radio.label" :class="{'checked': radio.active}" @click="dateCheck(index, radio.statType)"></span>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%;margin-top:10px;" v-loading="loading"
    element-loading-text="拼命加载中">
      <!-- <searchNull slot="empty" v-if='!tableData.length'></searchNull> -->
      <el-table-column label="排序" width="70" align='center'>
        <template scope="scope">
          <svg class="icon top-icon" aria-hidden="true" v-if='scope.$index === 0'>
            <use xlink:href="#icon-rexiaoshangpinjinpai"></use>
          </svg>
          <svg class="icon top-icon" aria-hidden="true" v-if='scope.$index === 1'>
            <use xlink:href="#icon-rexiaoshangpinyinpai"></use>
          </svg>
          <svg class="icon top-icon" aria-hidden="true" v-if='scope.$index === 2'>
            <use xlink:href="#icon-rexiaoshangpintongpai"></use>
          </svg>
          <span v-if='scope.$index !== 0&&scope.$index !== 1&&scope.$index !== 2'>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="350" align='left'>
        <template scope="scope">
          {{scope.row.skuName}}
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="120" align='left'>
        <template scope="scope">
          {{scope.row.skuSpecChars}}
        </template>
      </el-table-column>
      <el-table-column label="所属供应商" min-width="120" align='left'>
        <template scope="scope">
          {{supplierNameEnum[scope.row.suppName]}}
        </template>
      </el-table-column>
      <el-table-column prop="skuNumDay" label="总销量" min-width="90" align='right' sortable>
        <template scope="scope">
          {{scope.row.skuNumDay}}
        </template>
      </el-table-column>
      <el-table-column prop="averageCount" label="日均销量" min-width="100" align='right' sortable>
      </el-table-column>
      <el-table-column prop="skuMoneyDay" label="销售总金额" min-width="110" align='right' sortable :formatter='formatter'>
<!--         <template scope="scope">
          {{scope.row.skuMoneyDay.toLocaleString()}}
          {{scope.row.skuMoneyDay}}
        </template> -->
      </el-table-column>
    </el-table>
    <!-- <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination> -->
      <!-- <div class="e-Dialog"></div> -->
  </div>
</template>
<script>
var querySkuListUrl = '/dataCenter/prodCenter/querySkuList';
export default {
  name: 'productAnalysis',
  data() {
    return {
      loading: false,
      tableData: [],
      dateSelect: [{
        label: '近7日',
        active: true,
        statType: 0,
      }, {
        label: '近30天',
        active: false,
        statType: 1,
      }, {
        label: '近一年',
        active: false,
        statType: 2,
      }],
      queryCondition: {},
      //  分页条件
      pageNumber: 1,
      pageSize: 100,
      total: 0
    }
  },
  computed: {
    activeShopStatType() {
      let asd;
      this.dateSelect.forEach(ele => {
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
  activated() {
    this.getProductList();
    // console.log(this.$el)
  },
  methods: {
    getProductList() {
      this.loading = true;
      this.queryCondition.dateTypes = this.activeShopStatType;
      var data = {
        queryCondition: this.queryCondition,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      this.axios.post(querySkuListUrl, data).then(res => {
        // console.log(res.data)
        this.tableData = res.data.beanList.slice(0, 100);
        this.tableData.forEach((el) => {
          el.skuMoneyDay = parseFloat(el.skuMoneyDay);
        })
        this.total = res.data.amount;
        this.loading = false;
      }).catch(err => {
        this.$message({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    dateCheck(i) {
      // debugger
      // console.log('hello world1');
      // console.log('hello world2');
      // console.log('hello world3');
      this.dateSelect.forEach(ele => {
        ele.active = false;
      });
      this.dateSelect[i].active = true;
      // console.log(this.activeShopStatType)
      this.getProductList();
    },
    //  分页尺寸变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.getProductList();
    },
    //  当前页
    handleCurrentChange(val) {
      this.pageNumber = val;
      // console.log('pageNumber:' + val)
      this.getProductList();
    },
    formatter(row, column) {
      return row.skuMoneyDay.toFixed(2);
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.e-Dialog{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #000;
  opacity: 0.5;
  z-index: 9999;
}
.productAnalysis {
  color: @lightBlack;
  padding: @normalSize;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10px 0 15px;
  width: 100%;
  height: 50px;
  border: 1px solid @borderLine;
  background-color: #fff;
  .table {
    float: right;
    width: 210px;
    height: 32px;
    line-height: 28px;
    border: 1px solid rgb(211, 220, 230);
    border-radius: 3px;
    span {
      font-size: 12px;
      height: 28px;
      display: inline-block;
      width: 33.3%;
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
.pagination{
  text-align: right;
  margin: 20px 0 20px 0;
}
.top-icon {
  width: 20px;
  height: 20px;
}
</style>