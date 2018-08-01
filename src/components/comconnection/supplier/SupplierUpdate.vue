<template>
  <div class="business-update">
    <el-breadcrumb separator=">">
      <span class="breadcrumb-head">当前位置：</span>
      <el-breadcrumb-item :to="{ path: '/supplierList' }">我的供应商</el-breadcrumb-item>
      <el-breadcrumb-item>供应商信息修改</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style='width:500px;'>
      <el-form-item label="商家logo" class='logos'>
        <el-row>
          <el-col :span="9">
            <div class="grid-content bg-purple" @mouseenter='dialogShow = true' @mouseleave='dialogShow =false'>
              <el-upload class="avatar-uploader" :action="baseUrl+'upload/uploadImage'" :show-file-list="false" :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload" :multiple='true' :with-credentials='true' :on-error="handleAvatarError" :on-progress="handleAvatarProgress">
                <img v-if="currentLogo" :src="currentLogo" class="avatar" style='max-width:100px;max-height:100px;'>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <transition name="fades">
                  <div v-show='dialogShow' class="upload-dialog">
                    <div style="height:20px"></div>
                    <i class="icon iconfont icon-wenjianshangchuan"></i>
                    <div style="color:#fff;font-size:12px;">点击上传图片</div>
                  </div>
                </transition>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="grid-content bg-purple-light">
              <div class="tip-box">
                <p style='margin-top:60px;'>提示:</p>
                <p>仅支持JPG、PNG格式图片，大小不超过1M（方圆型）</p>
                <p>商家logo将展示与供应/销售商市场中</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="商家名称" prop='enterpriseTitle'>
        <el-input v-model="ruleForm.enterpriseTitle"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop='contacts'>
        <el-input v-model="ruleForm.contacts"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop='mobile'>
        <el-input v-model="ruleForm.mobile" :disabled='true'></el-input>
      </el-form-item>
      <el-form-item label="固定电话" style='width:300%'>
        <el-input v-model="areaCode" style='float:left;width:130px'></el-input>
        <div style='float:left;width:40px;text-align:center'>-</div>
        <el-input v-model="areaContent" style='float:left;width:230px'></el-input>
        <div style='float:left;width:40px;margin-left:10px;'>选填</div>
      </el-form-item>
      <el-form-item label="办公地址" style='width:300%' prop='locDistrict'>
        <addressx :ruleForm='ruleForm' :addmark='addmark'></addressx>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  baseUrl
} from '../../../assets/baseUrl'
import addressx from '../businessDetail/address'
import {
  mapActions
} from 'vuex'
export default {
  components: {
    addressx
  },
  name: 'supplierUpdate',
  data() {
    //  商家名称验证
    var checkEnterpriseTitle = (rule, value, callback) => {
      if (!value) {
        callback(new Error('商家名称不能为空'));
      } else {
        callback();
      }
    };
    //  检查手机号码
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('手机号码不能为空'));
      } else {
        if (!(/^1[34578]\d{9}$/.test(value))) {
          callback(new Error('请输入正确的手机号码'));
        }
        callback();
      }
    };
    return {
      supplierId: '',
      baseUrl: '',
      currentLogo: '',
      addmark: {
        pf: true,
        cf: true
      },
      areaCode: '',
      areaContent: '',
      dialogShow: false,
      options: [{
        value: '服装服饰',
        label: '服装服饰'
      }, {
        value: '工艺礼品',
        label: '工艺礼品'
      }, {
        value: '图文图书',
        label: '图文图书'
      }],
      ruleForm: {
        category: [],
        authType: '',
        contacts: '',
        createOp: '',
        createTime: '',
        doneTime: '',
        email: '',
        enterpriseAcronym: '',
        enterpriseTitle: '',
        fax: '',
        locAddress: '',
        locCity: '',
        locDistrict: '',
        locProvince: '',
        logoUrl: '',
        logoUrlSrc: '',
        mobile: '',
        modifiedFieldSet: [],
        remarks: '',
        state: '',
        telephone: '',
        tenantClass: '',
        tenantId: '',
        tenantType: '',
        zipCode: '',
        editFlag: 1
      },
      rules: {
        enterpriseTitle: [{
          validator: checkEnterpriseTitle,
          trigger: 'blur'
        }],
        type: [{
          type: 'array',
          required: true,
          message: '请至少选择一个商家类型',
          trigger: 'change'
        }],
        contacts: [{
          required: true,
          message: '请输入联系人名称',
          trigger: 'blur'
        }, {
          min: 1,
          max: 10,
          message: '长度在 1 到 10 个字符',
          trigger: 'blur'
        }],
        mobile: [{
          validator: checkMobile,
          trigger: 'blur'
        }],
        locDistrict: [{
          required: true,
          message: '请选择完整地址',
          trigger: 'change'
        }],
      }
    }
  },
  activated() {
    this.supplierId = JSON.parse(window.sessionStorage.supplierInfo).tenantFullInfo.tenantInfo.tenantId;
    this.baseUrl = baseUrl;
    this.addmark.pf = true;
    this.addmark.cf = true;
    this.getmsg();
  },
  computed: {},
  methods: {
    ...mapActions([
      'getIchannel'
    ]),
    //  获取商家信息
    getmsg() {
      let query = {
        tenantId: this.supplierId
      }
      this.axios.post('/customer/tenantInfo/getTenantById', query).then(response => {
        this.ruleForm = Object.assign({}, this.ruleForm, response.data);
        var a = this.ruleForm.telephone.split('-');
        if (a[0]) {
          this.areaCode = a[0];
        }
        if (a[1]) {
          this.areaContent = a[1];
        }
        this.currentLogo = this.ruleForm.logoUrlSrc;
      }).catch(error => {
        this.$message.error(error.response.data);
      });
    },
    //  头像上传成功回调
    handleAvatarScucess(res, file) {
      this.ruleForm.logoUrl = res;
      this.currentLogo = file.url;
    },
    handleAvatarError(err, file) {
      this.currentLogo = this.ruleForm.logoUrl;
      console.log(err);
      this.$message.error('图片上传出现了点小问题')
    },
    handleAvatarProgress(event, file) {
      // this.currentLogo = '//hgkcdn.oss-cn-shanghai.aliyuncs.com/Eggprod/img/timg.gif';
      this.currentLogo = require('../businessDetail/timg.gif');
    },
    //  头像上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      if (isJPG && isLt2M) {
        // this.currentLogo = 'http://hgkcdn.oss-cn-shanghai.aliyuncs.com/Eggprod/img/timg.gif';
      }
      return isJPG && isLt2M;
    },
    //  表单提交
    submitForm(formName) {
      var _self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.areaCode && this.areaContent) {
            var telephone = this.areaCode + '-' + this.areaContent;
            this.ruleForm.telephone = telephone;
          } else {
            this.ruleForm.telephone = '';
          }
          this.ruleForm.editFlag = 1;
          this.axios.post('/customer/tenantInfo/updateTenantInfo', this.ruleForm).then(function(response) {
            // _self.getIchannel(_self);
            _self.$message({
              message: '信息修改成功',
              type: 'success'
            });
            _self.$router.push('/supplierList');
          }).catch(function(error) {
            _self.$message.error(error.response.data);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //  返回
    goBack() {
      this.addmark.pf = true;
      this.addmark.cf = true;
      this.$router.push({
        path: '/supplierList'
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '../../../main.less';
.business-update {
  padding: 15px;
}

.upload-dialog {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 118px;
  height: 118px;
  background: #000;
  opacity: 0.7;
}

.tip-box {
  position: relative;
  width: 150%;
  p {
    width: 100%;
    height: 20px;
    margin: 0;
    font-size: @smallSize;
    line-height: 20px;
    color: @darkGary;
  }
}

.icon-wenjianshangchuan {
  color: #ccc;
  font-size: 30px;
  transition: all 1s;
}

.icon-wenjianshangchuan:hover {
  color: #fff;
  text-shadow: 5px 5px 35px #FFF;
  // animation: icon-change 0.5s;
}

@keyframes icon-change {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.fades-enter-active,
.fades-leave-active {
  transition: all .5s
}

.fades-enter,
.fades-leave-to {
  transform: translateY(120px);
  opacity: 0;
}
</style>
<style>
.business-update .el-form-item.is-required .el-form-item__label:before {
  content: '';
}

.business-update .main-sale .el-form-item__content {
  line-height: 0;
}

.logos .el-upload {
  position: relative;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 120px;
  height: 120px;
  background: #F9FAFC;
  border: 1px solid #eee;
}

.logos .el-upload__files {
  display: none;
}

.logos .el-upload__inner {
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  cursor: pointer;
}

.logos .avatar-uploader-icon {
  color: #D3DCE6;
  transform: scale(3);
}
</style>
