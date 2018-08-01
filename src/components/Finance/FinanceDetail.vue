<template>
  <div class="financeDetail">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/finance'}">财务结算</el-breadcrumb-item>
      <el-breadcrumb-item>{{status
        < 3 ? '确认对账' : '确认结算'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="total">
      <div class="supplierName">
        <span v-text="convertData.supplierName"></span>
        <span>(结算周期: {{convertData.setcycle}})</span>
      </div>
      <div class="action">
        <el-row>
          <el-col :span="6" class="borderR">
            <div class="flex">
              <span>销售商品总数:</span>
              <span><span v-text="convertData.soldNum" class="acolor"></span><span>件</span></span>
            </div>
            <div class="flex">
              <span>销售总额:</span>
              <span><span class="acolor">{{convertData.totalFee | numberFmt}}</span><span>元</span></span>
            </div>
          </el-col>
          <el-col :span="6" class="borderR">
            <div class="totalPay textR">
              <span>应付总金额:</span>
              <span><span class="bcolor">{{convertData.payFee | numberFmt}}</span><span>元</span></span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="checkBtn textR">
              <el-popover ref="popover" width="100" trigger="hover">
                  <div class="time note">{{convertData.remark ? convertData.remark : '暂无备注'}}</div>
              </el-popover>
              <el-button v-if="status < 2" type="primary" size="small" @click="batchAction('qrdz')">确认对账</el-button>
              <el-button v-else-if="status != 4" type="success" size="small" @click="batchAction('qrjs')">确认结算</el-button>
              <el-button size="small" @click="exportFee">导出对账单</el-button>
              <el-button size="small" v-popover:popover @click="batchAction('txbz')">备注</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="list_head">
      <div class="specifications">商品/规格</div>
      <div class="soldNum">已销售商品数(件)</div>
      <div class="soldFee">销售额(元)</div>
      <div class="payFee">应付总额(元)</div>
      <div class="grossProfit">毛利率</div>
    </div>
    <!--     <div class="list-action" v-if="status > 1">
      <el-checkbox class="select-all" v-model="isSelectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
      <div class="batch">
        <el-button size="small" @click="batchAction('pltd')">批量填发票</el-button>
      </div>
      <div class="check">
        <el-checkbox style="margin-left:10px;" v-model="hideSku">隐藏商品信息</el-checkbox>
      </div>
      <paging :page-size="pageSize" :page-number="pageNumber" :total="checkData.amount" @current-change="currentChangeHandler"></paging>
    </div> -->
    <!-- 商品信息 -->
    <div class="productSearch" v-if="searchFlag">
      <div class="product" v-for="(item, i) in checkData.beanList">
        <div class="order">
          <div class="specifications">
              <!-- <div class="floatL checkImg" v-if="status > 1">
                <el-checkbox v-model="selection[i]"></el-checkbox>
              </div> -->
              <div class="floatL imgDiv">
                <div class="img">
                  <img :src="item.offeringReport.imageFileName" @error="imgErrorHandler(item.offeringReport)" alt="商品图片" />
                </div>
              </div>
              <div class="floatL">
                <span v-text="item.offeringReport.offeringName"></span><span class="state"></span>
              </div>
          </div>
          <div class="soldNum">
            <span v-text="item.offeringReport.soldNum"></span>
          </div>
          <div class="soldFee">
            <span>{{item.offeringReport.totalFee | numberFmt}}</span>
          </div>
          <div class="payFee">
            <span>{{item.offeringReport.payFee | numberFmt}}</span>
          </div>
          <div class="grossProfit">
            <span>{{item.offeringReport.grossProfit}}%</span>
          </div>
        </div>
        <div class="sku" v-for="option in item.skuReportDetails" v-if="!hideSku">
          <div class="specifications">
              <div class="floatL skuDiv">
              </div>
              <!-- <div class="floatL skuDivExt" v-if="status > 1"></div> -->
              <div class="floatL skuName">
                <span v-text="option.skuReport.skuCharSpec"></span><span class="state"></span>
                <div class="outerId">
                  <span v-text="option.skuReport.outerId"></span>
                </div>
              </div>
          </div>
          <div class="soldNum">
            <span v-text="option.skuReport.soldNum"></span>
          </div>
          <div class="soldFee">
            <span>{{option.skuReport.totalFee | numberFmt}}</span>
          </div>
          <div class="payFee">
            <span>{{option.skuReport.payFee | numberFmt}}</span>
          </div>
          <div class="grossProfit">
            <span>{{option.skuReport.grossProfit}}%</span>
          </div>
        </div>
      </div>
    </div>
    <searchNull v-else></searchNull>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="checkData.amount">
      </el-pagination>
    </div>
    <!-- <pagination v-else class="pl" v-model="isSelectAll" :indeterminate="isIndeterminate" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="checkData.amount" @size-change="handleSizeChange" @current-change="currentChangeHandler"></pagination> -->
    <finance-dialog :dialog="dialogVisible" @sure="dialogSure" @cancel="dialogCancle" :action="action" :actionNum="selectIds.length"></finance-dialog>
  </div>
</template>
<script>
import Paging from '../common/Paging';
import axios from 'axios';
import Pagination from '../common/Pagination';
import FinanceDialog from './FinanceDialog';
import imgerr from '../../assets/img/imgerror.png'
export default {
  name: 'finance-detail',
  data() {
    return {
      hideSku: false,
      dialogVisible: false,
      searchFlag: false,
      checkData: {
        amount: 0,
        beanList: []
      },
      pageNumber: 1,
      pageSize: 10,
      convertData: {},
      selection: [],
      action: '',
    }
  },
  components: {
    Paging,
    Pagination,
    FinanceDialog,
  },
  computed: {
    status() {
      return this.$route.query.status;
    },
    isSelectAll: {
      get() {
        return this.checkData.amount ? this.selection.every(n => n) : false;
      },
      set(val) {
        this.selection = new Array(this.checkData.beanList.length).fill(val);
      }
    },
    selectIds() {
      return this.checkData.beanList.filter((n, i) => this.selection[i]).map(n => n.offeringReport.offeringId);
    },
    isIndeterminate() {
      return this.selectIds.length > 0 && this.selectIds.length < this.checkData.beanList.length;
    },
  },
  methods: {
     // 纠错图片显示
    imgErrorHandler(offering) {
      offering.imageFileName = imgerr;
    },
    exportFee() {
      let query = {
        reportIds: [this.convertData.reportIds],
      };
      axios.post('/finance/report/queryReportFiles', query)
      .then(res => {
        if (res.data) {
          this.$store.commit('addTask', 'accountExport');
          this.$confirm('导出作业已启动，稍后可在任务中心下载！', '提示', {
            cancelButtonText: '稍后再说',
            confirmButtonText: '现在前往',
            type: 'success',
          }).then(() => {
            this.$router.push('/taskcenter')
          });
        }
      })
      .catch(err => {
        this.$message.error(err.response ? err.response.data : err);
      })
    },
    batchAction(val) {
      this.action = val;
      if (val === 'pltd') {
        if (this.selectIds.length === 0) {
          this.$message.info('请至少选择一件商品');
          return;
        }
      }
      this.dialogVisible = true;
    },
    dialogCancle() {
      this.dialogVisible = false;
    },
    dialogSure(val, act) { // 弹窗操作
      if (val && act) {
        if (act === 'pltd') { // 批量填写发票号
          this.$message.info('批量填写发票号');
        } else { // 填写备注
          let query = {
            reportIds: [this.$route.query.reId],
            reportStatus: this.status,
            remark: val
          };
          axios.post('/finance/report/updateReport', query)
            .then(res => {
              if (res.data) {
                this.dialogVisible = false;
                this.convertData.remark = val;
                this.$message.success('备注填写成功！');
              }
            })
            .catch(err => {
              this.dialogVisible = false;
              this.$message.error(err.response ? err.response.data : err);
            })
        }
      } else { // 转 待结算 || 转 已结算
        let query = {
          reportIds: [this.$route.query.reId],
          reportStatus: this.status < 3 ? 3 : 4,
        };
        axios.post('/finance/report/updateReport', query)
          .then(res => {
            if (res.data) {
              this.dialogVisible = false;
              this.$message.success('账单操作成功！');
              this.$router.push('/finance');
            }
          })
          .catch(err => {
            this.dialogVisible = false;
            this.$message.error(err.response ? err.response.data : err);
          })
      }
    },
    search() {
      let query = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        queryCondition: {
          reportId: this.$route.query.reId,
          reportStatus: 1,
          // reportStatus: this.status,
        }
      };
      axios.post('/finance/report/queryReportDetail', query)
        .then(res => {
          if (res.data) {
            this.checkData = res.data;
            this.searchFlag = true;
          }
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
        })
    },
    currentChangeHandler(val) { // 翻页
      this.pageNumber = val;
      this.search();
    },
    handleSizeChange(val) { // 每页显示条数
      this.pageSize = val;
      this.search();
    },
    tenantInfo() {
      this.convertData = JSON.parse(window.sessionStorage.tenantInfo);
    },
  },
  activated() {
    this.search();
    this.tenantInfo();
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
  watch: {
    checkData: {
      handler(val) {
        this.selection = new Array(val.beanList.length).fill(false);
      },
      deep: true,
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
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
    .totalPay {
      height: 45px;
      padding-top: 25px;
      .bcolor {
        font-size: 18px;
        color: @warningYellow;
      }
    }
    .checkBtn {
      padding-top: 10px;
    }
  }
}

.textR {
  text-align: right;
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
  .skuName {
    line-height: 17px;
  }
  .outerId {
    color: @lightGary;
  }
}

.list-action {
  background-color: @white;
  padding: @smallSize - 5px 0;
  display: flex;
  border: 1px solid @borderLine;
  border-top: 0;
  align-items: baseline;
  .select-all,
  .batch,
  .paging {
    padding: 0 @baseSpace * 2;
  }
  .check {
    flex-grow: 1;
  }
}

.colorFee {
  color: @warningYellow;
}

.pagination {
  padding: 15px;
  text-align: right;
}

.note {
  text-align: center;
}

.financeDetail {
  .searchNull {
    padding: 160px 0 100px 0;
    background-color: @white;
    margin-top: 15px;
    border: 1px solid @borderLine;
  }
}
</style>
