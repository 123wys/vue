<template>
  <div>
    <el-input placeholder="输入供应商名称" class="search" v-model="supplierName" @keyup.native.enter="searchHandler">
      <template slot="append">
        <el-button @click="searchHandler" @keyup.native.enter="searchHandler">搜索</el-button>
      </template>
    </el-input>
    <div class="head">
      <div class="cols">
        <div class="supplier">供应商</div>
        <div class="operation">操作</div>
      </div>
      <div class="list-action">
        <el-checkbox class="select-all" v-model="isSelectAll" :indeterminate="isIndeterminate">全选</el-checkbox>
        <div class="batch-btn">
          <el-button size="small" type="primary" @click="batchChargeOff">批量出账</el-button>
        </div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='supplierDate.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <div class="body" v-loading="loading" element-loading-text="拼命加载中">
      <template v-if="supplierDate && supplierDate.amount">
        <div class="row" v-for="(supplier,index) in supplierDate.beanList">
          <div class="supplier">
            <el-checkbox v-model="selects[index]">{{supplier.enterpriseTitle}}</el-checkbox>
          </div>
          <div class="operation">
            <el-button type="primary" size="small" @click="chargeOff(supplier)">出账</el-button>
          </div>
        </div>
      </template>
      <searchNull v-else></searchNull>
    </div>
    <pagination class="pl" v-model="isSelectAll" :indeterminate="isIndeterminate" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="supplierDate.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
    <el-dialog :title="dialog.title" v-model="dialog.show" size="tiny" :close-on-click-modal="false">
      <div class="msg">
        <div v-if="dialog.batch">已选<span class="blue">{{selectIds.length}}</span>个供应商</div>
        <div v-else v-text="dialog.msg"></div>
      </div>
      <el-form :model="dialogForm" ref="dialogForm" :rules="rules">
        <el-form-item label="出账时间">
          <el-radio-group v-model="reportType" style="line-height:2;">
            <el-radio :label="1">按订单付款时间</el-radio><br>
            <el-radio :label="2">按订单发货时间<span style="color:#F5A623;">(仅适用于在小亚通发货的订单)</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结算周期" prop="dateRange">
          <el-date-picker v-model="dialogForm.dateRange" type="daterange" :picker-options="pickerOptions" placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="muted">温馨提示：出账时按订单的付款时间结算。为保证结算准确，结算周期截止时间最近为7天前</div>
      <span slot="footer">
        <el-button size="small" @click="chargeOffCancel">取 消</el-button>
        <el-button size="small" type="primary" @click="chargeOffSure">确定出账</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import Paging from '../common/Paging';
import Pagination from '../common/Pagination';
// import {
//   checkData
// } from './checkData';
import dateFormat from 'dateFormat';
const queryTenantUrl = '/customer/tenantInfo/queryTenant';
const generateReportUrl = '/finance/report/generateReport';
export default {
  name: 'charge-off',
  data() {
    return {
      supplierName: '',
      pageNumber: 1,
      pageSize: 10,
      loading: false,
      selects: [],
      supplierDate: {
        amount: 0,
        beanList: [],
      },
      dialog: {
        show: false,
        batch: false,
        title: '出账',
        msg: '',
      },
      tenantId: '',
      dialogForm: {
        dateRange: ''
      },
      reportType: 1,
      rules: {
        dateRange: {
          required: true,
          type: 'array',
          message: '请选择时间范围！',
          trigger: 'blur',
          fields: {
            0: {
              required: true,
              type: 'date',
              message: '请选择时间范围！',
            },
            1: {
              required: true,
              type: 'date',
              message: '请选择时间范围！',
            },
          }
        }
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > (Date.now() - 3600 * 1000 * 24 * 7);
        }
      }
    }
  },
  computed: {
    isSelectAll: {
      get() {
        return this.selects.length > 0 && this.selects.every(n => n);
      },
      set(val) {
        // this.selects.forEach((n, i) => {
        //   this.selects.splice(i, 1, val);
        // })
        this.selects = new Array(this.supplierDate.beanList.length).fill(val);
      }
    },
    selectIds() {
      return this.supplierDate.beanList.filter((n, i) => this.selects[i]).map(n => n.tenantId);
    },
    isIndeterminate() {
      return this.selectIds.length > 0 && this.selectIds.length < this.supplierDate.beanList.length
    }
  },
  watch: {
    supplierDate: {
      handler(val) {
        this.selects = new Array(val.beanList.length).fill(false);
      },
      immediate: true,
    }
  },
  methods: {
    searchHandler() {
      let query = {
        queryCondition: {
          enterpriseTitle: this.supplierName,
          assocStatus: [0, 1],
          querySupplier: 1,
        },
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      this.loading = true;
      axios.post(queryTenantUrl, query).then(response => {
        this.loading = false;
        this.supplierDate = response.data;
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '查询失败，' + (err.response ? err.response.data : err),
          type: 'error',
        });
      })
    },
    currentChangeHandler(val) {
      this.pageNumber = val;
      this.searchHandler();
    },
    sizeChangeHandler(val) {
      this.pageSize = val;
      this.searchHandler();
    },
    batchChargeOff() {
      if (this.selectIds.length === 0) {
        this.$message.error('请选择供应商！');
        return;
      }
      this.dialog.title = '批量出账';
      this.dialog.batch = true;
      this.dialog.show = true;
    },
    chargeOff(rec) {
      this.dialog.title = '出账';
      this.dialog.batch = false;
      this.dialog.msg = rec.enterpriseTitle;
      this.tenantId = rec.tenantId;
      this.dialog.show = true;
    },
    chargeOffSure() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          let ids = this.dialog.batch ? this.selectIds : [this.tenantId];
          this.loading = true;
          axios.post(generateReportUrl, {
            supplierTenantIds: ids,
            reportType: this.reportType,
            beginDate: dateFormat(this.dialogForm.dateRange[0], 'yyyy-mm-dd HH:MM:ss'),
            endDate: dateFormat(this.dialogForm.dateRange[1], 'yyyy-mm-dd') + ' 23:59:59',
          }).then(() => {
            this.$message.success(`出账作业已开始，请稍后查看待对账列表~`);
            this.dialog.show = false;
            this.loading = false;
            this.isSelectAll = false;
          }).catch(err => {
            this.dialog.show = false;
            this.loading = false;
            this.$msgbox({
              title: '提示',
              message: '出账失败，' + (err.response ? err.response.data : err),
              type: 'error',
            });
          })
        } else {
          return false;
        }
      })
    },
    chargeOffCancel() {
      this.dialog.show = false;
      this.$refs.dialogForm.validate((valid) => {
        if (!valid) {
          this.$refs.dialogForm.resetFields();
        }
      });
    }
  },
  mounted() {
    this.searchHandler();
  },
  components: {
    Paging,
    Pagination,
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.search {
  margin-bottom: @baseSpace * 4;
}

.head {
  border: solid 1px @borderLine;
  margin-bottom: @baseSpace*2;
  .cols {
    font-size: 13px;
    background-color: @tabBg;
    height: @baseSpace * 8;
    line-height: @baseSpace * 8;
    display: flex;
    justify-content: space-between;
    .supplier {
      padding-left: @baseSpace*7;
    }
  }
}

// .supplier {
//   flex-basis: 30%;
// }
.operation {
  text-align: end;
  padding-right: @baseSpace*7;
}

.list-action {
  background-color: @white;
  padding: @baseSpace+2 @baseSpace * 3;
  display: flex;
  border-top: 1px solid @borderLine;
  align-items: baseline;
  .select-all {
    font-size: @baseFont;
  }
  .batch-btn {
    font-size: @baseFont;
    padding: 0 @baseSpace * 2;
  }
  .batch-btn {
    flex-grow: 1;
  }
}

.body {
  .row {
    &:hover {
      background-color: @tabBg;
      transition: background-color 0.3s;
    }
    background-color: @white;
    padding: @baseSpace 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border: solid 1px @borderLine;
    +.row {
      border-top: none;
    }
    .supplier {
      padding-left: @baseSpace*3;
    }
  }
}

.pl {
  padding-left: @baseSpace*3 !important;
}

.blue {
  color: @primaryBlue;
  font-size: 14px;
}

.msg {
  padding-bottom: @baseSpace*4;
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}
</style>
<style lang="less">
@import '../../main.less';
.batch-btn {
  .el-button {
    padding-top: 5.5px;
    padding-bottom: 5.5px;
  }
}

.finance {
  .el-dialog__body {
    padding: @baseSpace*4;
  }
}
</style>
