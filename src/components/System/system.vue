<template>
  <div class="system">
    <!-- <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===1">新增用户</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===2">修改用户</el-breadcrumb-item>
    </el-breadcrumb> -->
    <transition name="slide" mode="out-in">
      <div v-if="editMode===0">
        <el-row style="margin-top: 10px;">
          <el-col :span="14" class="UserSearch">
            <el-input size="small" placeholder="输入昵称" v-model="name" @keyup.enter.native="searchInfo">
              <div slot="append" @click="searchInfo" style="cursor: pointer;">搜索用户</div>
            </el-input>
          </el-col>
          <el-col :span="10" style="text-align: right;">
            <div>
              <el-button type="text" @click="add">
                <svg class="icon top-icon" aria-hidden="true">
                  <use xlink:href="#icon-cangku"></use>
                </svg>
                新增用户
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
              <div slot="empty">
                <searchNull text='您还没有创建用户哦'></searchNull>
              </div>
              <el-table-column prop="opName" label="昵称" width="180">
              </el-table-column>
              <el-table-column prop="mobile" label="手机号" width="180">
              </el-table-column>
              <el-table-column label="角色">
                <template scope="scope">
                  <span v-for="item in scope.row.roleIds" v-text="mapName(item)"></span>
                  <span v-if="scope.row.isAdmin===1">
                    系统级管理员
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template scope="scope">
                  <el-button size="small"
                             :disabled="scope.row.isAdmin===1 ? true:false"
                             @click.native.prevent="userUpdate(scope.row)">编辑
                  </el-button>
                  <el-button size="small"
                             :disabled="scope.row.isAdmin===1 || scope.row.loginName===account ? true:false"
                             @click="removeRole(scope.row.opId)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" style="text-align: right;margin-top: 15px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="pageNumber" :page-sizes="[10, 20, 50]" :page-size="pageSize"
                           class='pagination' layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </div>
      <set-user :userHouse="edited" :mode="editMode" @success="success" @close="close" v-if="editMode!=0"></set-user>
    </transition>
    <!--对话框-->
    <el-dialog title="删除用户" v-model="dialogVisible" size="tiny">
      <i class="el-icon-warning"></i>&nbsp;&nbsp;<span>您确定删除该用户</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import SetUser from './userEdit.vue'
  import axios from 'axios'
  let blank = {
    opName: '',
    email: '',
    opId: '',
    mobile: '',
    roleIds: [],
    isAdmin: ''
  }
  export default {
    name: 'system',
    components: {
      SetUser,
    },
    data() {
      return {
        dialogVisible: false,
        name: '',
        UserId: '',
        edited: blank,
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        editMode: 0,
        loading: false,
        tableData: [],
        account: ''
      }
    },
    methods: {
      mapName(roleId) {
        return this.$store.state.enumSet.operationRoleds[roleId + ''] + ' ';
      },
      getUsers() {
        var _self = this;
        _self.loading = true;
        let query = {
          queryCondition: {},
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        axios.post('/sysmgnt/operator/selectSysOperatorWithRole', query).then(response => {
          _self.total = response.data.amount;
          _self.tableData = response.data.beanList;
          _self.loading = false;
        }).catch(err => {
          _self.loading = false;
          _self.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          });
        })
      },
//      查询
      searchInfo() {
        var _self = this;
        _self.loading = true;
        let query = {
          queryCondition: {
            opName: this.name
          },
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        }
        axios.post('/sysmgnt/operator/selectSysOperatorWithRole', query).then(response => {
          _self.total = response.data.amount;
          _self.tableData = response.data.beanList;
          _self.loading = false;
        }).catch(err => {
          _self.loading = false;
          _self.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          });
        })
      },
      //  分页尺寸变化
      handleSizeChange(val) {
        this.pageSize = val;
        this.getUsers();
      },
      //  当前页
      handleCurrentChange(val) {
        this.pageNumber = val;
        this.getUsers();
      },
      //      删除工号
      removeRole(opId) {
        this.dialogVisible = true;
        this.UserId = opId;
      },
      //      确定删除工号
      confirm() {
        this.dialogVisible = false;
        let data = {
          opId: this.UserId,
          remarks: ''
        }
        axios.post('/sysmgnt/operator/removeOperator', data).then(response => {
          if (response.data) {
            this.$message({
              message: '删除工号成功！',
              type: 'success',
              duration: 500
            });
            this.getUsers();
          }
        }).catch(err => {
          this.loading = false;
          this.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      },
//      新增工号
      add() {
        this.edited = blank;
        this.editMode = 1;
      },
//      修改工号
      userUpdate(row) {
        this.edited = row;
        this.editMode = 2;
      },
      close() {
        this.editMode = 0;
      },
      success() {
        this.editMode = 0;
        this.getUsers();
      },
    },
    created() {
      this.account = window.localStorage.loginName;
    },
    mounted() {
      this.getUsers();
    },
    activated() {
      this.editMode = 0;
      this.getUsers();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../main.less';

  .system {

  .el-icon-warning {
    color: @warningYellow;
    font-size: 20px;
    vertical-align: middle;
  }

  }
  .top-icon {
    margin-right: 5px;
    font-size: 15px;
    color: @lightBlack;
  }

  .UserSearch {
    margin-bottom: @baseSize *4;
  }
</style>
<style lang='less'>
  @import '../../main.less';

  .UserSearch {

  .el-input {
    width: 270px;

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
  input {
    height: 30px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-color: @borderLine;
  }

  }
  }

</style>
