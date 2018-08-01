<template>
  <div class="account-export-task-lite" v-loading.body="loading" element-loading-text="正在获取数据...">
    <div v-for="accountExport in taskData.beanList" class="list-item">
      <div class="name">{{accountExport.fileName}}</div>
      <div>
        <span v-if="accountExport.fileStatus<=1" class="blue"><i class="iconfont icon-shalou"></i>处理中</span>
        <span v-if="accountExport.fileStatus==3" class="red"><i class="iconfont icon-guanbi"></i>处理失败</span>
        <el-button size="small" v-if="accountExport.fileStatus==2" @click="download(accountExport.dowloadUrl)">下载账单</el-button>
      </div>
    </div>
    <div class="nodata" v-if="taskData.amount==0 && !loading">暂无相关数据</div>
  </div>
</template>
<script>
import axios from 'axios';
// import debounce from 'lodash/debounce'
import dateFormat from 'dateFormat';
const queryReportFilesUrl = '/finance/report/queryReportFiles';
export default {
  name: 'account-export-task-lite',
  data() {
    let aMonthAgo = new Date();
    aMonthAgo.setMonth(new Date().getMonth() - 1, new Date().getDate() + 1)
    return {
      dateRange: [aMonthAgo, new Date()],
      pageSize: 5,
      pageNumber: 1,
      loading: false,
      taskData: {
        amount: 0,
        beanList: [],
      },
      interval: '',
    }
  },
  computed: {
    needPolling() {
      return this.taskData.beanList.some(n => n.fileStatus <= 1);
    },
  },
  methods: {
    searchHandler() {
      let query = {
        queryCondition: {
          jobType: 1,
          fileStatus: [0, 1, 2, 3],
        },
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
        query.queryCondition.beginCreateTime = dateFormat(this.dateRange[0], 'yyyy-mm-dd HH:MM:ss');
        query.queryCondition.endCreteTime = dateFormat(this.dateRange[1], 'yyyy-mm-dd') + ' 23:59:59';
      }
      this.loading = true;
      axios.post(queryReportFilesUrl, query).then(({data}) => {
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
    download(fileUrl) {
      window.open(fileUrl);
    },
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
.list-item {
  display: flex;
  align-items: center;
  padding: @baseSpace*2 @baseSpace;
  + .list-item {
    border-top: dotted 1px @borderLine;
  }
  .name {
    flex-basis: 252px;
  }
}

.iconfont {
  margin-right: @baseSpace;
}
</style>
