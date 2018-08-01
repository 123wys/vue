<template>
	<div>
		<el-input placeholder="输入供应商名称" v-model="queryCondition.supplierName">
			<template slot="append">
				<el-button @click="formSubmit">{{btnName}}</el-button>
			</template>
		</el-input>
    <span>
      <a class="moreCheck" @click="checkToggle">{{checkMore ? '精简搜索条件' : '更多搜索条件'}}</a>
    </span>
    <div v-if="checkMore" class="checkMore">
      <span style="font-size:12px;color:#1F2D3D;margin-right:10px;">结算周期</span>
      <el-date-picker type="date" size="mini" v-model="beginDateValue" placeholder="请选择日期"></el-date-picker><span style="margin-left:5px;margin-right:5px;">至</span>
      <el-date-picker type="date" size="mini" v-model="endDateValue" placeholder="请选择日期"></el-date-picker>
      <div class="serchBtn">
        <el-button type="primary" @click="formSubmit">搜索 </el-button>
      </div>
    </div>
    <div class="tableData">
      <div class="head">
        <div class="supplyName">供应商</div>
        <div class="setcycle">结算周期</div>
        <div class="salenumber">已销商品数(件)</div>
        <div class="saleamount">销售额(元)</div>
        <div class="shouldamount">应付总额(元)</div>
        <div class="grossprofit">毛利率</div>
        <div class="createDate">操作时间</div>
        <div class="action">操作</div>
      </div>
      <div class="body" v-loading="loading" element-loading-text="拼命加载中">
        <template v-if="tableData && tableData.amount">
          <div class="tablebody" v-for="(item, i) in tableData.beanList">
            <div class="supplyName" style="font-weight: bold;">{{item.supplierName}}</div>
            <div class="setcycle" style="font-size:12px;">{{item.setcycle}}</div>
            <div class="salenumber">{{item.soldNum}}</div>
            <div class="saleamount" style="color: #1F2D3D;font-weight: bold;">{{item.totalFee | numberFmt}}</div>
            <div class="shouldamount" style="color: #FF6600;font-weight: bold;">{{item.payFee | numberFmt}}</div>
            <div class="grossprofit">{{item.grossProfit}}</div>
            <div class="createDate">{{item.createDate}}</div>
            <div class="action"><el-button size="small" @click="checkFee(i)">详情</el-button></div>
          </div>
        </template>
        <searchNull v-else></searchNull>
      </div>
    </div>
    <pagination class="pl" :isShowSelect="false" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="tableData.amount" @size-change="sizeChangeHandler" @current-change="currentChangeHandler"></pagination>
	</div>
</template>
<script>
import axios from 'axios'
import Pagination from '../common/Pagination';
export default {
  name: 'settlement',
  props: ['btnName', 'moreCheck', 'activeName'],
  data() {
    return {
      loading: false,
      pageSize: 10,
      pageNumber: 1,
      beginDateValue: '',
      endDateValue: '',
      checkMore: false, // 精确查询开关
      tableData: '',
      testData: {
        'amount': 2,
        'beanList': [{
          'supplierName': 'XXXXX供应商A',
          'setcycle': '02-01~03-31',
          'soldNum': '1343',
          'totalFee': '112301.23',
          'payFee': '112301.23',
          'grossProfit': '0.32',
        }, {
          'supplierName': 'XXXXX供应商B',
          'setcycle': '02-01~03-31',
          'soldNum': '1343',
          'totalFee': '112301.23',
          'payFee': '112301.23',
          'grossProfit': '0.32',
        }]
      },
      queryCondition: {
        supplierName: '',
        reportStatus: '4',
        // beginDate: '',
        // endDate: '',
      }
    }
  },
  methods: {
    checkFee(i) { // 详情页
      this.select = this.tableData.beanList[i];
      let status = this.activeName === 'fourth' ? 4 : 3;
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
    currentChangeHandler(val) {
      this.pageNumber = val;
    },
    sizeChangeHandler(val) {
      this.pageSize = val;
    },
    checkToggle: function() {
      this.checkMore = !this.checkMore
    },
    timeFormat: function(time) {
      if (typeof time !== 'undefined') {
        let tf = new Date(time);
        let yy = tf.getFullYear();
        let MM = (tf.getMonth() + 1) > 9 ? tf.getMonth() + 1 : ('0' + (tf.getMonth() + 1));
        let dd = tf.getDate() > 9 ? tf.getDate() : '0' + tf.getDate();
        time = `${yy}-${MM}-${dd}`;
        return time;
      }
    },
    formSubmit: function() {
      this.loading = true;
      let query = {}; // 查询条件
      query.queryCondition = this.queryCondition;
      if (this.beginDateValue !== '') {
        query.queryCondition.beginDate = this.timeFormat(this.beginDateValue) + ' 00:00:00';
      }
      if (this.endDateValue !== '') {
        query.queryCondition.endDate = this.timeFormat(this.endDateValue) + ' 00:00:00';
      }
      query.pageSize = this.pageSize;
      query.pageNumber = this.pageNumber;
      axios.post('/finance/report/queryReports', query).then(res => {
        this.loading = false;
        this.tableData = JSON.parse(res.request.response);
      }).catch((err) => {
        this.loading = false;
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    }
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
  components: {
    Pagination,
  },
  mounted() {
    this.formSubmit();
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';

.moreCheck {
  cursor: pointer;
  color: #4990E2;
  font-size: 12px;
  line-height: 30px;
  text-decoration: underline;
  margin-left: @baseSpace * 2;
}

.checkMore {
  margin-top: @baseSpace * 3;
  .el-input{
    width: 150px;
  }
}

.serchBtn{
  margin-top: 10px;
  margin-left: 60px;
  .el-button{
    padding-top: 5.5px;
    padding-bottom:5.5px;
    // border-radius: 0;
  }
}

.tableData {
  margin-top: 20px;
  border: solid 1px @borderLine;
}

.head {
  background-color: @tabBg;
  display: flex;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  .supplyName {
    flex-basis: 18%;
    margin-left: 20px;
  }
  .setcycle {
    flex-basis: 10%;
    margin-left: 15px;
    text-align: center;
  }
  .salenumber {
    flex-basis: 10%;
    margin-left: 15px;
    text-align: end;
  }
  .saleamount {
    flex-basis: 12%;
    margin-left: 15px;
    text-align: end;
  }
  .shouldamount {
    flex-basis: 12%;
    margin-left: 15px;
    text-align: end;
  }
  .grossprofit {
    flex-basis: 10%;
    margin-left: 15px;
    text-align: end;
  }
  .createDate {
    text-align: center;
    flex-basis: 15%;
  }
  .action {
    flex-basis: 13%;
    margin-left: 15px;
    margin-right: 15px;
    text-align: end;
  }
}

.tablebody {
  &:hover {
    background-color: @tabBg;
    transition: background-color 0.3s;
  }
  border-top: solid 1px @borderLine;
  background-color: @white;
  display: flex;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  .supplyName {
    flex-basis: 18%;
    margin-left: 20px;
  }
  .setcycle {
    flex-basis: 10%;
    margin-left: 15px;
    text-align: center;
  }
  .salenumber {
    flex-basis: 10%;
    margin-left: 15px;
    text-align: end;
  }
  .saleamount {
    flex-basis: 12%;
    margin-left: 15px;
    text-align: end;
  }
  .shouldamount {
    flex-basis: 12%;
    margin-left: 15px;
    text-align: end;
  }
  .grossprofit {
    flex-basis: 10%;
    margin-left: 15px;
    text-align: end;
  }
  .createDate {
    text-align: center;
    flex-basis: 15%;
  }
  .action {
    flex-basis: 13%;
    margin-left: 15px;
    margin-right: 15px;
    text-align: end;
    .el-button{
      padding-top: 5.5px;
      padding-bottom:5.5px;
      // border-radius: 0;
    }
  }
}

.pl {
  padding-left: @baseSpace*3 !important;
}

.searchNull {
  padding: 160px 0 173px;
  background-color: @white;
  border: solid 1px @borderLine;
}
</style>