<template>
  <el-dialog :title="title" v-model="dialog" size="tiny" :close-on-click-modal="false" @close="dialogClose">
    <span v-if="['qrdz', 'qrjs'].includes(action)">确定后，该对账单将流转到“<span class="colorFee">{{status < 3 ? '待结算' : '已结算'}}</span>”模块</span>
    <div class="msg" v-if="action === 'pltd'">
      <div>已选<span class="blue" v-text="actionNum"></span>个供应商</div>
    </div>
    <el-form :model="pltdForm" ref="pltdForm" :rules="rules1" v-if="action === 'pltd'">
      <el-form-item prop="invoiceNum">
        <el-input type="text" placeholder="请填写发票号" v-model="pltdForm.invoiceNum"></el-input>
      </el-form-item>
    </el-form>
    <el-form :model="txbzForm" ref="txbzForm" :rules="rules2" v-if="action === 'txbz'">
      <el-form-item prop="note">
        <el-input type="textarea" :row="3" placeholder="请输入账单相关备注" v-model.trim="txbzForm.note"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogCancle">取 消</el-button>
      <el-button type="primary" @click="dialogSure">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'finance-dialog',
  props: {
    action: {
      default: '',
    },
    dialog: {
      default: false,
    },
    actionNum: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      pltdForm: {
        invoiceNum: '',
      },
      txbzForm: {
        note: ''
      },
      rules1: {
        invoiceNum: [{
          required: true,
          message: '请输入发票号',
          trigger: 'submit',
        }],
      },
      rules2: {
        note: [{
          required: true,
          message: '请输入相关内容',
          trigger: 'submit',
        }]
      },
    }
  },
  computed: {
    title() {
      let title = '';
      switch (this.action) {
        case 'qrdz':
          title = '确认对账已完成？';
          break;
        case 'qrjs':
          title = '确认已核实？';
          break;
        case 'pltd':
          title = '批量填写发票号';
          break;
        case 'txbz':
          title = '备注';
          break;
      }
      return title;
    }
  },
  methods: {
    status() {
      return this.action === 'qrdz' ? 1 : 3;
    },
    dialogCancle() {
      this.$emit('cancel');
    },
    dialogSure() {
      if (this.action === 'txbz') {
        this.$refs.txbzForm.validate(valid => {
          if (valid) {
            this.$emit('sure', this.txbzForm.note, this.action);
          }
        })
      } else if (this.action === 'qrjs' || this.action === 'qrdz') {
        this.$emit('sure')
      } else {
        this.$refs.pltdForm.validate(valid => {
          if (valid) {
            this.$emit('sure', this.pltdForm.invoiceNum, this.action);
          }
        })
      }
    },
    dialogClose() {
      this.pltdForm.invoiceNum = '';
      this.txbzForm.note = '';
    },
  }
}
</script>
<style lang="less" scoped>
@import '../../main.less';
.colorFee {
  color: @warningYellow;
}

.blue {
  color: @primaryBlue;
  font-size: 14px;
}

.msg {
  padding-bottom: @baseSpace*4;
}
</style>
