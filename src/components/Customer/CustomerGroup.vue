<template>
  <div class="customerGroup">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户分组</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search">
      <div class="search-one">
        <el-input v-model.trim="groupName" placeholder="分组名称关键字" class='search-input' size='small' style='width:288px'></el-input>
        <el-button type="primary" size='small' class='search-btn' @click='queryCustomerGroup'>搜索分组</el-button>
      </div>
      <el-button type="text" size='small' @click='createGroup'><span class="icon iconfont icon-xinzeng"></span>新增分组</el-button>
    </div>
    <div class="head">
      <div class="list-head">
        <div class="group-name">分组名称</div>
        <div class="customer-count">客户数</div>
        <div class="group-rule">分组规则</div>
        <div class="action">操作</div>
      </div>
      <div class="list-action">
        <!-- <el-checkbox class="select-all" v-model="isSelectAll">全选</el-checkbox>
        <div class="batch">
          <el-button size="small" @click='MultiDel'>批量删除</el-button>
        </div> -->
        <div class="check">
        </div>
        <paging :page-size="pageSize" :page-number="pageNumber" :total='groupData.amount' @current-change="currentChangeHandler"></paging>
      </div>
    </div>
    <template v-if='groupData.beanList.length'>
      <div class="contain-box" v-loading="loading" element-loading-text="拼命加载中">
        <GroupItem v-for='(item, index) in groupData.beanList' :group='item'>
          <template v-if='item.customerSpec.specName !== "新客户" && item.customerSpec.specName !== "老客户"'>
          <!-- <el-checkbox style='margin-right:7px;' v-model='selection[index]'></el-checkbox> -->
          <el-button size='mini' slot='edit' @click='updateGroup(item)'>编辑</el-button>
          <el-button size='mini' slot='delete' @click='delGroup(item)'>删除</el-button>
          </template>
          <template v-else>
            <!-- <el-checkbox style='margin-right:7px;' v-model='selection[index]' disabled></el-checkbox> -->
          <el-button size='mini' slot='edit' disabled>编辑</el-button>
          <el-button size='mini' slot='delete' disabled>删除</el-button>
        </template>
        </GroupItem>
      </div>
    </template>
    <div v-else class="nullstyle">
      <searchNull class="margin-t80" style="padding-top:60px;"></searchNull>
    </div>
    <div class="foot">
      <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="pageNumber" :page-sizes="[20, 50, 100]" :page-size="pageSize" :total="groupData.amount" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Paging from '../common/Paging'
import GroupItem from './GroupItem'
import Pagination from '../common/Pagination'
export default {
  name: 'customerGroup',
  data() {
    return {
      groupName: '',
      selection: [],
      loading: false,
      groupData: {
        amount: 0,
        beanList: []
      },
      pageSize: 20,
      pageNumber: 1,
      queryCondition: {}
    }
  },
  components: {
    Paging,
    GroupItem,
    Pagination
  },
  watch: {
    groupData: {
      handler(val) {
        this.selection = new Array(val.beanList.length).fill(false);
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  activated() {
    this.queryCustomerGroup();
  },
  computed: {
    //  批量删除数组ID
    selectIds() {
      return this.groupData.beanList.filter((n, i) => this.selection[i]).map(n => n.customerSpec.specId);
    },
    isSelectAll: {
      get() {
        return this.groupData.amount ? this.selection.every(n => n) : false;
      },
      set(val) {
        this.selection = new Array(this.groupData.beanList.length).fill(val);
      }
    },
  },
  methods: {
    //  新增分组
    createGroup() {
      this.$router.push({
        path: '/createGroup',
        query: {
          type: 0
        }
      })
    },
    //  修改分组
    updateGroup(msg) {
      // console.log(msg);
      window.sessionStorage.group = JSON.stringify(msg);
      this.$router.push({
        path: '/createGroup',
        query: {
          type: 1
        }
      })
    },
    //  删除分组
    delGroup(item) {
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          specIds: [item.customerSpec.specId]
        };
        this.axios.post('/customer/customer/removeCustomerSpec', data).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.queryCustomerGroup();
        }).catch(error => {
          this.$message.error(error.response.data);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //  批量删除
    MultiDel() {
      if (!this.selectIds.length) {
        this.$message({
          message: '请至少选择一个分组',
          type: 'warning'
        });
        return false;
      }
      var data = {
        specIds: this.selectIds
      };
      this.axios.post('/customer/customer/removeCustomerSpec', data).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        });
        this.queryCustomerGroup();
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    //  查询客户分组
    queryCustomerGroup() {
      var data = {
        queryCondition: {
          groupName: this.groupName
        },
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      }
      this.loading = true;
      this.axios.post('/customer/customer/queryCustomerGroup', data).then(res => {
        this.groupData = res.data;
        this.loading = false;
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    currentChangeHandler(args) {
      if (this.pageNumber === args) return;
      this.pageNumber = args;
      this.queryCustomerGroup();
    },
    sizeChangeHandler(args) {
      if (this.pageSize === args) return;
      // console.log(args);
      this.pageSize = args;
      this.queryCustomerGroup();
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.customerGroup {
  color: @lightBlack;
  padding: @normalSize;
}

.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 15px 0 15px 0;
  .search-one {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .search-btn {
    border-color: @Gary;
    border-left: none;
    background-color: @Gary;
    color: @neutralGary;
    width: 76px;
    height: 30px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.head {
  line-height: 20px;
  border: solid 1px @borderLine;
  margin-bottom: 10px;
}

.list-head {
  background-color: #eff2f7;
  display: flex;
  font-size: 14px;
  padding: @normalSize;
  .group-name {
    text-align: left;
    flex-basis: 24%;
  }
  .customer-count {
    box-sizing: border-box;
    padding-right: 80px;
    text-align: right;
    flex-basis: 13%;
  }
  .group-rule {
    flex-basis: 40%;
  }
  .action {
    text-align: right;
    flex-basis: 23%;
  }
}

.list-action {
  padding: @smallSize - 5px 0;
  display: flex;
  /*justify-content: space-between;*/
  align-items: baseline;
  .select-all,
  .batch,
  .paging {
    padding: 0 @baseSpace * 2;
  }
  .check {
    flex-grow: 1;
    margin-left: @baseSpace * 2;
  }
}

.contain-box {
  border-bottom: 1px solid @borderLine;
}

.foot {
  text-align: end;
  padding: @smallSize;
}

.nullstyle {
  height: 420px;
  border: solid 1px @borderLine;
}

.icon-xinzeng{
  margin-right: 5px;
  color: @neutralGary;
}
</style>
<style lang="less">
@import '../../main.less';
.customerGroup input {
  border-color: @Gary;
}

.customerGroup .search .el-input__inner {
  font-size: 12px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
