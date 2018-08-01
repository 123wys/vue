<template>
  <div class="financeRule">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>财务结算</el-breadcrumb-item>
      <el-breadcrumb-item>结算规则</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="rightBtn">
      <el-button v-if="activeName !== 'second'" type="text" @click="openDialog"><i
        class="icon iconfont icon-xinzeng"></i>&nbsp;<span>新增规则</span>
      </el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="执行中" name="first">
        <rule-list :btnName="'搜索规则'" :activeName="activeName" v-if="activeName === 'first'"></rule-list>
      </el-tab-pane>
      <el-tab-pane label="已作废" name="second">
        <rule-list :btnName="'搜索规则'" :activeName="activeName" v-if="activeName === 'second'"></rule-list>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="新增结算规则-选择供应商"
      size="tiny" v-model="dialogVisible" top="10%" :close-on-click-modal="false">
      <el-form :model="ruleForm" label-width="100px" label-position="left">
        <el-form-item label="供应商名称：">
          <el-select v-model="ruleForm.supplierId"
                     placeholder="选择供应商" filterable>
            <el-option
              v-for="(value, key) in $store.state.enumSet.supplierEnum"
              :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="chooseSupplier">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import RuleList from './RuleList';
  export default {
    name: 'financeRule',
    data() {
      return {
        activeName: 'first',
        dialogVisible: false,
        ruleForm: {
          supplierId: ''
        }
      }
    },
    components: {
      RuleList
    },
    methods: {
      openDialog() {
        this.dialogVisible = true;
      },
      chooseSupplier() {
        if (!this.ruleForm.supplierId) {
          this.$message.info('请选择供应商');
        } else {
          this.dialogVisible = false;
          window.sessionStorage.supplierId = this.ruleForm.supplierId;
          this.$router.push({
            path: '/financeRule/addfinanceRule',
            query: {
              supplierId: this.ruleForm.supplierId
            }
          });
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../main.less';

  .financeRule {
    color: @lightBlack;
  }
</style>
<style lang="less">
  @import '../../main.less';

  .rightBtn {
    position: absolute;
    right: 2%;
    z-index: 2;
    margin-bottom: 10px;
  }

  .financeRule .el-tabs__header {
    margin-bottom: @baseSpace *4;
  }

  .financeRule .el-form-item {
    margin-top: 22px;
  }
  .financeRule .el-dialog__title {
    font-size:14px;
  }
  .financeRule {

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
