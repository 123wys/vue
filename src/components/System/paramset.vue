<template>
  <div class="paramset">
    <span class="settitle">订单审核</span>
    <div class="setitem">
      <template>
        <el-radio-group v-model="orderaudit">
          <el-radio class="radio orderaudit" :label="1">所有订单全部需要人工审核</el-radio><br>
          <el-radio class="radio orderaudit" :label="2">只针对有买家留言的订单进行审核</el-radio><br>
          <el-radio class="radio orderaudit" :label="3">不审单，订单直接进入待发货</el-radio>
        </el-radio-group>
      </template><br>
      <el-button size="small" type="primary" style="margin-top: 20px;" @click="setorderaudit()">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'paramset',
  data() {
    return {
      orderaudit: 3,
      getorderaudit: 1,
      allaudit: '所有订单全部需要人工审核',
      msgaudit: '只针对有买家留言的订单进行审核',
      noaudit: '不审单，订单直接进入待发货',
      ruleIds: []
    }
  },
  computed: {
    ...mapGetters([
      'ichannel'
    ])
  },
  mounted() {
    this.getTenantOrderAuditRules();
  },
  methods: {
    setorderaudit() {
      if (this.orderaudit === this.getorderaudit) {
        return;
      } else {
        this.removeOrderAuditRule();
      }
      // if (this.orderaudit === 3) {
      //   this.removeOrderAuditRule();
      // } else {
      //   this.createOrderAuditRule();
      // }
    },
    getTenantOrderAuditRules() {
      this.axios.post('/order/order/getTenantOrderAuditRules', {
        tenantId: this.ichannel.tenantInfo.tenantId
      }).then(res => {
        if (res.data.length > 0) {
          let ruletitle = res.data[0].ruleTitle;
          if (ruletitle === this.allaudit) {
            this.orderaudit = 1;
            this.getorderaudit = 1;
          } else if (ruletitle === this.msgaudit) {
            this.orderaudit = 2;
            this.getorderaudit = 2;
          }
          this.ruleIds.push(res.data[0].ruleId);
        } else {
          this.orderaudit = 3;
          this.getorderaudit = 3;
        }
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '获取订单审核规则失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    removeOrderAuditRule() {
      if (this.ruleIds.length === 0) {
        this.createOrderAuditRule();
        return;
      }
      this.axios.post('/order/order/removeOrderAuditRule', {
        ruleIds: this.ruleIds
      }).then(res => {
        if (this.orderaudit !== 3) {
          // 如果需要审单，先删除原来的规则，再创建新的规则
          this.createOrderAuditRule();
        } else {
          this.getTenantOrderAuditRules();
        }
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '删除订单审核规则失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    createOrderAuditRule() {
      this.axios.post('/order/order/createOrderAuditRule', {
        ruleType: this.orderaudit
      }).then(res => {
        this.getTenantOrderAuditRules();
      }).catch(err => {
        this.$msgbox({
          title: '提示',
          message: '添加订单审核规则失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.settitle {
  font-size: @homeFont18;
  color: @baseGary;
}
.setitem {
  padding-bottom: 20px;
  border-bottom: 1px solid @borderLine;
}
.orderaudit {
  padding-top: 10px;
}
</style>
