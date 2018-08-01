<template>
  <el-dialog :title="actionName" v-model="dialogShow" size="tiny" custom-class="orderdialog" :close-on-click-modal="false">
    <el-form v-if="action !== 'xgzbb'" :model="order" :rules="rules" ref="form" label-width="90px" label-position="left">
      <el-input v-if="action === 'jbz'" type="textarea" :rows="2" placeholder="请输入50个字以内备注信息" v-model.trim="remarksAppend" :maxlength="50">
      </el-input>
      <template v-if="action === 'xgshxx'">
        <el-form-item label="姓名" prop="receiverName">
          <el-input v-model.trim="order.receiverName">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="receiverMobile">
          <el-input v-model="order.receiverMobile">
          </el-input>
        </el-form-item>
        <el-form-item label="地址" prop="district">
          <district-select class="district" :province="order.province" :city="order.city" :district="order.district" @district-change="districtChange"></district-select>
          <el-input type="textarea" :rows="2" placeholder="详细地址" v-model.trim="order.receiverAddress">
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <el-form v-else :model="prod" ref="form" label-width="90px" label-position="left">
      <el-form-item  label="商品自编码" prop="extOuterId">
        <el-input v-model.trim="prod.outerId"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogSure">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import DistrictSelect from '../common/DistrictSelect';
export default {
  name: 'error-order-dialog',
  props: {
    action: {
      default: '',
    },
    dialog: {
      default: false,
    },
    editedOrders: {
      type: Array,
    },
    editedProds: {
      type: Array,
    },
  },
  components: {
    DistrictSelect,
  },
  data() {
    return {
      order: {
        remarks: '',
        receiverName: '',
        receiverMobile: '',
        province: '',
        city: '',
        district: '',
        receiverAddress: '',
      },
      prod: {
        outerId: '',
        extItemId: '',
      },
      remarksAppend: '',
      rules: {
        comment: {
          required: true,
          message: '请输入',
        },
        receiverName: {
          required: true,
          message: '请输入',
        },
        receiverMobile: [{
          required: true,
          message: '请输入',
        }, {
          validator(rule, value, callback) {
            if (isNaN(value) || value.length !== 11) {
              callback(new Error('请输入正确手机号'));
            } else {
              callback();
            }
          }
        }],
        province: {
          required: true,
          message: '请选择',
        },
        city: {
          required: true,
          message: '请选择',
        },
        district: {
          required: true,
          message: '请选择',
        },
        receiverAddress: {
          required: true,
          message: '请输入',
        },
      },
    }
  },
  computed: {
    actionName() {
      if (this.action === 'jbz') return '商家备注';
      if (this.action === 'xgshxx') return '修改收货信息';
      if (this.action === 'xgzbb') return '修改商品自编码';
      return '';
    },
    dialogShow: {
      get() {
        return this.dialog;
      },
      set(val) {
        if (val || !this.dialog) return;
        this.$emit('dialog-cancel');
      }
    },
    editedOrdIds() {
      return this.editedOrders.map(n => n.ordId)
    }
  },
  watch: {
    editedOrders(val) {
      for (let i in this.order) {
        this.order[i] = '';
      }
      this.remarksAppend = '';
      if (!val.length) return;
      if (val.length === 1) { // 单个订单操作复制信息
        Object.assign(this.order, val[0]);
      }
    },
    editedProds(val) {
      for (let i in this.prod) {
        this.prod[i] = '';
      }
      if (!val.length) return;
      if (val.length === 1) { // 单个订单操作复制信息
        Object.assign(this.prod, val[0]);
      }
    },
  },
  methods: {
    dialogSure() {
      let flag = 1;
      this.$refs.form.validate((valid) => {
        if (!valid) {
          flag = 0;
          return false;
        }
      });
      if (flag) {
        this.$emit('dialog-sure', this.editedOrdIds, this.order, this.remarksAppend + ' ', this.prod)
      };
    },
    dialogCancel() {
      this.$emit('dialog-cancel');
    },
    districtChange(val) {
      this.order.province = val[0];
      this.order.city = val[1];
      this.order.district = val[2];
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
</style>
<style lang="less">
@import '../../main.less';
.orderdialog {
  min-width: 420px;
  .el-dialog__body {
    padding-bottom: 10px;
    .nospace {
      margin-bottom: 0;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  .district {
    width: 100%;
    padding-bottom: 10px;
  }
  .el-select {
    width: 100%;
  }
  .instruction {
    margin-bottom: @normalSize;
    color: @lightBlack;
  }
}
</style>
