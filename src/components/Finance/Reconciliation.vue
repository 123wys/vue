<template>
  <div>
    <el-input placeholder="输入供应商名称" v-model.trim="supplierName">
      <template slot="append">
        <el-button @click="research">{{btnName}}</el-button>
      </template>
    </el-input>
    <div class="head">
      <div class="list-head">
        <div class="supplier textIndent">供应商</div>
        <div class="cycle">结算周期</div>
        <div class="number">已销商品数(件)</div>
        <div class="saleVolume">销售额(元)</div>
        <div class="totalFee">应付总额(元)</div>
        <div class="grossMargin">毛利率</div>
        <div class="createDate">操作时间</div>
        <div class="operation">操作</div>
      </div>
      <div class="list-action">
        <el-checkbox class="select-all" v-model="isSelectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        <div class="batchBtn">
          <el-button size="small" v-if="activeName === 'second'" @click="batchActionHandle('plsc')">批量删除</el-button>
          <el-button size="small" v-if="activeName === 'second'" @click="batchActionHandle('plcz')">批量重新出账</el-button>
          <el-button size="small" v-else type="success" @click="batchActionHandle('pljs')">批量确认结算</el-button>
          <el-button size="small" @click="batchActionHandle('plxz')">批量导出对账单</el-button>
        </div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='convertData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <div v-if="searchedFlag">
      <div class="head marginTop10" v-if="convertData.amount > 0" v-loading="loading" element-loading-text="页面加载中...">
        <div class="list-head whiteBg" v-for="(data, i) in beanList">
          <div class="supplier">
            <el-checkbox v-model="selection[i]">{{data.supplierName}}</el-checkbox>
          </div>
          <div class="cycle" v-text="data.setcycle"></div>
          <div class="number" v-text="data.soldNum"></div>
          <div class="saleVolume bold">{{data.totalFee | numberFmt}}</div>
          <div class="totalFee colorFee bold">{{data.payFee | numberFmt}}</div>
          <div class="grossMargin">{{data.grossProfit}}%</div>
          <div class="createDate">{{data.createDate}}</div>
          <div class="operation batchBtn" v-if="activeName === 'second'">
            <el-button size="small" @click="batchActionHandle('cxcz', i)">重新出账</el-button>
            <el-button size="small" type="primary" @click="checkFee(i)">对账</el-button>
          </div>
          <div class="operation batchBtn" v-else>
            <el-button size="small" @click="checkFee(i)">详情</el-button>
            <el-button size="small" type="success" @click="batchActionHandle('qrjs', i)">确认结算</el-button>
          </div>
        </div>
      </div>
      <searchNull v-else></searchNull>
    </div>
    <pagination class="pl" v-model="isSelectAll" :indeterminate="isIndeterminate" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="convertData.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
    <el-dialog title="确定要重新出账？" v-model="dialogVisible" size="tiny" :close-on-click-modal="false">
      <!-- <span>确定后，该对账单将流转到“<span class="colorFee">待结算</span>”模块</span> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Paging from '../common/Paging';
import Pagination from '../common/Pagination';
import axios from 'axios';
export default {
  name: 'reconciliation',
  props: ['btnName', 'activeName'],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      pageNumber: 1,
      pageSize: 10,
      selection: [],
      convertData: {},
      beanList: [],
      select: {},
      supplierName: '',
      searchedFlag: false,
    }
  },
  computed: {
    isSelectAll: {
      get() {
        return this.beanList.length ? this.selection.every(n => n) : false;
      },
      set(val) {
        this.selection = new Array(this.beanList.length).fill(val);
      }
    },
    selectIds() {
      return this.beanList.filter((n, i) => this.selection[i]).map(n => n.reportId);
    },
    isIndeterminate() {
      return this.selectIds.length > 0 && this.selectIds.length < this.beanList.length;
    },
  },
  methods: {
    checkFee(i) { // 详情页
      this.select = this.beanList[i];
      let status = this.activeName === 'second' ? 1 : 3;
      window.sessionStorage.tenantInfo = JSON.stringify(this.select);
      this.$router.push({
        path: '/finance/financeDetail',
        query: {
          stId: this.select.supplierTenantId,
          reId: this.select.reportId,
          status
        }
      });
    },
    dialogSure() {
      console.log('123');
    },
    currentChangeHandler(val) {
      this.pageNumber = val;
      this.research();
    },
    sizeChangeHandler(val) {
      this.pageSize = val;
      this.research();
    },
    batchActionHandle(todo, i) {
      let query = {};
      if (typeof i === 'number') {
        query.reportIds = [this.beanList[i].reportId];
        if (todo === 'qrjs') query.reportStatus = 4;
      } else {
        if (this.selectIds.length === 0) {
          this.$message.info('请至少选择一个供应商');
          return;
        }
        query.reportIds = this.selectIds;
        if (todo === 'pljs') query.reportStatus = 4;
        if (todo === 'plsc') query.reportStatus = '-1';
      }
      if (todo === 'cxcz' || todo === 'plcz') { // 重出账
        axios.post('/finance/report/requestForReGenerateReport', query)
          .then(res => {
            if (res.data === 0) {
              this.$message.success('重出账作业已开始，请过会儿再来~');
              this.research();
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      } else if (todo === 'plxz') { // 导出对账单
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
      } else if (todo === 'plsc') { // 删除对账单
        let message = '删除';
        axios.post('/finance/report/updateReport', query)
          .then(res => {
            if (res.data || res.data < 0) {
              this.$message.success(`${message}成功！`);
              this.research();
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      } else { // 结算
        let message = '结算';
        axios.post('/finance/report/updateReport', query)
          .then(res => {
            if (res.data || res.data === 0) {
              this.$message.success(`${message}成功！`);
              this.research();
            }
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
      }
    },
    research() { // 查询对账报表或者结算报表
      this.loading = true;
      let query = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        queryCondition: {
          supplierName: this.supplierName,
          // reportStatus: val === 'second' ? 1 : 3,
        },
      };
      query.queryCondition.reportStatus = this.activeName === 'second' ? 1 : 3;
      axios.post('finance/report/queryReports', query)
        .then(res => {
          this.convertData = res.data;
          this.beanList = this.convertData.beanList;
          this.loading = false;
          this.searchedFlag = true;
        })
        .catch(err => {
          this.$message.error(err.response ? err.response.data : err);
          this.loading = false;
        })
    }
  },
  components: {
    Paging,
    Pagination
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
  mounted() {
    this.research();
  },
  watch: {
    beanList: {
      handler(val) {
        this.selection = new Array(val.length).fill(false);
      },
      immediate: true,
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.head {
  border: solid 1px @borderLine;
  margin-top: @baseSpace * 4;
  margin-bottom: @baseSpace * 2;
  &:nth-child(3) {
    margin-top: @baseSpace * 2;
  }
}

.list-head {
  background-color: @tabBg;
  display: flex;
  font-size: @fontSize14;
  padding: 0 @baseSpace * 3;
  height: @baseSpace * 8;
  line-height: @baseSpace * 8;
  &:not(:first-child) {
    border-top: 1px solid @borderLine;
  }
  > div:not(:first-child) {
    margin-left: @baseSpace * 3;
  }
  > div + div {
    text-align: right;
  }
  .supplier {
    flex-basis: 14%;
  }
  .textIndent {
    text-indent: @baseSpace * 4 + 3px;
  }
  .cycle {
    flex-basis: 15%;
    text-align: center!important;
  }
  .number {
    flex-basis: 11%;
  }
  .saleVolume {
    flex-basis: 11%;
  }
  .totalFee {
    flex-basis: 11%;
  }
  .grossMargin {
    font-size: @baseFont;
    flex-basis: 10%;
  }
  .createDate {
    text-align: center;
    flex-basis: 15%;
  }
  .operation {
    flex-basis: 13%;
  }
}

.bold {
  font-weight: bold;
}

.list-action {
  padding: @baseSpace + 3px 0 0 @baseSpace * 3;
  display: flex;
  border-top: 1px solid @borderLine;
  align-items: baseline;
  height: @baseSpace * 8;
  .select-all {
    font-size: @baseFont;
  }
  .batchBtn,
  .paging {
    padding: 0 @baseSpace * 2;
  }
  .batchBtn {
    flex-grow: 1;
  }
}

.whiteBg {
  &:hover {
    background-color: @tabBg;
    transition: background-color 0.3s;
  }
  background-color: @white;
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}

.marginTop10 {
  margin-top: 10px;
  .list-head {
    div {
      font-size: @baseFont;
    }
  }
}
</style>
<style lang="less">
@import '../../main.less';
.batchBtn {
  .el-button {
    padding-top: 5.5px;
    padding-bottom: 5.5px;
    // border-radius: 0;
  }
}
</style>
