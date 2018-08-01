<template>
  <div class="batch-deliver-task-lite" v-loading.body="loading" element-loading-text="正在获取数据...">
    <div v-for="deliver in taskData.beanList" class="list-item">
      <div class="createtime">操作时间：{{deliver.createTime}}
        <div class="file"><i class="iconfont icon-xlxs01-copy"></i> {{deliver.uploadFile}}
        </div>
        <div :class="statusType(deliver.jobStatus)" class="type">
          {{statusLabel(deliver.jobStatus)}}
        </div>
        <div class="oneline" :title="deliver.jobMemo" v-text="deliver.jobMemo"></div>
      </div>
    </div>
    <div class="nodata" v-if="taskData.amount==0 && !loading">暂无相关数据</div>
  </div>
</template>
<script>
import axios from 'axios';
// import debounce from 'lodash/debounce'
import dateFormat from 'dateFormat';
const queryAsyncJobsUrl = '/order/order/queryAsyncJobs';
export default {
  name: 'batch-deliver-task-lite',
  data() {
    let aMonthAgo = new Date();
    aMonthAgo.setMonth(new Date().getMonth() - 1, new Date().getDate() + 1)
    return {
      dateRange: [aMonthAgo, new Date()],
      pageSize: 3,
      pageNumber: 1,
      loading: false,
      taskData: {
        amount: 0,
        beanList: [],
      },
      interval: '',
      jobStatus: {
        0: {
          label: '发货中',
          type: 'blue',
        },
        1: {
          label: '发货中',
          type: 'blue',
        },
        2: {
          label: '发货完成',
          type: 'gray',
        },
        3: {
          label: '发货失败',
          type: 'red'
        },
        4: {
          label: '作废',
          type: ''
        },

      }
    }
  },
  computed: {
    needPolling() {
      return this.taskData.beanList.some(n => n.jobStatus <= 1);
    },
  },
  methods: {
    searchHandler() {
      let query = {
        queryCondition: {
          jobType: 2,
        },
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      if (this.dateRange && this.dateRange[0] && this.dateRange[1]) {
        query.queryCondition.beginCreateTime = dateFormat(this.dateRange[0], 'yyyy-mm-dd HH:MM:ss');
        query.queryCondition.endCreteTime = dateFormat(this.dateRange[1], 'yyyy-mm-dd') + ' 23:59:59';
      }
      this.loading = true;
      axios.post(queryAsyncJobsUrl, query).then(({
        data
      }) => {
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
    statusLabel(status) {
      return this.jobStatus[parseInt(status)].label;
    },
    statusType(status) {
      return this.jobStatus[parseInt(status)].type;
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
  justify-content: space-between;
  padding: @baseSpace*2 @baseSpace;
  + .list-item {
    border-top: dotted 1px @borderLine;
  }
}

.file {
  margin-top: @baseSpace;
}

.type {
  margin-left: @baseSpace*5;
}

.iconfont {
  margin-right: @baseSpace;
}

.oneline {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 320px;
}
</style>
