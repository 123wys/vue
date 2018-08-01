<template>
  <div class="freeReportDetail">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/freeReport'}">财务结算</el-breadcrumb-item>
      <el-breadcrumb-item>对账详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="total">
      <div class="supplierName">
        <span v-text="supplierNameEnum[supplierId]"></span>
        <span>(结算周期:{{dateValue}})</span>
      </div>
      <div class="action">
        <el-row>
          <el-col :span="6" class="borderR">
            <div class="flex">
              <span>销售商品总数:</span>
              <span><span v-text="totalCount" class="acolor"></span><span>件</span></span>
            </div>
            <div class="flex">
              <span>销售总额:</span>
              <span><span class="acolor">{{totalMoney}}</span><span>元</span></span>
            </div>
          </el-col>
          <el-col :span="6" class="borderR">
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="list_head">
      <div class="specifications">商品/规格</div>
      <div class="soldNum">已销售商品数(件)</div>
      <div class="soldFee">销售额(元)</div>
<!--       <div class="payFee">应付总额(元)</div>
      <div class="grossProfit">毛利率</div> -->
    </div>
    <div class="productSearch" v-if="searchFlag">
      <div class="product" v-for="(item, i) in checkData.beanList" v-loading="loading"
          element-loading-text="拼命加载中">
        <div class="order">
          <div class="specifications">
              <div class="floatL imgDiv">
                <div class="img">
                  <el-popover popper-class="popper-img" trigger="hover" placement="top" :visible-arrow="false">
                    <img :src="item.imgUrl" alt="商品图片">
                    <img slot="reference" :src="item.imgUrl" @error='imgErrorHandler(item)'>
                  </el-popover>
                </div>
              </div>
              <div class="floatL">
                <span v-text="item.offerName"></span><span class="state"></span>
              </div>
          </div>
          <div class="soldNum">
            <span v-text="item.offerNum"></span>
          </div>
          <div class="soldFee">
            <span>{{item.offerMoneys | numberFmt}}</span>
          </div>
          <!-- <div class="payFee">
            <span>{{item.offeringReport.payFee | numberFmt}}</span>
          </div>
          <div class="grossProfit">
            <span>{{item.offeringReport.grossProfit}}%</span>
          </div> -->
        </div>
        <div class="sku" v-for="option in item.skuReports" v-if="!hideSku">
          <div class="specifications">
              <div class="floatL skuDiv">
              </div>
              <div class="floatL offerName">
                <span v-text="option.skuCharSpec"></span><span class="state"></span>
                <div class="outerId">
                  <span v-text="option.outerId"></span>
                </div>
              </div>
          </div>
          <div class="soldNum">
            <span v-text="option.soldNum"></span>
          </div>
          <div class="soldFee">
            <span>{{option.totalFee | numberFmt}}</span>
          </div>
          <div class="payFee">
            <span>{{option.payFee | numberFmt}}</span>
          </div>
          <div class="grossProfit">
            <span>{{option.grossProfit}}%</span>
          </div>
        </div>
      </div>
    </div>
    <searchNull v-else></searchNull>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="checkData.amount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import imgerr from '../../assets/img/imgerror.png'
import Paging from '../common/Paging';
import axios from 'axios';
import Pagination from '../common/Pagination';
let queryVerifyDetailUrl = '/finance/report/queryVerifyDetail'
export default {
  name: 'finance-detail',
  data() {
    return {
      loading: false,
      hideSku: false,
      searchFlag: false,
      shopId: '',
      supplierId: '',
      dateValue: '',
      totalCount: '',
      totalMoney: '',
      checkData: {
        amount: 0,
        beanList: []
      },
      pageNumber: 1,
      pageSize: 10,
    }
  },
  components: {
    Paging,
    Pagination
  },
  computed: {
    shopEnum() {
      return this.$store.state.enumSet.shopEnum;
    },
    supplierNameEnum() {
      return this.$store.state.enumSet.supplierEnum;
    }
  },
  methods: {
    imgErrorHandler(prod) {
      prod.imgUrl = imgerr;
    },
    search() {
      // this.loading = true;
      let params = JSON.parse(window.sessionStorage.freeReport);
      let query = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        queryCondition: {
          shopId: params.shopId,
          supplierTenantId: params.supplierId,
          beginPayTime: params.beginPayTime,
          endPayTime: params.endPayTime,
          orderVerifyType: params.orderVerifyType
        }
      };
      axios.post(queryVerifyDetailUrl, query)
        .then(res => {
          if (res.data) {
            this.checkData = res.data;
            this.loading = false;
            this.searchFlag = true;
          }
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
          this.loading = false;
        })
    },
    currentChangeHandler(val) { // 翻页
      this.pageNumber = val;
      this.search();
    },
    handleSizeChange(val) { // 每页显示条数
      this.pageSize = val;
      this.search();
    }
  },
  mounted() {},
  activated() {
    let params = JSON.parse(window.sessionStorage.freeReport);
    this.shopId = params.shopId;
    this.dateValue = params.beginPayTime.slice(0, 10) + '~' + params.endPayTime.slice(0, 10);
    this.totalCount = params.totalNum;
    this.totalMoney = params.totalMoney;
    this.supplierId = params.supplierId;
    this.search();
  },
  filters: {
    numberFmt(val) {
      let s = parseFloat(val).toFixed(2) + '';
      let l = s.split('.')[0].split('').reverse();
      let r = s.split('.')[1];
      let t = '';
      for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
      }
      return t.split('').reverse().join('') + '.' + r;
    }
  },
  watch: {},
}
</script>
<style lang="less" scoped>
@import '../../main.less';
#fuck{
  width: 200px;
  height: 200px;
}
#fuck2{
  width: 400px;
  height: 400px;
}
.total {
  border: 1px solid @borderLine;
  .supplierName {
    padding: 10px 15px;
    border-bottom: 1px solid @borderLine;
    span:first-child {
      font-size: @fontSize14;
      color: @leftmenuBg;
    }
    span:last-child {
      color: @lightGary;
      margin-left: @baseSpace;
    }
  }
  .action {
    background: @white;
    height: 65px;
    padding: 10px 15px;
    .borderR {
      padding-right: @baseSpace * 4;
      border-right: 1px solid @borderLine;
    }
    .flex {
      height: 22.5px;
      line-height: 22.5px;
      display: flex;
      justify-content: space-between;
      color: #6A7786;
      .acolor {
        color: @leftmenuBg;
        font-size: @fontSize14;
        font-weight: bold;
      }
    }
  }
}

.list_head {
  height: 40px;
  line-height: 40px;
  margin-top: 15px;
  border: 1px solid @borderLine;
  background-color: @tabBg;
  .specifications {
    text-indent: 46px;
  }
}

.list_head,
.order,
.sku {
  display: flex;
  .specifications {
    flex-basis: 40%;
    padding-left: 15px;
    .img {
      overflow: hidden;
      height: 36px;
      width: 36px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  > div + div {
    flex-basis: 15%;
    text-align: right;
    padding-right: 20px;
  }
}

.product {
  border: 1px solid @borderLine;
  margin-top: 10px;
  .specifications {
    padding: 10px 0;
    display: flex;
    // .floatL {
    //   float: left;
    //   word-break: break-all;
    // }
    .imgDiv {
      width: 36px;
      margin: 0 10px;
    }
    .checkImg {
      margin-left: 10px;
      padding-top: 5px;
    }
  }
}

.order,
.sku {
  background-color: @white;
  // height: 56px;
  > div + div {
    padding-top: 10px;
  }
}

.order {
  background-color: #E8F5FF;
  .specifications {
    font-size: 13px;
  }
  > div + div {
    font-size: @fontSize14;
    font-weight: bold;
  }
  .payFee {
    color: @warningYellow;
  }
}

.sku {
  border-top: 1px solid @borderLine;
  .skuDiv {
    width: 56px;
    height: 36px;
  }
  .skuDivExt {
    width: 85px;
    // height: 36px;
  }
  .offerName {
    line-height: 17px;
  }
  .outerId {
    color: @lightGary;
  }
}

.pagination {
  padding: 15px;
  text-align: right;
}

.freeReportDetail {
  padding: 15px;
  .searchNull {
    padding: 160px 0 100px 0;
    background-color: @white;
    margin-top: 15px;
    border: 1px solid @borderLine;
  }
}
</style>
