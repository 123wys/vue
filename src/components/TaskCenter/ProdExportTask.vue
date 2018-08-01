<template>
  <div class="prod-export-task">
    <div class="search">
      <span>操作日期</span>
      <el-date-picker type="daterange" size="small" v-model="dateRange" :picker-options="pickerOptions" placeholder="选择日期范围">
      </el-date-picker>
      <el-button type="primary" size="small" class="search-btn" @click="searchHandler">搜索</el-button>
    </div>
    <el-table :data="taskData.beanList" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column prop="uploadFile" label="文件名称" :show-overflow-tooltip="true" min-width="250">
      </el-table-column>
      <el-table-column prop="createTime" label="操作时间" min-width="100">
      </el-table-column>
      <el-table-column label="操作员" min-width="100">
        <template scope="scope">
          <span v-text="operatorEnum[scope.row.createOp]"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template scope="scope">
          <span v-if="scope.row.jobStatus<=1" class="blue"><i class="iconfont icon-shalou"></i>处理中</span>
          <span v-if="scope.row.jobStatus==3" class="red"><i class="iconfont icon-guanbi"></i>处理失败</span>
          <el-button size="small" v-if="scope.row.jobStatus==2" @click="download(scope.row)">下载文件</el-button>
        </template>
      </el-table-column>
      <searchNull slot="empty"></searchNull>
    </el-table>
    <div class="foot">
      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="taskData.amount" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
// import debounce from 'lodash/debounce'
import dateFormat from 'dateFormat';
const queryProductAsyncJobsUrl = '/product/prodoffering/queryProductAsyncJobs';
export default {
  name: 'prod-export-task',
  data() {
    let aMonthAgo = new Date();
    aMonthAgo.setMonth(new Date().getMonth() - 1, new Date().getDate() + 1)
    return {
      dateRange: [aMonthAgo, new Date()],
      pageSize: 10,
      pageNumber: 1,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      loading: false,
      taskData: {
        amount: 0,
        beanList: [],
      },
      interval: '',
    }
  },
  computed: {
    operatorEnum() {
      return this.$store.state.enumSet.operatorEnum;
    },
    needPolling() {
      return this.taskData.beanList.some(n => n.jobStatus <= 1);
    },
  },
  methods: {
    searchHandler() {
      let query = {
        queryCondition: {
          jobType: 1,
        },
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
        query.queryCondition.beginCreateTime = dateFormat(this.dateRange[0], 'yyyy-mm-dd HH:MM:ss');
        query.queryCondition.endCreteTime = dateFormat(this.dateRange[1], 'yyyy-mm-dd') + ' 23:59:59';
      }
      this.loading = true;
      axios.post(queryProductAsyncJobsUrl, query).then(({data}) => {
        this.taskData = data;
        this.loading = false;
        if (this.needPolling) {
          if (this.interval) return;
          this.interval = window.setInterval(() => {
            this.searchHandler();
          }, 1000 * 10);
        } else {
          window.clearInterval(this.interval);
        }
      }).catch(err => {
        this.loading = false;
        this.$msgbox({
          title: '提示',
          message: '查询失败，' + (err.response ? err.response.data : err),
          type: 'error',
        });
      })
    },
    sizeChangeHandler(size) {
      this.pageSize = size;
      this.searchHandler();
    },
    currentChangeHandler(number) {
      this.pageNumber = number;
      this.searchHandler();
    },
    download(row) {
      window.open(row.fileUrl);
    }
  },
  activated() {
    this.searchHandler();
  },
  deactivated() {
    window.clearInterval(this.interval);
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../main.less';
.search {
  margin-bottom: @baseSpace * 3;
  > * {
    margin-right: @baseSpace * 2;
  }
  .search-btn {
    width: @baseSpace * 12;
    border-radius: 0;
  }
}
.el-table {
  margin-bottom: @baseSpace * 3;
}
.foot {
  text-align: end;
}
.iconfont {
  margin-right: @baseSpace;
}

</style>
<style lang="less">
@import '../../main.less';
.el-table .count {
  padding-right: @baseSpace*15;
  text-align: right;
} 
</style>