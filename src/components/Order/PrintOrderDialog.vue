<template>
  <el-dialog title="打印发货单" v-model="dialogShow" custom-class="orderdialog">
    <el-form :model="printForm" ref="printForm" label-width="90px" label-position="left" class="printForm" v-if="makeSure">
      <el-form-item label="选择打印机">
        <el-select v-model="printer">
          <el-option v-for="(key, value) in lodopPrinter" :key="key" :value="value" :label="key"></el-option>
        </el-select>
      </el-form-item>
      <el-popover
        ref="popover1"
        width="350"
        trigger="hover">
        <img src="http://frontfile.oss-cn-hangzhou.aliyuncs.com/dang/p3.jpg" alt="a4">
      </el-popover>
      <el-popover
        ref="popover2"
        width="350"
        trigger="hover">
        <img src="http://frontfile.oss-cn-hangzhou.aliyuncs.com/dang/p1.jpg" alt="a5">
      </el-popover>
      <el-popover
        ref="popover3"
        width="350"
        trigger="hover">
        <img src="http://frontfile.oss-cn-hangzhou.aliyuncs.com/dang/p2.jpg" alt="热敏小票">
      </el-popover>
      <el-form-item label="出货单类型" prop="printType">
        <el-radio-group v-model="printForm.printType">
          <el-radio label="a4" v-popover:popover1>A4纸
            <div class="innerImg"><img src="http://frontfile.oss-cn-hangzhou.aliyuncs.com/dang/p3.jpg" alt="a4"></div>
          </el-radio>
          <el-radio label="a5" v-popover:popover2>A5纸
            <div class="innerImg"><img src="http://frontfile.oss-cn-hangzhou.aliyuncs.com/dang/p1.jpg" alt="a5"></div>
          </el-radio>
          <el-radio label="elec" v-popover:popover3>热敏小票
            <div class="innerImg"><img src="http://frontfile.oss-cn-hangzhou.aliyuncs.com/dang/p2.jpg" alt="热敏小票"></div>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="printConfirm(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="printConfirm(true, printForm, printer)">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import getLodop from '../../LodopFuncs.js';
// import {
//   getPrinters
// } from '../../assets/printWebSocket.js';
export default {
  name: 'print-order-dialog',
  data() {
    return {
      makeSure: false,
      dialogShow: false,
      printForm: {
        printType: 'a4',
      },
      printer: '',
    };
  },
  computed: {
    lodopPrinter() {
      let options = {};
      let lodop = getLodop();
      let len = lodop.GET_PRINTER_COUNT();
      for (let i = 0; i < len; i++) {
        options[i] = lodop.GET_PRINTER_NAME(i);
      }
      return options;
    },
  },
  methods: {
    printConfirm(...args) {
      // getPrinters();
      if (args[0]) {
        if (!this.printer) {
          this.$message.info('请选择打印机');
          return;
        }
      }
      this.$emit('printConfirm', args);
    }
  },
}
</script>
<style lang="less" scoped>
.printForm {
  .innerImg {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
.printForm {
  .el-select {
    width: 300px;
  }
  .el-radio-group .el-radio {
    padding-top: 10px;
  }
}

.el-popover {
  img {
    width: 100%;
  }
}
</style>
