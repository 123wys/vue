<template>
  <el-dialog title="结算规则选择" v-model="dialogShow" size="tiny" :close-on-click-modal="false" @close="close" @open="querySettlementRule()">
    <div class="rule">
      <div class="maxHeight">
        <div v-for="(rule, j) in ruleSelectList" class="ruleName">
          <el-radio :label="rule" v-model="radio">{{rule.ruleName}}</el-radio>
        </div>
      </div>
      <div>
        <!-- <el-button v-if="ruleAmount <= 5" type="text">
          <i class="icon iconfont icon-tianjia"></i>&nbsp;<span>新增结算规则</span>
        </el-button> -->
        <el-button v-if="ruleAmount !== pageSize" type="text" @click="querySettlementRule('more')">展示更多</el-button>
        <el-button v-else type="text" @click="querySettlementRule()">点击收起</el-button>
      </div>
      <div class="btn">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="confirm()">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import axios from 'axios';
export default{
  // props: ['ruleSelectList'],
  props: {
    dialog: {
      default: false,
    },
  },
  data() {
    return {
      pageSize: 5,
      ruleAmount: '',
      radio: {},
      ruleSelectList: []
    }
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialog;
      },
      set(val) {
        if (val || !this.dialog) return;
        this.$emit('cancel');
      }
    },
  },
  methods: {
    close() {
      this.radio = {};
      this.$emit('cancel');
    },
    querySettlementRule(flag) {
      if (this.radio.ruleName) {
        this.radio = {};
      }
      if (flag && flag === 'more') {
        this.pageSize = this.ruleAmount;
      } else {
        this.pageSize = 5;
      }
      let query = {
        queryCondition: {},
        pageNumber: 1,
        pageSize: this.pageSize
      }
      axios.post('/finance/rule/NewQuerySettlementRule', query)
        .then(res => {
          this.ruleAmount = res.data.amount;
          this.ruleSelectList = res.data.beanList;
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          });
        })
    },
    confirm() {
      this.$emit('confirm', this.radio);
      this.radio = {};
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.rule {
  .maxHeight {
    max-height: 500px;
    overflow: auto;
    padding-bottom: 10px;
  }
  .ruleName {
    display: flex;
    padding-top: 10px;
    justify-content: flex-start;
  }
  .btn {
    display: flex;
    justify-content: flex-end;
    padding: 10px 5px;
  }
}
</style>
<style lang="less">
@import '../../main.less';
.rule {
  .el-dialog__body {
    padding: 10px 20px 10px 20px !important; 
  }
}
</style>
