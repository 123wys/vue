<template>
  <div class="ruleDetail">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{path: '/financeRule'}">结算规则</el-breadcrumb-item>
      <el-breadcrumb-item>规则详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <span><span class="supplierName">{{tenantEnum[ruleDetail.supplierTenantId]}}</span></span>
    </div>
    <div class="ruleinfo">
      <span><span class="ruletitle">规则名称</span>{{ruleDetail.ruleName}}</span>
    </div>
    <div class="ruleinfo">
      <span><span class="ruletitle">有效期限</span>{{startDate + '~' + endDate}}</span>
    </div>
    <div class="ruleinfo">
      <span>
        <span class="ruletitle">结算订单</span>
        <span v-show="orderState.indexOf('1') >= 0">待发货</span>
        <span v-show="orderState.indexOf('3') >= 0">已发货</span>
        <span v-show="orderState.indexOf('4') >= 0">已完成</span>
        <span v-show="warrantyStatus === '1,2,4,5'">售后单</span>
        <span v-show="warrantyStatus === '1,2,4,5'" class="ruletitle">（包含退款中、退款关闭、退货中、退货关闭）</span>
      </span>
    </div>
    <div class="ruleinfo">
      <span>
        <span class="ruletitle">结算类型</span>
        <span v-if="ruleDetail.ruleType === 1">按供货价</span>
        <span v-else-if="ruleDetail.ruleType === 2">按销售额比例</span>
      </span>
    </div>
    <div class="ruleinfo">
      <span><span class="ruletitle">商品设置</span>已选商品SKU<label style="margin-left: 5px;color: #F5A623;">{{ruleDetail.applySKU}}</label>个</span>
    </div>
    <div class="tablebody">
      <el-table :data="ruleDetail.skuList" style="width: 80%" :default-sort="{prop: 'skuName', order: 'descending'}">
        <el-table-column prop="skuName" label="商品名称" width="350"></el-table-column>
        <el-table-column label="SKU">
          <template scope="scope">
            <div style="padding:10px 0 10px 0">
              <div>{{scope.row.skuCharSpec}}</div>
              <div>{{scope.row.outerId}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleDetail.ruleType === 1" label="供货价(元)" width="150">
          <template scope="scope">
            <div>{{scope.row.costPrice | numberFmt}}</div>
          </template>
        </el-table-column>
        <el-table-column v-else-if="ruleDetail.ruleType === 2" prop="numerator" label="销售额比例(%)" width="150"></el-table-column>
        <template slot="empty">
          <searchNull></searchNull>
        </template>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleDetail: {},
        loading: false,
        startDate: '',
        endDate: '',
        orderState: '',
        warrantyStatus: '',
      }
    },
    computed: {
      tenantEnum() {
        return this.$store.getters.tenantEnum;
      }
    },
    methods: {
      ruleDetailData() {
        this.ruleDetail = JSON.parse(window.sessionStorage.ruleDetail);
        this.startDate = JSON.stringify(this.ruleDetail.effectiveDate).slice(1, 11);
        this.endDate = JSON.stringify(this.ruleDetail.expireDate).slice(1, 11);
        this.orderState = this.ruleDetail.ordStatus;
        this.warrantyStatus = this.ruleDetail.warrantyStatus;
      },
    },
    filters: {
      numberFmt(val) {
        let s = parseFloat(val / 100).toFixed(2) + '';
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
      this.ruleDetailData();
    }
  }
</script>
<style lang="less" scoped>
  @import '../../main.less';
  ruleDetail {
    font-size: 14px;
  }
  .supplierName {
    font-size: 16px;
    font-weight: bold;
    margin-right: @baseSpace;
  }
  .ruleinfo {
    margin-top: @baseSpace*3;
  }

  .ruletitle {
    color: #99A9BF;
    margin-right: @baseSpace*3;
  }

  .tablebody {
    margin-top: @baseSpace*3;
    margin-left: @baseSpace*12;
  }
</style>
