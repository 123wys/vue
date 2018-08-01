<template>
  <div class="after-sale-entrance" v-loading="loading" element-loading-text="拼命加载中">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>售后管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建售后</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form v-model='queryCondition' label-width="60px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="单号">
            <el-input v-model.trim="queryCondition.mix" size="small" @keyup.enter.native="queryHandler" placeholder="商城单号|系统单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件人">
            <el-input v-model.trim="queryCondition.receiverName" size="small" @keyup.enter.native="queryHandler" placeholder="收件人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号">
            <el-input v-model.trim="queryCondition.receiverMobile" size="small" @keyup.enter.native="queryHandler" placeholder="手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small" @click="queryHandler">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- <div v-if="searchedFlag"> -->
      <entrance-list :order-data="orderData" :searched-flag="searchedFlag" @research="queryHandler"></entrance-list>
    <!-- </div> -->
    <div v-if="searchedFlag">
      <div class="foot">
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize" :total="orderData.amount" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import EntranceList from './EntranceList'
import axios from 'axios'
const queryOrderUrl = '/order/order/queryOrderSimple'
export default {
  name: 'after-sale-entrance',
  data() {
    return {
      orderData: {
        amount: 0,
        beanList: [],
      },
      queryCondition: {
        mix: '',
        receiverName: '',
        receiverMobile: '',
      },
      pageSize: 10,
      pageNumber: 1,
      loading: false,
      searchedFlag: false,
    };
  },
  methods: {
    queryHandler() {
      if (!Object.values(this.queryCondition).some(n => n)) {
        this.$message.error('请输入查询条件！');
        return;
      };
      this.loading = true;
      let query = {
        queryCondition: this.queryCondition,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      }
      axios.post(queryOrderUrl, query).then(res => {
        this.loading = false;
        this.orderData = res.data;
        this.searchedFlag = true;
      }).catch((err) => {
        this.loading = false;
        this.$msgbox({
          message: '操作失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    sizeChangeHandler(size) {
      this.pageSize = size;
      this.queryHandler();
    },
    currentChangeHandler(number) {
      this.pageNumber = number;
      this.queryHandler();
    },
  },
  watch: {},
  components: {
    EntranceList,
  },
  mounted() {},
  activated() {
    if (this.searchedFlag && this.mix && this.orderData.beanList.length) {
      this.queryHandler();
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.after-sale-entrance {
  padding: @baseSpace*3;
  .el-form-item {
    margin-bottom: @baseSpace*2;
    .el-input {
      font-size: 12px;
    }
  }
}

.search {
  width: 380px;
  margin: @baseSize*2 0 @baseSize*4;
  font-size: 12px;
}

.foot {
  text-align: end;
}

.none {
  display: none;
}
</style>
<style lang="less">
@import '../../main.less';
.after-sale-entrance {
  .el-input-group__append {
    width: 85px;
    background-color: @borderLine;
    border-color: @borderLine;
    color: @lightBlack;
    text-align: center;
    .el-button {
      width: 85px;
      padding: 0;
      height: 30px;
    }
  }
}
</style>
