<template>
  <div class="addRole" v-loading="loading">
    <div class="form">
      <el-form :model="roleForm" :rules="rules" label-width="100px" ref="roleForm">
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="输入角色名称"
                    @keyup.enter.native="submitForm('roleForm')" autofocus></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('roleForm')">保存</el-button>
          <el-button @click="cancel">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  let insertSysRole = '/sysmgnt/role/insertSysRole'
  let updateSysRole = '/sysmgnt/role/updateSysRole'
  export default{
    props: ['roleHouse'],
    data() {
      //     角色名验证
      let roleCheck = function (rule, value, callback) {
        if (!value || !value.trim()) {
          return callback(new Error('角色名不能为空'));
        }
        let query = {
          queryCondition: {
            roleName: value,
          },
          pageSize: 10,
          pageNumber: 1
        }
        axios.post('/sysmgnt/role/selectSysRoles', query)
          .then(res => {
            if (res.data.amount) {
              let result = res.data.beanList.some(n => {
                return n.roleName === value
              })
              if (result) return callback(new Error('该角色已存在'));
              return callback();
            } else {
              return callback();
            }
          })
      };
      return {
        loading: false,
        editMode: 0,
        roleForm: {
          roleName: '',
          roleId: ''
        },
        rules: {
          roleName: [
            {require: true},
            {validator: roleCheck, trigger: 'formSubmit'}
          ]
        }
      }
    },
    watch: {
      roleHouse: {
        handler(val) {
          var a = JSON.stringify(val);
          var b = JSON.parse(a);
          this.roleForm = b;
        },
        immediate: true,
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              roleName: this.roleForm.roleName
            };
            let query = {
              roleId: this.roleForm.roleId,
              roleName: this.roleForm.roleName
            }
            this.loading = true;
            if (!this.roleForm.roleId) {
              axios.post(insertSysRole, data).then(response => {
                this.loading = false;
                if (response.data) {
                  this.$message({
                    message: '添加角色成功！',
                    type: 'success',
                    duration: 500
                  });
                  this.$store.dispatch('setAllRoleIds');
                  this.$emit('success');
                }
              }).catch(err => {
                this.loading = false;
                this.$msgbox({
                  message: '操作失败，' + (err.response ? err.response.data : err),
                  type: 'error',
                })
              })
            } else {
              axios.post(updateSysRole, query).then(response => {
                this.loading = false;
                if (response.data) {
                  this.$message({
                    message: '修改角色成功！',
                    type: 'success',
                    duration: 500
                  });
                  this.$store.dispatch('setAllRoleIds');
                  this.$emit('success');
                }
              }).catch(err => {
                this.loading = false;
                this.$msgbox({
                  message: '操作失败，' + (err.response ? err.response.data : err),
                  type: 'error',
                })
              })
            }
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      cancel() {
        this.$emit('close');
      }
    }
  }
</script>

<style lang="less">
  @import '../../main.less';

  .addRole {

  .form {
    width: 480px;
    margin: @normalSize;
    position: relative;
  }

  }
</style>
