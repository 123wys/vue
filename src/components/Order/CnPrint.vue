<template>
  <el-dialog v-model="dialogShow" ref="cnPrint" custom-class="cnPrint" title="菜鸟面单" :close-on-click-modal="false" @open="getPrinterInfo">
    <el-form :model="cnForm" ref="cnForm" :rules="rules" label-width="115px" label-position="right">
      <el-form-item label="选择打印机" prop="printer">
        <el-select v-model="cnForm.printer">
          <el-option v-for="option in printerEnum" :label="option.name" :value="option.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择店铺" prop="accessToken" v-if="shopEnum.length">
        <el-select v-model="cnForm.accessToken">
          <el-option v-for="option in shopEnum" :label="option.label" :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择快递公司" prop="logisticType" v-if="cnForm.accessToken">
        <el-select v-model="cnForm.logisticType" @change="selectLogistic">
          <el-option v-for="(key, value) in logisticTypeEnum" :label="key" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择快递网点" prop="branchName" v-if="branchAccount.length">
        <el-select v-model="cnForm.branchName">
          <el-option v-for="(key, value) in branchEnum" :label="key" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择发货地址" prop="addressIndex" v-if="cnForm.branchName">
        <el-radio-group v-model="cnForm.addressIndex">
          <div>
            <el-radio v-for="(option, index) in addressEnum" :label="`${index}`">{{option}}</el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发件人姓名" prop="name" v-if="cnForm.addressIndex">
        <div class="inputWidth">
          <el-input v-model="cnForm.name" placeholder="请填写发件人姓名"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="发件人手机号" prop="mobile" v-if="cnForm.addressIndex">
        <div class="inputWidth">
          <el-input v-model.number="cnForm.mobile" placeholder="选填"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="发件人固话" prop="phone" v-if="cnForm.addressIndex">
        <div class="inputWidth">
          <el-input v-model="cnForm.phone" placeholder="选填"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="选择面单模板" prop="esUrl" v-if="templateUrl.length">
        <el-select v-model="cnForm.esUrl">
          <el-option v-for="(option, i) in templateUrl" :label="option.user_std_template_name" :value="`${i}`"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" size="small" @click="print">确定</el-button>
        <el-button size="small" @click="dialogShow = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import axios from 'axios';
import {
  printerData,
  // getAllStdtemplates,
  isvSearch,
  getMyStdtemplates,
  getMyCustomTemplate,
  orderPrint,
} from '../../assets/printWebSocket.js';
export default {
  name: 'cn-print',
  props: {
    selectOrders: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dialogShow: false,
      printerEnum: {},
      shopEnum: [],
      cnForm: {
        printer: '',
        accessToken: '',
        logisticType: '',
        branchName: '',
        addressIndex: '',
        name: '',
        mobile: '',
        phone: '',
        esUrl: ''
      },
      branchAccount: [],
      templateUrl: [],
      rules: {
        printer: [{
          required: true,
          message: '请选择打印机',
          trigger: 'submit'
        }],
        accessToken: [{
          required: true,
          message: '请选择店铺',
          trigger: 'submit'
        }],
        branchName: [{
          required: true,
          message: '请选择网点',
          trigger: 'submit'
        }],
        addressIndex: [{
          required: true,
          message: '请选择发货地址',
          trigger: 'submit'
        }],
        name: [{
          required: true,
          message: '请填写发件人姓名',
          trigger: 'submit'
        }],
        esUrl: [{
          required: true,
          message: '请选择电子面单模板',
          trigger: 'submit'
        }]
      },
    };
  },
  computed: {
    logisticTypeEnum() {
      return this.$store.state.enumSet.cnLogisticType;
    },
    branchEnum() {
      let options = {};
      if (this.branchAccount.length) {
        this.branchAccount.forEach((ele, ind) => {
          options[ind] = ele.branch_name;
        })
      }
      return options;
    },
    addressEnum() {
      let options = [];
      if (this.branchAccount.length && this.cnForm.branchName > '-1') {
        this.branchAccount[this.cnForm.branchName].shipp_address_cols.address_dto.forEach((ele, ind) => {
          options[ind] = ele.province + ele.city + ele.district + ele.detail;
        })
      }
      return options;
    },
  },
  methods: {
    getPrinterInfo() {
      this.getShop();
      this.printerEnum = printerData;
    },
    getShop() {
      let arr = [];
      axios.get('customer/shopInfo/newQueryShopGroupByPlatform')
        .then(res => {
          let result = res.data.beanList.filter(ele => {
            return ele.platformId === 'TMALL';
          })
          if (result.length) {
            result.forEach(ele => {
              arr.push({
                label: ele.shopTitle,
                value: ele.accessToken,
                userId: ele.extShopId
              })
            })
          } else {
            this.$message.info('暂无可用淘宝店铺');
          }
        })
      this.shopEnum = arr;
    },
    selectLogistic(val) {
      let session = this.cnForm.accessToken;
      let cpCode = val;
      this.getTemplate();
      isvSearch(session, cpCode)
        .then(res => {
          if (!res.data.waybill_apply_subscription_cols.waybill_apply_subscription_info) {
            this.$message.info('暂无与该快递公司的合作关系');
          } else {
            this.branchAccount = res.data.waybill_apply_subscription_cols.waybill_apply_subscription_info[0].branch_account_cols.waybill_branch_account;
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTemplate() {
      let session = this.cnForm.accessToken;
      getMyStdtemplates(session)
        .then(res => {
          let result = res.data.result.datas.user_template_result;
          result.forEach(ele => {
            if (ele.cp_code === this.cnForm.logisticType) {
              this.templateUrl = ele.user_std_templates.user_template_do;
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMyCustom() {
      let session = this.cnForm.accessToken;
      let id = this.templateUrl[this.cnForm.esUrl].user_std_template_id;
      return getMyCustomTemplate(session, id)
    },
    print() {
      let session = this.cnForm.accessToken;
      if (!session) {
        this.$message.info('请先绑定一个可用的淘宝店铺');
        this.dialogShow = false;
        return;
      }
      this.$refs.cnForm.validate(valid => {
        if (valid) {
          this.getMyCustom()
          .then(res => {
            orderPrint(session, this.selectOrders, this.shopEnum, this.cnForm, this.branchAccount, this.templateUrl, res.data);
            this.dialogShow = false;
          })
          .catch(err => {
            this.$message.error(err.response ? err.response.data : err);
          })
        }
      })
    }
  },
}
</script>
<style scoped lang="less">
@import '../../main.less';
.cnPrint {
  padding: 5px;
  .inputWidth {
    width: 195px;
  }
}
</style>
