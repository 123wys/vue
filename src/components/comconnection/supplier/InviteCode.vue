<template>
  <div>
    <nav-top :title="'供应商入驻'" :linkTo="{path: '/login',label: '立即登录', des: '已有账号？'}"></nav-top>
    <div class="bg">
      <div class="inviteCode">
        <div class="inviteCode_body">
          <el-steps :active="activeNum" :center="true" :align-center="true" process-status="finish">
            <el-step title="填写邀请码"></el-step>
            <el-step title="账号设定"></el-step>
            <!-- <el-step title="选择类目"></el-step> -->
            <el-step title="注册成功"></el-step>
          </el-steps>
          <div class="form" v-if="[0, 1, 2].includes(activeNum)">
            <el-form :model="inviteForm" :rules="rules" ref="inviteForm" label-width="80px">
              <el-form-item prop="inviteCode" label="邀请码" v-if="activeNum === 0">
                <el-input placeholder="请输入8位邀请码" v-model.trim="inviteForm.inviteCode">
                </el-input>
              </el-form-item>
              <el-form-item label=" " v-if="activeNum === 0">
                <el-button type="primary" style="width:100%;" @click="checkCode('inviteForm')">验证</el-button>
              </el-form-item>
              <!-- 防止浏览器自动填入账号密码 -->
              <input style="display:none" type="text" name="fakeusernameremembered"/>
              <input style="display:none" type="password" name="fakepasswordremembered"/>
              <el-form-item prop="mobile" label="手机号" v-if="activeNum === 2">
                <span v-text="inviteForm.mobile"></span>
              </el-form-item>
              <el-form-item prop="enterpriseTitle" label="商家名" v-if="activeNum === 2">
                <el-input v-model.trim="inviteForm.enterpriseTitle">
                </el-input>
              </el-form-item>
              <el-form-item prop="contacts" label="联系人" v-if="activeNum === 2">
                <el-input v-model.trim="inviteForm.contacts">
                </el-input>
              </el-form-item>
              <el-form-item class="psw" prop="invitePsw" label="密码" v-if="activeNum === 2">
                <el-input placeholder="由字母、数字、符号任意组合的6-12位密码" v-model.trim="inviteForm.invitePsw" :type="showPsw" auto-complate="off">
                </el-input>
                <div class="showpsw"><i :class="showCode" @click="showPswToggle"></i></div>
              </el-form-item>
              <el-form-item label=" " v-if="activeNum === 2">
                <el-checkbox v-model="isAgree">同意<a href="#/join">《小亚通注册协议条款》</a></el-checkbox>
              </el-form-item>
              <el-form-item label=" " v-if="activeNum === 2">
                <el-button type="primary" style="width:100%;" @click="checkCodeNext('inviteForm')">接受邀请</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- <div class="itemCat" v-if="activeNum === 3">
            <el-row :gutter="20">
              <el-col :span="6" v-for="(item, index) in itemCat" style="text-align:center;margin-top: 20px;">
                <el-button class="button" :class="{'btn_checked': item.check}" @click="btnChecked(index)"><span v-text="item.label"></span><i v-if="item.check" class="el-icon-check" style="margin-left: 15px;position:absolute;"></i></el-button>
              </el-col>
              <el-col :span="10">
                <el-row style="margin-top:20px;">
                  <el-col :span="4"><span class="txt">其他 : </span></el-col>
                  <el-col :span="20">
                    <input class="input_border" v-model="others" type="text" placeholder="以上都不是？请输入（10个字以内）">
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row style="text-align:right;" v-if="isChecked">
              <span class="danger">请至少选择一个类目！</span>
            </el-row>
            <el-row style="float:right;margin-top:10px;">
              <el-col>
                <el-button @click="pre">上一步</el-button>
                <el-button type="primary" @click="next">下一步</el-button>
              </el-col>
            </el-row>
          </div> -->
          <div class="follow" v-if="activeNum === 3">
            <p><i class="el-icon-circle-check"></i>亲爱的管理员，恭喜您注册成功</p>
            <div class="qrcode">
              <img src="../../../assets/img/qrcode.jpg" alt="小亚科技二维码">
             <!--  <p>关注小亚通订阅号</p>
              <p>获取实时资讯</p> -->
            </div>
            <el-button type="primary" @click="getIn">去登录</el-button>
          </div>
        </div>
      </div>
    </div>
    <cr-footer></cr-footer>
  </div>
</template>
<script>
import axios from 'axios'
import NavTop from '../../common/NavTop'
import CrFooter from '../../common/CrFooter'
export default {
  props: ['title', 'linkTo'],
  name: 'inviteCode',
  data() {
    var pswCheck = function(rule, value, callback) {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      let reg = new RegExp(/[\w\d\D]{6,12}/g);
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error('由字母、数字、符号任意组合的6-12位密码'))
      }
    };
    var inviteCodeCheck = function(rule, value, callback) {
      if (!value) {
        return callback(new Error('邀请码不能为空'))
      }
      return callback();
    };
    return {
      activeNum: 0,
      isAgree: true,
      isChecked: false,
      showToggle: false,
      // others: '',
      inviteForm: {
        inviteCode: '',
        authType: 0,
        contacts: '',
        createOp: 4002,
        createTime: '2017-03-02 18:32:31',
        doneTime: '2017-03-02 18:32:31',
        enterpriseAcronym: '',
        enterpriseTitle: 'abb',
        locAddress: '',
        locCity: '',
        locDistrict: '',
        locProvince: '',
        logoUrl: '',
        mobile: '',
        modifiedFieldSet: [],
        remarks: '',
        state: 1,
        tenantClass: 0,
        tenantId: 77,
        tenantType: 2,
        zipCode: '',
        invitePsw: '',
      },
      rules: {
        inviteCode: [{
          validator: inviteCodeCheck,
          trigger: 'formSubmit'
        }],
        invitePsw: [{
          validator: pswCheck,
          trigger: 'formSubmit'
        }]
      },
    //   itemCat: [{
    //     label: '服装',
    //     check: false
    //   }, {
    //     label: '鞋靴',
    //     check: false
    //   }, {
    //     label: '箱包',
    //     check: false
    //   }, {
    //     label: '配饰',
    //     check: false
    //   }, {
    //     label: '母婴用品',
    //     check: false
    //   }, {
    //     label: '童装玩具',
    //     check: false
    //   }, {
    //     label: '日用百货',
    //     check: false
    //   }, {
    //     label: '工艺品',
    //     check: false
    //   }, {
    //     label: '食品生鲜',
    //     check: false
    //   }, {
    //     label: '家纺家饰家装',
    //     check: false
    //   }, {
    //     label: '3C，日用电器',
    //     check: false
    //   }, {
    //     label: '图书',
    //     check: false
    //   }, {
    //     label: '办公用品',
    //     check: false
    //   }]
    }
  },
  components: {
    NavTop,
    CrFooter
  },
  methods: {
    showPswToggle() {
      this.showToggle = !this.showToggle
    },
    checkCode(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let query = {};
          query.inviteCode = this.inviteForm.inviteCode;
          console.log(query)
          axios.post('/noLogin/tenantEnter/getInviteInfo', query)
            .then(res => {
              let invite = res.data.invite;
              invite.inviteCode = this.inviteForm.inviteCode;
              invite.invitePsw = '';
              this.inviteForm = invite;
              console.log(this.inviteForm)
              switch (this.activeNum) {
                case 0:
                case 1:
                  this.activeNum = 2;
                  break;
                case 2:
                  this.activeNum = 3;
                  break;
              }
            })
            .catch(err => {
              this.$message.error({
                message: err.response ? err.response.data : err
              })
            })
        }
      })
    },
    checkCodeNext(form) {
      if (this.isAgree) {
        this.$refs[form].validate(valid => {
          if (valid) {
            let query = {};
            query.inviteCode = this.inviteForm.inviteCode;
            query.contacts = this.inviteForm.contacts;
            query.password = this.inviteForm.invitePsw;
            query.mobile = this.inviteForm.mobile;
            query.name = this.inviteForm.enterpriseTitle;
            console.log(query)
            axios.post('/noLogin/tenantEnter/updateTenantByInviteCode', query)
              .then(() => {
                switch (this.activeNum) {
                  case 1:
                    this.activeNum = 2;
                    break;
                  case 2:
                    this.activeNum = 3;
                    break;
                }
              })
              .catch(err => {
                this.$message.error({
                  message: err.response ? err.response.data : err
                })
              })
          }
        })
      } else {
        this.$message.info({
          message: '请阅读并同意《小亚通注册协议条款》'
        })
      }
    },
    // btnChecked(i) {
    //   this.itemCat[i].check = !this.itemCat[i].check;
    // },
    pre() {
      this.activeNum = 2;
    },
    // next() {
    //   let result = this.itemCat.every((ele) => {
    //     if (ele.check === false) {
    //       return true
    //     }
    //   });
    //   if (result && !this.others) {
    //     this.isChecked = true;
    //   } else {
    //     this.activeNum = 4;
    //   }
    // },
    getIn() {
      this.$router.push('/login');
    }
  },
  computed: {
    showCode() {
      let icon = 'icon iconfont icon-iconfont32pxmimabukejian';
      if (this.showToggle) {
        icon = 'icon iconfont icon-mimakejian';
      }
      return icon;
    },
    showPsw() {
      let type = 'text';
      if (!this.showToggle) {
        type = 'password';
      }
      return type;
    },
  },
}
</script>
<style lang="less" scoped>
@import '../../../main.less';
.bg {
  background-color: @pageBg;
  overflow: hidden;
  min-width: 1000px;
}

.inviteCode {
  width: 1288px;
  margin: 0 auto;
}

.inviteCode_body {
  width: 1000px;
  margin: 0 auto;
  margin-top: 30px;
  height: 480px;
  .form {
    width: 440px;
    margin: 50px auto 0;
    // .replace {
    //   color: @darkGary;
    //   margin-left: @largeSize;
    //   text-decoration: underline;
    //   cursor: pointer;
    // }
    .psw {
      position: relative;
    }
    .showpsw {
      position: absolute;
      top: 2px;
      right: @smallSize;
      z-index: 3;
      cursor: pointer;
    }
  }
  .itemCat {
    width: 700px;
    margin: 0 auto;
    .button {
      font-size: 12px;
      width: 150px;
      color: @lightBlack;
    }
    .btn_checked {
      border-color: @blue;
      color: @blue;
    }
    .input_border {
      border: none;
      border-bottom: 1px solid @lightBlack;
      width: 100%;
      line-height: 34px;
      &:focus {
        outline: none;
      }
    }
    .txt {
      line-height: 34px;
    }
    .danger {
      color: @danger;
    }
  }
  .follow {
    text-align: center;
    p {
      font-size: 16px;
      color: @success;
    }
    .qrcode {
      width: 202px;
      height: 249px;
      margin: 0 auto;
      padding-top: 20px;
      img{
        width: 100%;
        // height: 100%;
      }
    }
  }
}

.inviteCode_bottom {
  p {
    text-align: center;
    margin: 30px 0;
    color: @darkGary;
  }
}
</style>
