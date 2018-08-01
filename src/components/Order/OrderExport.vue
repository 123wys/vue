<template>
  <div class="export">
    <el-breadcrumb separator="/" style="margin:20px 0;">
      <span style="float:left;margin-right: 10px;">当前位置 : </span>
      <el-breadcrumb-item>导出订单</el-breadcrumb-item>
    </el-breadcrumb>
    <div v-if="searchFlag">
      <div v-if="had">
        <div v-loading="loading" element-loading-text="正在导出，请稍等..." class="loading" v-if="search">
          <div class="table" v-for="item in beanList">
            <div class="content">
              <ul>
                <li class="content_title">导出操作时间: <span v-text="item.createTime"></span></li>
                <li>完成时间: <span v-text="item.doneTime"></span></li>
                <li>订单状态: {{item.jobStatus | datafmt}}</li>
              </ul>
            </div>
            <div class="btn_body">
              <el-button type="primary" class="btn" @click="download(item.fileUrl)">下载订单报表</el-button>
            </div>
          </div>
        </div>
        <div class="table" v-for="item in history">
          <div class="content">
            <ul>
              <li class="content_title">导出操作时间: <span v-text="item.createTime"></span></li>
              <li>完成时间: <span v-text="item.doneTime"></span></li>
              <li>订单状态: {{item.jobStatus | datafmt}}</li>
            </ul>
          </div>
          <div class="btn_body">
            <el-button type="primary" class="btn" @click="download(item.fileUrl)">下载订单报表</el-button>
          </div>
        </div>
      </div>
      <div class="had" v-else>
        <span>暂无导出记录</span>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'order-export',
  data() {
    return {
      loading: false,
      search: false,
      beanList: [],
      history: [],
      searchFlag: false,
    }
  },
  computed: {
    had() {
      return this.beanList.length || this.history.length;
    }
  },
  methods: {
    download: function(val) {
      window.open(val)
    },
    queryResult() {
      let query = {
        queryCondition: {
          jobType: 1
        },
        pageNumber: 1,
        pageSize: 1
      }
      axios.post('/order/order/queryAsyncJobs', query)
        .then(res => {
          this.beanList = res.data.beanList;
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          })
        })
    },
    queryHistory() {
      let query = {
        queryCondition: {
          jobType: 1,
          jobStatus: 2,
        },
        pageNumber: 1,
        pageSize: 10
      }
      axios.post('/order/order/queryAsyncJobs', query)
        .then(res => {
          this.history = res.data.beanList;
          this.searchFlag = true;
        })
        .catch(err => {
          this.$message.error({
            message: err.response ? err.response.data : err
          })
          this.searchFlag = true;
        })
    },
    polling() {
      this.search = true;
      this.loading = true;
      let interval = window.setInterval(() => {
        this.queryResult();
        let result = this.beanList.every(ele => {
          if ([2, 3].includes(ele.jobStatus)) return true
          return false
        })
        if (result) {
          clearInterval(interval)
          this.loading = false;
        }
      }, 10000)
    },
  },
  activated() {
    this.queryHistory();
    console.log(this.$route.query.query);
    if (this.$route.query.query === '1') {
      console.log('polling');
      this.polling();
    }
  },
  filters: {
    datafmt: function(val) {
      let state = '';
      switch (val) {
        case 0:
          state = '待处理';
          break;
        case 1:
          state = '处理中';
          break;
        case 2:
          state = '处理成功';
          break;
        case 3:
          state = '处理失败';
          break;
        case 4:
          state = '作废';
          break;
      }
      return state;
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.export {
  padding: 0 @largeSize;
  .loading {
    margin: 0 auto;
    width: 781px;
    height: 182px;
    margin-bottom: 15px;
  }
  .table {
    width: 781px;
    margin: 0 auto @baseSpace * 3;
    border: 1px solid @borderLine;
  }
  .content {
    height: 110px;
    background-color: #E8F5FF;
    overflow: hidden;
  }
  .btn_body {
    height: 70px;
    border-top: 1px solid @borderLine;
    .btn {
      margin: @baseSpace * 3;
    }
  }
  ul {
    list-style: none;
    padding-left: @largeSize;
    margin: 0;
    font-size: 14px;
    .content_title {
      margin: @baseSpace * 4 0;
      font-weight: bold;
    }
  }
  .had {
    text-align: center;
    font-size: 18px;
  }
}
</style>
