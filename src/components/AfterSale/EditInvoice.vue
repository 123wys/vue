<template>
  <div class="EditInvoice">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item>售后管理</el-breadcrumb-item>
      <el-breadcrumb-item>补开发票</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :rules="rules" ref="ruleForm" :model="ruleForm" label-width="120px" label-position="right" style="width: 800px;">
      <el-form-item label="原始订单号">
        <div style="display: table;">
          <el-input size="small" style="display: table-cell;width:260px;padding-right:10px;" v-model.trim="ruleForm.extOrderId"></el-input>
          <el-button size="small" style="display: table-cell;width:50px" @click="queryRawOrder">搜索</el-button>
          <span style="display: table-cell" class="tips">
            请选择已完成订单进行创建!
          </span>
        </div>
      </el-form-item>
      <el-form-item label="发票抬头" prop="invoiceTitle">
        <el-input size="small" style="width: 250px;" v-model.trim="ruleForm.invoiceTitle"></el-input>
      </el-form-item>
      <el-form-item label="发票类型" prop="invoiceKind">
        <el-radio-group v-model="ruleForm.invoiceKind">
          <el-radio label="1">普票</el-radio>
          <el-radio label="2">增票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开票资料">
        <p style="margin: 0;line-height:1.2em">增票或普票均需要提供公司名称、地址、电话、税号、开户银行和账号:增票必须提供一般纳税人资格证明，否则申请失效</p>
        <el-upload :action="actionUrl" ref="upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :file-list="fileList" :on-remove="handleRemove" :on-success="handleSuccess" :with-credentials="true" :on-error="handleError">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-input v-model.trim="fileUrl" placeholder="通过链接上传" size="small" style="width:250px"></el-input>
        <el-button @click="addImage" size="small">添加</el-button>
        <!-- <button @click="showArr">显示图片arr</button> -->
      </el-form-item>
      <el-form-item label="邮寄联系人" prop="addr.name">
        <el-input style="width:250px" size="small" v-model.trim="ruleForm.addr.name"></el-input>
      </el-form-item>
      <el-form-item label="发票邮寄电话" prop="addr.mobile">
        <el-input style="width:250px" size="small" v-model.trim="ruleForm.addr.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮寄地址" prop="addr.address">
        <DistrictSelect style="width: 250px" :province="ruleForm.addr.province" :city="ruleForm.addr.city" :district="ruleForm.addr.district" @district-change="districtChange"></DistrictSelect>
        <el-input placeholder="详细地址" style="width:300px" v-model.trim="ruleForm.addr.address"></el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input style="width:250px" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model.trim="ruleForm.serviceMemo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submit">立即创建</el-button>
        <el-button size="small" @click="reset">取消</el-button>
        <el-button type="success" size="small" @click="goAfterSale">查看发票</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios';
import DistrictSelect from '../common/DistrictSelect'
const queryRawOrderUrl = '/order/order/queryOrderSimple'
const apply4InvoiceUrl = '/afterSale/afterSale/apply4Invoice'
export default {
  name: 'EditInvoice',
  data() {
    return {
      ruleForm: {
        serviceMemo: '',
        extOrderId: '',
        invoiceKind: '',
        invoiceTitle: '',
        addr: {
          name: '',
          mobile: '',
          province: '',
          city: '',
          district: '',
          address: ''
        },
      },
      rules: {
        invoiceTitle: [{
          required: true,
          message: '请输入发票抬头',
          trigger: 'blur'
        }],
        invoiceKind: [{
          required: true,
          message: '请选择发票类型',
          trigger: 'change'
        }],
        serviceMemo: [{
          required: true,
          message: '备注信息不能为空',
          trigger: 'blur'
        }],
        'addr.name': [{
          required: true,
          message: '请输入邮寄联系人',
          trigger: 'blur'
        }],
        'addr.mobile': [{
          required: true,
          message: '请输入邮寄电话',
          trigger: 'blur'
        }],
        'addr.address': [{
          required: true,
          message: '请输入邮寄地址',
          trigger: 'blur'
        }]
      },
      //  照片上传
      fileUrl: '',
      actionUrl: '',
      fileArr: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  components: {
    DistrictSelect
  },
  activated() {},
  mounted() {
    this.actionUrl = axios.defaults.baseURL + 'upload/invoiceImage'
  },
  methods: {
    goAfterSale() {
      this.$router.push({
        path: '/aftersalemanagement',
        query: {
          type: 1
        }
      })
    },
    reset() {
      this.ruleForm.serviceMemo = '';
      this.ruleForm.extOrderId = '';
      // this.ruleForm.invoiceKind = '';
      this.ruleForm.invoiceTitle = '';
      Object.keys(this.ruleForm.addr).forEach(el => {
        this.ruleForm.addr[el] = '';
      })
      this.fileUrl = '';
      this.fileArr = [];
      this.fileList = [];
      this.dialogImageUrl = '';
    },
    submit() {
      // console.log(this.fileArr)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          var data = {
            warranty: {
              extOrderId: this.ruleForm.extOrderId,
              contactName: this.ruleForm.addr.name,
              contactMobile: this.ruleForm.addr.mobile,
              serviceMemo: this.ruleForm.serviceMemo
            },
            invoice: {
              invoiceKind: Number(this.ruleForm.invoiceKind),
              invoiceTitle: this.ruleForm.invoiceTitle,
              invoiceType: '默认'
            },
            images: this.fileArr,
            consigneeBean: {
              receiverName: this.ruleForm.addr.name,
              receiverMobile: this.ruleForm.addr.mobile,
              receiverState: this.ruleForm.addr.province,
              receiverCity: this.ruleForm.addr.city,
              receiverDistrict: this.ruleForm.addr.district,
              receiverAddress: this.ruleForm.addr.address
            }
          }
          axios.post(apply4InvoiceUrl, data).then((res) => {
            this.$message.success('创建发票售后单成功');
            this.reset();
          }).catch((err) => {
            this.$msgbox({
              title: '提示',
              message: '创建发票售后单失败，' + (err.response ? err.response.data : err),
              type: 'error',
            })
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //  查询商城订单
    queryRawOrder() {
      if (!this.ruleForm.extOrderId) {
        return false;
      }
      var data = {
        queryCondition: {
          // extOrderIds: [this.ruleForm.extOrderId]
          outOrderId: [this.ruleForm.extOrderId]
        },
        pageSize: 10,
        pageNumber: 1
      }
      axios.post(queryRawOrderUrl, data).then((res) => {
        if (res.data.beanList && res.data.beanList.length) {
          this.ruleForm.addr.province = res.data.beanList[0].orders[0].receiverState;
          this.ruleForm.addr.city = res.data.beanList[0].orders[0].receiverCity;
          this.ruleForm.addr.district = res.data.beanList[0].orders[0].receiverDistrict;
          this.ruleForm.addr.address = res.data.beanList[0].orders[0].receiverAddress;
          this.ruleForm.addr.name = res.data.beanList[0].orders[0].receiverName;
          this.ruleForm.addr.mobile = res.data.beanList[0].orders[0].receiverMobile;
        } else {
          this.$message.error('查找不到订单！')
        }
      }).catch((err) => {
        this.$msgbox({
          title: '提示',
          message: '商城订单获取失败，' + (err.response ? err.response.data : err),
          type: 'error',
        })
      })
    },
    //  收件人地址变化
    districtChange(val) {
      this.ruleForm.addr.province = val[0];
      this.ruleForm.addr.city = val[1];
      this.ruleForm.addr.district = val[2];
    },
    //  显示图片数组传到后台
    showArr() {
      console.log(this.fileArr)
    },
    //  显示图片列表用来渲染ui
    showFile() {
      console.log(this.fileList)
    },
    //  通过Url添加图片
    addImage() {
      if (!this.fileUrl) {
        return false;
      }
      this.fileList.push({
        name: 'iboss',
        upUrl: this.fileUrl,
        url: this.fileUrl
      })
      this.fileArr.push(this.fileUrl);
      this.fileUrl = '';
    },
    handleSuccess(response, file, fileList) {
      file.upUrl = response;
      this.fileArr.push(response);
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      var upUrl = file.upUrl;
      var position = '';
      this.fileArr.forEach((el, index) => {
        if (el.indexOf(upUrl) >= 0) {
          position = index;
        }
      })
      this.fileList = fileList;
      this.fileArr.splice(position, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleError() {
      this.$message.error('只能上传jpg/png文件，且不超过500k')
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../main.less';
.tips {
  padding-left: 10px;
  font-size: 12px;
  color: @lightGary;
}

.EditInvoice {
  color: @lightBlack;
  padding: @normalSize;
  > div + div {
    margin-top: 15px;
  }
}
</style>
