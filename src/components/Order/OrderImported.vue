<template>
  <div class="order-imported">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>导入记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search" :model="query" label-width="120px">
      <el-form-item label="导入类别">
        <el-select v-model="query.jobType" id="type" size="small">
          <el-option label="订单" :value="0"></el-option>
          <el-option label="运单" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item id="importdate" label="导入日期">
        <el-date-picker type="daterange" size="small" v-model="query.createTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item id="action">
        <el-button type="primary" size="small" @click="queryHandler">查询</el-button>
      </el-form-item>
    </el-form>
    <div v-if="searchedFlag" v-loading="loading" element-loading-text="拼命加载中...">
      <div class="result">
        <el-table :data="importedData.beanList" style="width: 100%">
          <el-table-column prop="uploadFile" label="文件名称" min-width="150">
          </el-table-column>
          <el-table-column prop="createTime" label="导入日期" min-width="100">
          </el-table-column>
          <el-table-column prop="opId" label="操作员" min-width="100">
            <template scope="scope">
              <span v-text="opLabel(scope.row.createOp)"></span>
            </template>
          </el-table-column>
          <el-table-column label="处理状态" min-width="50">
            <template scope="scope">
              <el-tag :type="statusType(scope.row.jobStatus)" v-text="statusLabel(scope.row.jobStatus)"></el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态信息" min-width="200">
            <template scope="scope">
              <el-tooltip placement="top-start">
                <div slot="content" class="tt" v-text="scope.row.jobMemo"></div>
                <span class="oneline" v-text="scope.row.jobMemo"></span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!--         <el-table-column prop="successCount" label="处理成功／条" min-width="100">
        </el-table-column>
        <el-table-column prop="errorCount" label="处理失败／条" min-width="100">
        </el-table-column>
        <el-table-column prop="export" label="导出处理结果" min-width="100">
          <template scope="scope">
            <el-popover placement="top" width="160" trigger="click" v-model="showPopover[scope.$index]">
              <p>文件导出时间较长，确定导出？</p>
              <div style="text-align: right">
                <el-button size="mini" type="text" @click="showPopover.splice(scope.$index,1)">取消</el-button>
                <el-button type="primary" size="mini" @click="exportFile(scope.row.batchId,scope.$index)">确定</el-button>
              </div>
              <el-button v-if="scope.row.status==3" slot="reference" type="text"><i class="icon iconfont icon-daochu" style="font-size: 28px"></i></el-button>
            </el-popover>
          </template>
        </el-table-column> -->
          <searchNull slot="empty"></searchNull>
        </el-table>
        <div class="foot">
          <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="query.pageNumber" :page-sizes="[10, 20, 50]" :page-size="query.pageSize" :total="importedData.amount" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let queryAsyncJobsUrl = 'order/order/queryAsyncJobs';
import dateFormat from 'dateFormat';
import axios from 'axios';
export default {
  name: 'order-imported',
  props: {},
  components: {},
  data() {
    let end = new Date();
    let start = new Date(end.getFullYear(), end.getMonth() - 1, end.getDate() + 1);
    return {
      queryType: 0,
      query: {
        jobType: 2,
        createTime: [start, end],
        pageSize: 10,
        pageNumber: 1,
      },
      importedData: {
        amount: 0,
        beanList: [],
      },
      showPopover: [],
      loading: false,
      searchedFlag: false,
    }
  },
  computed: {
    jobStatus() {
      return this.$store.state.enumSet.jobStatus
    }
  },
  methods: {
    queryHandler() {
      this.loading = true;
      let queryCondition = {
        jobType: this.query.jobType,
      }
      if (this.query.createTime && this.query.createTime[0]) {
        queryCondition.beginCreateTime = dateFormat(this.query.createTime[0], 'yyyy-mm-dd HH:MM:ss');
        queryCondition.endCreteTime = dateFormat(this.query.createTime[1], 'yyyy-mm-dd') + ' 23:59:59';
      }
      axios.post(queryAsyncJobsUrl, {
        queryCondition,
        pageSize: this.query.pageSize,
        pageNumber: this.query.pageNumber,
      }).then(response => {
        this.importedData = response.data;
        this.loading = false;
        this.searchedFlag = true;
      }).catch(err => {
        this.loading = false;
        this.$message.error({
          message: '查询失败，' + err,
        })
      })
    },
    sizeChangeHandler(pageSize) {
      this.query.pageSize = pageSize;
      this.queryHandler();
    },
    currentChangeHandler(pageNumber) {
      this.query.pageNumber = pageNumber;
      this.queryHandler();
    },
    exportFile(batchId, index) {
      // window.open(axios.defaults.baseURL + exportUrl + '?batchId=' + batchId);
      this.showPopover.splice(index, 1);
    },
    statusLabel(status) {
      return this.jobStatus[parseInt(status)].label;
    },
    statusType(status) {
      return this.jobStatus[parseInt(status)].type;
    },
    opLabel(opId) {
      return this.$store.state.enumSet.operatorEnum[opId] || opId;
    },
  },
  watch: {
    importedData: {
      handler(val) {
        this.showPopover = new Array(val.amount).fill(false);
      },
      immediate: true,
    }
  },
  activated() {
    this.queryHandler();
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.order-imported {
  padding: @normalSize;
}

.search {
  padding: @normalSize 0;
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    flex-basis: 25%;
    min-width: 250px;
    margin-bottom: @baseSize;
  }
  .el-form-item#action {
    flex-basis: 100%;
  }
}

.tt {
  padding-left: @baseSpace*3;
}

.oneline {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.foot {
  text-align: end;
  padding: @smallSize;
}
</style>
