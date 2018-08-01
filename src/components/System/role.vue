<template>
  <div class="user">
    <!-- <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===1">新增角色</el-breadcrumb-item>
      <el-breadcrumb-item v-if="editMode===2">修改角色</el-breadcrumb-item>
    </el-breadcrumb> -->
    <transition name="slide" mode="out-in">
      <div v-if="editMode===0">
        <el-row style="margin-top: 10px;">
          <el-col :span="14" class="searchRole">
            <el-input size="small" placeholder="输入角色名" v-model="name" @keyup.enter.native="searchRole">
              <div slot="append" @click="searchRole" style="cursor: pointer;">搜索角色</div>
            </el-input>
          </el-col>
          <el-col :span="10" style="text-align: right;">
            <div>
              <el-button type="text" @click="add">
                <svg class="icon top-icon" aria-hidden="true">
                  <use xlink:href="#icon-cangku"></use>
                </svg>
                新增角色
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table
              :data="tableData"
              v-loading="loading" element-loading-text="拼命加载中" style="width: 100%">
              <div slot="empty">
                <searchNull text='您还没有创建角色哦'></searchNull>
              </div>
              <el-table-column
                prop="sysRole.roleName"
                label="角色名"
                width="120">
              </el-table-column>
              <el-table-column
                label="权限描述">
                <template scope="scope">
                  <span v-text="menuList(scope.row.sysRole.privilegeIds)"></span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="230">
                <template scope="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="roleAuthorization(scope.row.sysRole)">选择权限
                  </el-button>
                  <el-button
                    size="small"
                    @click.native.prevent="roleUpdate(scope.row.sysRole)">编辑
                  </el-button>
                  <el-button
                    size="small"
                    @click="removeRole(scope.row.sysRole.roleId)">删除
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
      <add-role :roleHouse="edited" @success="success" @close="close" v-if="editMode!=0"></add-role>
    </transition>
    <!--对话框-->
    <el-dialog title="删除角色" v-model="dialogVisible" size="tiny">
      <i class="el-icon-warning"></i>&nbsp;&nbsp;<span>该角色可能已被用户使用，确定删除？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm">确 定</el-button>
  </span>
    </el-dialog>
    <!--选择权限-->
    <el-dialog title="授权" v-model="dialog" size="tiny" style="overflow: hidden;">
      <div style="height: 300px;overflow: auto;">
        <el-tree
          :data="dataList"
          show-checkbox
          default-expand-all
          node-key="privId"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialog = false">取 消</el-button>
    <el-button type="primary" @click="authSure">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import AddRole from './roleEdit.vue'
  import axios from 'axios'
  let blank = {
    roleId: '',
    roleName: ''
  }
  export default{
    components: {
      AddRole
    },
    data() {
      return {
        roleId: '',
        oldArr: [],
        checkedArr: [],
        name: '',
        dialogVisible: false,
        dialog: false,
        loading: false,
        dataList: [],
        defaultProps: {
          children: '',
          label: ''
        },
        edited: blank,
        editMode: 0,
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        multipleSelection: [],
        checked: [],
        id: ''
      }
    },
    methods: {
      menuList(item) {
        let arr = [];
        if (!item) {
          return;
        }
        for (var i = 0; i < this.dataList.length; i++) {
          for (var j = 0; j < item.length; j++) {
            if (item[j] === this.dataList[i].privId) {
              arr.push(this.dataList[i].privName);
            }
            if (this.dataList[i].children.length) {
              for (var x = 0; x < this.dataList[i].children.length; x++) {
                if (item[j] === this.dataList[i].children[x].privId) {
                  arr.push(this.dataList[i].children[x].privName);
                }
              }
            }
          }
        }
        return arr.join('、');
      },
//        获得角色列表
      getRoles() {
        var _self = this;
        _self.loading = true;
        let query = {
          queryCondition: {},
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        };
        axios.post('/sysmgnt/role/selectSysRoleWithPrivilege', query).then(response => {
          _self.total = response.data.amount;
          _self.tableData = response.data.beanList;
          _self.loading = false;
        }).catch(err => {
          _self.loading = false;
          _self.$msgbox({
            message: '获取角色列表失败，' + (err.response ? err.response.data : err),
            type: 'error',
          });
        })
      },
//      查询角色
      searchRole() {
        var _self = this;
        _self.loading = true;
        let query = {
          queryCondition: {
            roleName: this.name
          },
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        }
        axios.post('/sysmgnt/role/selectSysRoleWithPrivilege', query).then(res => {
          _self.total = res.data.amount;
          _self.tableData = res.data.beanList;
          _self.loading = false;
        }).catch(err => {
          _self.loading = false;
          _self.$msgbox({
            message: '查询失败，' + (err.response ? err.response.data : err),
            type: 'error',
          });
        })
      },
//      获取权限列表
      getMenus() {
        let query = {
          pageNumber: 1,
          pageSize: 1000
        }
        axios.post('/sysmgnt/privilege/selectSysPrivileges', query).then(res => {
          this.dataList = res.data;
          this.defaultProps = {
            children: 'children',
            label: 'privName'
          }
        })
      },
//      角色授权权限
      roleAuthorization(item) {
        this.dialog = true;
        this.roleId = item.roleId;
        this.oldArr = item.privilegeIds;
        if (!item.privilegeIds) {
          this.checkedArr = [];
        } else {
          this.checkedArr = JSON.parse(JSON.stringify(item.privilegeIds));
        }
        setTimeout(() => {
          this.$refs.tree.setCheckedKeys(this.checkedArr);
        }, 50)
      },
//      确定角色授权
      authSure() {
        let query = {
          roleId: this.roleId,
          privIds: this.$refs.tree.getCheckedKeys(),
          oldPrivIds: this.oldArr
        }
        axios.post('/sysmgnt/rolePrivilege/grantedPrivilege2Role', query).then(response => {
          if (response.data) {
            this.dialog = false;
            this.getRoles();
            this.$message({
              message: '授权成功！',
              type: 'success',
              duration: 500
            });
          }
        }).catch(err => {
          this.loading = false;
          this.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      },
//      删除角色
      removeRole(roleId) {
        this.dialogVisible = true;
        this.id = roleId;
      },
//      确定删除角色
      confirm() {
        this.dialogVisible = false;
//        for (let i = 0; i < this.userList.length; i++) {
//          for (let j = 0; j < this.userList[i].roleIds.length; j++) {
//            if (this.id === this.userList[i].roleIds[j]) {
//              this.$msgbox({
//                message: '该角色已被用户绑定，不能删除',
//                type: 'error',
//              });
//              return;
//            }
//          }
//        }
        let data = {
          roleIds: [this.id]
        }
        axios.post('/sysmgnt/role/removeSysRole', data).then(response => {
          if (response.data) {
            this.$message({
              message: '删除角色成功！',
              type: 'success',
              duration: 500
            });
          }
          this.$store.dispatch('setAllRoleIds');
          this.getRoles();
        }).catch(err => {
          this.loading = false;
          this.$msgbox({
            message: '操作失败，' + (err.response ? err.response.data : err),
            type: 'error',
          })
        })
      },
//    分页尺寸变化
      handleSizeChange(val) {
        this.pageSize = val;
        this.getRoles();
      },
      //  当前页
      handleCurrentChange(val) {
        this.pageNumber = val;
        this.getRoles();
      },
      add() {
        this.edited = blank;
        this.editMode = 1;
      },
      roleUpdate(row) {
        this.edited = row;
        this.editMode = 2;
      },
      close() {
        this.editMode = 0;
      },
      success() {
        this.editMode = 0;
        this.getRoles();
      },
    },
    mounted() {
      this.getRoles();
      this.getMenus();
    },
    activated() {
      this.editMode = 0;
      this.getRoles();
      this.getMenus();
    }
  }
</script>

<style lang="less">
@import '../../main.less';
.user {
  padding: 0px;
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
.searchRole {
  margin-bottom: @baseSize *4;
}
</style>
<style lang='less'>
  @import '../../main.less';

  .searchRole {
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
