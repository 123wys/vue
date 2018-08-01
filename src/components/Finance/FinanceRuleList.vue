<template>
  <div>
    <el-input v-model="supplier" placeholder="输入规则名称"  @keyup.enter.native="querySettlementRuleList">
      <template slot="append">
        <el-button @click="querySettlementRuleList">搜索规则</el-button>
      </template>
    </el-input>
    <div class="tableData">
      <div class="head">
        <div class="ruleName textIndent">结算规则</div>
        <div class="orderType">订单类型</div>
        <div class="warrantyType">售后类型</div>
        <div class="status">执行状态</div>
        <div class="action">操作</div>
      </div>
      <div class="tableaction batchBtn">
        <el-checkbox class="select-all" v-model="isSelectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        <div class="batchBtn">
          <el-button size="small" @click="batchActionHandle('plzf')">批量作废</el-button>
        </div>
        <el-button type="primary" size="small" @click="showAddRuleDialog()">新增规则</el-button>
        <paging class="paging" :page-size="pageSize" :page-number="pageNumber" :total='ruleData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <div v-if="ruleData && ruleData.amount" class="tableData" v-loading="loading" element-loading-text="拼命加载中">
      <div v-for="(rule, j) in ruleData.beanList" class="head whiteBg">
        <div class="ruleName">
          <el-checkbox v-model="selection[j]">
            <span style="font-size:12px;margin-left:10px;font-weight: bold;color:1F2D3D;">{{rule.ruleName}}</span>
            <!-- <span v-if="rule.ruleFlag === 1" class="huodong">活动</span> -->
          </el-checkbox>
        </div>
        <div class="orderType">
          <span v-show="rule.rule.ordStatus.indexOf('1') >= 0">待发货</span>
          <span v-show="rule.rule.ordStatus.indexOf('3') >= 0">已发货</span>
          <span v-show="rule.rule.ordStatus.indexOf('4') >= 0">已完成</span>
          <span v-show="rule.rule.ordStatus === '-2'">未选择</span>
        </div>
        <div class="warrantyType">
          <span v-show="rule.rule.warrantyStatus.indexOf('1') >= 0">退款中</span>
          <span v-show="rule.rule.warrantyStatus.indexOf('2') >= 0 && rule.rule.warrantyStatus.indexOf('-2') < 0">退款关闭</span>
          <span v-show="rule.rule.warrantyStatus.indexOf('3') >= 0">退款成功</span>
          <span v-show="rule.rule.warrantyStatus.indexOf('4') >= 0">退货中</span>
          <span v-show="rule.rule.warrantyStatus.indexOf('5') >= 0">退货关闭</span>
          <span v-show="rule.rule.warrantyStatus.indexOf('6') >= 0">退货成功</span>
        </div>
        <div v-if="rule.matchingStatus === 1" class="status"><span style="color:#71A834;">已关联</span></div>
        <div v-else class="status"><span style="color:#66728C;">未关联</span></div>
        <div class="action batchBtn">
          <!-- <el-button size="small" @click="editRule(rule.rule)">编辑</el-button> -->
          <el-button v-if="rule.matchingStatus === 1" size="small" @click="cancelRule(supplierId, rule.rule.ruleId)">作废</el-button>
          <!-- <el-button size="small" @click="showRule(rule)">详情</el-button> -->
        </div>
      </div>
    </div>
    <div v-else class="nullstyle">
      <searchNull class="margin-t80" style="padding-top:60px;padding-bottom:60px;"></searchNull>
    </div>
    <pagination class="pl" v-model="isSelectAll" :indeterminate="isIndeterminate" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="ruleData.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
    <el-dialog v-model="showAddRule" title="新增规则" size="small" top="10%" :close-on-click-modal="false">
      <rule-dialog @cancel="closeDialog"></rule-dialog>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import Paging from '../common/Paging';
import Pagination from '../common/Pagination';
import ruleDialog from './ruleDialog';
import bus from '../../store/bus.js';
export default {
  name: 'financeRuleList',
  props: ['supplierId'],
  data() {
    return {
      pageNumber: 1,
      pageSize: 10,
      selection: [],
      ruleData: {
        amount: 0,
        beanList: [],
      },
      supplier: '',
      loading: false,
      showAddRule: false,
    }
  },
  computed: {
    isSelectAll: {
      get() {
        return this.selection.length > 0 && this.selection.every(n => n);
      },
      set(val) {
        this.selection = new Array(this.ruleData.beanList.length).fill(val);
      }
    },
    selectIds() {
      return this.ruleData.beanList.filter((n, i) => this.selection[i]).map(n => n.rule.ruleId);
    },
    isIndeterminate() {
      return this.selectIds.length > 0 && this.selectIds.length < this.ruleData.beanList.length;
    },
    tenantEnum() {
      return this.$store.getters.tenantEnum;
    }
  },
  methods: {
    currentChangeHandler(val) {
      this.pageNumber = val;
      this.querySettlementRuleList();
    },
    sizeChangeHandler(val) {
      this.pageSize = val;
      this.querySettlementRuleList();
    },
    batchActionHandle(todo) {
      this.$message.info('开发中');
      return;
    },
    querySettlementRuleList() {
      this.loading = true;
      // let state = this.activeName === 'first' ? 1 : 0;
      let query = {
        queryCondition: {
          ruleName: this.supplier,
          supplierTenantId: this.supplierId
        },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      // axios.post('/finance/rule/mapQuerySettlementRule', query)
      axios.post('/finance/rule/NewQuerySettlementRule', query)
        .then(res => {
          this.loading = false;
          this.ruleData = res.data;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
    },
    addRule(item) {
      window.sessionStorage.supplier = JSON.stringify(item);
      this.$router.push({
        path: '/financeRule/addfinanceRule',
        query: {
          tenantId: item.tenantId
        }
      });
    },
    cancelRule(tenantId, ruleId) {
      let ruleIds = [];
      ruleIds.push(ruleId);
      this.changeRule(axios.post('/finance/rule/NewCancelRuleMatching', {
        supplierTenantId: tenantId,
        ruleIds: ruleIds
      }, '正在作废当前结算规则', '作废成功！'));
    },
    changeRule(xhrPromise, loadingMsg = '正在更新规则信息', successMsg = '作废成功！') {
      xhrPromise.then(response => {
        this.$message.success({
          message: successMsg,
        });
        this.querySettlementRuleList();
      }).catch(err => {
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    showRule(rule) {
      window.sessionStorage.ruleDetail = JSON.stringify(rule);
      this.$router.push({
        path: '/financeRule/financeRuleDetail',
        query: {
          ruleId: rule.ruleId
        }
      });
    },
    editRule(rule) {
      window.sessionStorage.singleRuleDetail = JSON.stringify(rule);
      this.$router.push({
        path: '/financeRule/editFinanceRule',
        query: {
          ruleId: rule.ruleId
        }
      });
    },
    showAddRuleDialog() {
      this.showAddRule = true;
    },
    closeDialog() {
      this.showAddRule = false;
    }
  },
  components: {
    Paging,
    Pagination,
    ruleDialog
  },
  mounted() {
    bus.$on('searchSettlementRule', this.querySettlementRuleList);
    this.querySettlementRuleList();
  },
  watch: {
    ruleData: {
      handler(val) {
        this.selection = new Array(val.length).fill(false);
      },
      immediate: true,
    }
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.el-input{
  width: 320px;
}

.tableData {
  margin-top: @baseSpace * 4;
  margin-bottom: @baseSpace * 2;
  border: solid 1px @borderLine;
  &:nth-child(3) {
    margin-top: @baseSpace * 2;
  }
}

.tableborder {
  border-left: solid 1px @borderLine;
  border-right: solid 1px @borderLine;
  border-top: solid 1px @borderLine;
}

.head {
  background-color: @tabBg;
  display: flex;
  font-size: @fontSize14;
  padding: 0 @baseSpace * 3;
  height: @baseSpace * 8;
  line-height: @baseSpace * 8;
  &:not(:first-child) {
    border-top: 1px solid @borderLine;
  }
  .ruleName {
    flex-basis: 40%;
    margin-left: 15px;
    min-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .textIndent {
    text-indent: @baseSpace;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .orderType {
    flex-basis: 20%;
    margin-left: 15px;
    min-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .warrantyType {
    flex-basis: 20%;
    margin-left: 15px;
    min-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status {
    flex-basis: 10%;
    text-align: center;
    min-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .action {
    flex-basis: 10%;
    margin-right: 15px;
    text-align: end;
    min-width: 130px;
  }
}

.tableaction {
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
    font-size: @baseFont;
    padding: 0 @baseSpace * 2;
  }
  .batchBtn {
    flex-grow: 1;
  }
  .paging {
    margin-left: 10px;
    border-left: solid 1px @borderLine;
  }
}

.body {
  background-color: @white;
}

.supplierlist {
  background-color: #E8F5FF;
  line-height: 20px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.left > span + span {
  margin-left: @baseSize*3;
}

.supplierName {
  font-size: 14px;
  color: @black;
  margin-left: @baseSize*3;
  margin-right: @baseSize*4;
}

.whiteBg {
  background-color: @white;
}

.huodong {
  margin-left: 10px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 12px;
  background: @warningYellow;
  color: #fff;
  text-align: center;
  border-radius: 10px;
}

.seerule {
  margin-left: @baseSize * 2;
  color: #99a9Bf;
  cursor: pointer;
  user-select: none;
}

.norule {
  color: #8492A6;
  font-size: 14px;
  text-align: center;
  height: 40px;
  line-height: 40px;
}

.nullstyle {
  height: 420px;
  border:solid 1px #E5E9F2;
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
.el-dialog__body {
  padding: 30px 20px 10px 20px !important;
}
</style>
